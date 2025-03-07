import * as React from 'react'

export function useRefCallback<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  return React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    (...args: any[]) => callbackRef.current(...args),
    [],
  ) as T
}

export default useRefCallback
