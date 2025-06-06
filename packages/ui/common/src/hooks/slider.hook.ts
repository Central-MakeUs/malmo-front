import React, { useEffect, useRef, useState } from 'react'

export const useSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!sliderRef.current) return
    setIsGrabbing(true)
    setStartX(e.clientX)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsGrabbing(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!isGrabbing || !sliderRef.current) return
    e.preventDefault()
    const x = e.clientX
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth,
        behavior: 'smooth',
      })
    }
  }

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.clientWidth,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleScroll = () => {
      const { scrollLeft, clientWidth } = slider
      const newPage = Math.round(scrollLeft / (clientWidth * 0.77))
      setCurrentPage(newPage)
    }

    slider.addEventListener('scroll', handleScroll)
    return () => slider.removeEventListener('scroll', handleScroll)
  }, [])

  return {
    sliderRef,
    isGrabbing,
    currentPage,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    scrollNext,
    scrollPrev,
  }
}
