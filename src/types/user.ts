/**用户注册表单 */
export interface IRegisterForm {
  email: string
  name: string
  password: string
  gender: string
  qq: string
  mobile: string
  major: string
  studentId: string
  openid: string
  avatarBase64?: string
  checkPass?: string
}

/**角色 */
type role = {
  id: string
  name: string
  description: string
}

/**权限 */
type permission = {
  id: string
  operation: string
  target: string
}

/**用户信息 */
export type IUserInfo = {
  id: string
  email: string
  name: string
  gender: string
  avatar: string
  avatarBase64: string
  qq: string
  mobile: string
  major: string
  studentId: string
  openid: string
  lastModifyTime: string
  role: Array<role>
  permissions: Array<permission>
  token: string
}

/**登录信息 */
export interface ILoginInfo {
  userInfo: IUserInfo
  token: string
}

/** 用户登录表单 */
export interface ILoginForm {
  id: string
  email: string
  studentId: string
  password: string
}
