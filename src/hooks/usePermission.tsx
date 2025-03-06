import useRefCallback from './useRefCallback'
import { useLoginStore } from '@/store/login'
import { token } from '@/utils'

export const usePermission = () => {
  const userInfo = useLoginStore((state) => state.userInfo)

  /**检验是否是管理员权限 */
  // const isAdmin = useRefCallback(() => {
  //   return userInfo?.permission == PermissionType.Admin
  // })

  const isLogin = useRefCallback(() => {
    return !!token.getToken()
  })

  /**
   * 权限验证
   * @param permissionKey 权限key
   */
  // const checkPermission = useRefCallback((permissionKey?: string) => {
  //   if (!permissionKey) return true
  //   if (!userInfo) return false
  //   // if (isAdmin()) {
  //   //   return true
  //   // }
  //   return userInfo?.permission == permissionKey
  // })

  return {
    // checkPermission,
    // isAdmin,
    isLogin,
  }
}
