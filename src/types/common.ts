/**路由类型 */
export interface RouteType {
  /**路由名称 */
  name: string
  /**路由 */
  path: string
  /**权限 */
  permission?: string
  /**路由组件 */
  element?: JSX.Element
  // permission?: string;
  /**子路由 */
  children?: RouteType[]
}
