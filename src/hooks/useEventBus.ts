import { EventBus } from '@/utils/event'
import * as React from 'react'
import { useRefCallback } from './useRefCallback'

type Func = (...param: any[]) => any

export const useEventBus = (eventName: string, handler?: Func) => {
  React.useEffect(() => {
    if (!handler) {
      return () => {}
    }

    EventBus.on(eventName, handler)
    return () => {
      EventBus.off(eventName, handler)
    }
  }, [eventName, handler])

  const trigger = useRefCallback((...args: any[]) => {
    EventBus.emit(eventName, ...args)
  })

  return { trigger }
}
