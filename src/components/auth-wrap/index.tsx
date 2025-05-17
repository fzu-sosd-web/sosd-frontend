import * as React from 'react'
import { message, Spin } from 'antd'
import useRefCallback from '@/hooks/useRefCallback'
import { usePermission } from '@/hooks/usePermission'
import NotPermissionPage from '../other/not-permission-page'
import { fetchInfo } from '@/apis/login'
import { useLoginStore } from '@/store/login'
import { useLocation } from 'react-router-dom'

type AuthWrapProps = {
  permission?: string
  children?: React.ReactNode
}

export const AuthWrap: React.FC<AuthWrapProps> = React.memo(
  ({ children, permission = '' }) => {
    const { pathname } = useLocation()
    const { isLogin, checkPermission } = usePermission()
    const [hasPermission, setHasPermission] = React.useState(true)
    const [loading, setLoading] = React.useState(true)

    const init = useRefCallback(() => {
      const timer = setTimeout(() => {
        setLoading(true)
      }, 100)
      const flag = checkPermission(permission)
      clearTimeout(timer)
      setHasPermission(flag)
      setLoading(false)
    })

    React.useEffect(() => {
      init()
    }, [pathname, init])

    if (loading) return <Spin fullscreen tip="加载中" size="large" />
    if (!hasPermission) return <NotPermissionPage />

    return (
      <React.Suspense fallback={<Spin className="spin-full" delay={100} />}>
        {children}
      </React.Suspense>
    )
  },
)

export default AuthWrap
