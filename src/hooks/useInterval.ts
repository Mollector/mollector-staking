/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef<any>(null)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
