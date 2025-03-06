import createLazyComponent from '@/components/create-lazy-component'
import { RoutePath } from '@/constant/routes'
import { RouteType } from '@/types'
import { Component } from 'react'

const HomePage = createLazyComponent(() => import('@/views/home'))
export const homeRoutes: RouteType[] = [
  {
    name: '主页',
    path: RoutePath.Home,
    element: HomePage,
  },
]
