import { IUserInfo } from './user'
export type LoginStore = {
  /**用户信息 */
  userInfo: IUserInfo | null
  loading: boolean
  /**是否登录 */
  isLogin: boolean
}

export type LoginMethod = {
  setUserInfo: (data: IUserInfo | null) => void
  refreshUserInfo: (refresh?: boolean) => Promise<IUserInfo | null>
}
