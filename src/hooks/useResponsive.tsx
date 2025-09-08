'use client'

import { useState, useEffect } from 'react'

export interface BreakpointState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  width: number
  height: number
}

export const useResponsive = (): BreakpointState => {
  const [breakpoints, setBreakpoints] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: 0,
    height: 0
  })

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1440,
        isLargeDesktop: width >= 1440,
        width,
        height
      })
    }

    updateBreakpoints()
    window.addEventListener('resize', updateBreakpoints)

    return () => window.removeEventListener('resize', updateBreakpoints)
  }, [])

  return breakpoints
}

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Predefined breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1440px)')

// Responsive component wrapper
interface ResponsiveProps {
  mobile?: React.ReactNode
  tablet?: React.ReactNode
  desktop?: React.ReactNode
  fallback?: React.ReactNode
  children?: React.ReactNode
}

export const Responsive: React.FC<ResponsiveProps> = ({
  mobile,
  tablet,
  desktop,
  fallback,
  children
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  if (isMobile && mobile) return <>{mobile}</>
  if (isTablet && tablet) return <>{tablet}</>
  if (isDesktop && desktop) return <>{desktop}</>
  if (fallback) return <>{fallback}</>
  return <>{children}</>
}

// Responsive grid helper
export const getResponsiveColumns = (
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3,
  largeDesktop: number = 4
) => {
  return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} xl:grid-cols-${largeDesktop}`
}

// Touch-friendly sizing helpers
export const getTouchTarget = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    small: 'min-h-[44px] min-w-[44px]',
    medium: 'min-h-[48px] min-w-[48px]',
    large: 'min-h-[56px] min-w-[56px]'
  }
  return sizes[size]
}

// Responsive spacing
export const getResponsiveSpacing = (
  mobile: string = 'p-4',
  tablet: string = 'md:p-6',
  desktop: string = 'lg:p-8'
) => {
  return `${mobile} ${tablet} ${desktop}`
}