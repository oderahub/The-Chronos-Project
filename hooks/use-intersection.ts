// Intersection observer hook for animations
import { useEffect, useRef, useState } from 'react'

export function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isIntersecting }
}
