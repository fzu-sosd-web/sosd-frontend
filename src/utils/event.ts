export type EventFunc = (...param: any[]) => any

export type Event = {
  fn: EventFunc
  ctx: any
}

export class TinyEmitter {
  events: Record<string, Event[]>

  constructor() {
    this.events = {}
  }

  on(name: string, callback: EventFunc, ctx?: any) {
    // console.log(`%c[event on] ${name}`, 'color:green', callback?.name)
    if (!this.events?.[name]) {
      this.events[name] = []
    }
    this.events[name].push({
      fn: callback,
      ctx,
    })
    return this
  }

  once(name: string, callback: EventFunc, ctx?: any) {
    // console.log(`%c[event once] ${name}`, 'color:green', callback?.name)
    const listener = (...args: any[]) => {
      this.off(name, listener)
      callback?.apply?.(ctx, args)
    }
    listener._origin = callback

    this.events[name].push({
      fn: callback,
      ctx,
    })
    return this.on(name, listener, ctx)
  }

  off(name: string, callback: EventFunc) {
    // console.log(`%c[event off] ${name}`, 'color:green', callback?.name)
    const events = (this.events[name] || [])
      // eslint-disable-next-line
      // @ts-ignore
      .filter((item) => item.fn !== callback && item.fn?._origin !== callback)

    if (events?.length) {
      this.events[name] = events
    } else {
      delete this.events[name]
    }
    return this
  }

  emit(name: string, ...args: any[]) {
    // console.log(`%c[event emit] ${name}`, 'color:green', args)
    const evtArr = (this.events?.[name] || []).slice()
    // if (!evtArr?.length) {
    //   console.log(`%c[event emit notfound] ${name}`, 'color:red', args)
    // }
    evtArr.forEach((evt) => {
      evt?.fn?.apply(evt?.ctx, args)
    })

    return this
  }
}

export const EventBus = new TinyEmitter()

/**
 * 休眠
 * @param time 休眠时间ms 默认 1000
 * @returns
 */
export const sleep = (time = 1000) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time)
  })
