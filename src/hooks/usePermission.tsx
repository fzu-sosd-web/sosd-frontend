import useRefCallback from './useRefCallback'
import { useLoginStore } from '@/store/login'
import { token } from '@/utils'

export const usePermission = () => {
  const userInfo = useLoginStore((state) => state.userInfo)

  const isLogin = useRefCallback(() => {
    return !!token.getToken()
  })

  const isAdmin = useRefCallback(() => {
    if (!userInfo) return false
    if (!userInfo.roles) return false
    for (const role of userInfo.roles) {
      if (role.roleid === 'Admin') {
        return true
      }
    }
    return false
  })

  /**
   * 权限验证
   * @param permissionKey 权限key
   */
  const checkPermission = useRefCallback((permissionKey?: string) => {
    if (!permissionKey) return true
    if (!userInfo) return false
    if (isAdmin()) return true
    for (const permission of userInfo.permissions) {
      if (permission.target === permissionKey) {
        return true
      }
    }
    return false
  })

  return {
    checkPermission,
    isLogin,
    isAdmin,
  }
}
