import { RouteType } from '@/types'

/**路由表扁平化 */
export const flattenRoutes = (routes: RouteType[]) => {
  let result: RouteType[] = []
  const flatten = (routesArray: RouteType[]) => {
    routesArray.forEach((route) => {
      result.push(route)
      if (route.children) {
        flatten(route.children)
      }
    })
  }
  flatten(routes)
  return result
}
