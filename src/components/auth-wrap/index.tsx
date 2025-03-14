import * as React from 'react'
import { message, Spin } from 'antd'
import useRefCallback from '@/hooks/useRefCallback'
import { usePermission } from '@/hooks/usePermission'
import NotPermissionPage from '../other/not-permission-page'
import { fetchInfo } from '@/apis/login'

type AuthWrapProps = {
  children?: React.ReactNode
}

export const AuthWrap: React.FC<AuthWrapProps> = React.memo(({ children }) => {
  // const { pathname } = useLocation()
  const { isLogin } = usePermission()
  const [hasPermission, setHasPermission] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [name, setName] = React.useState('')

  const fetchUserInfo = async () => {
    const res = await fetchInfo()
    if (res.code === 200 && res.data) {
      setName(res.data.name)
    } else {
      message.error(res.msg)
    }
  }

  const init = useRefCallback(() => {
    const timer = setTimeout(() => {
      setLoading(true)
    }, 10000)
    const flag = isLogin() && name == '游文馨'
    clearTimeout(timer)
    setHasPermission(flag)
    setLoading(false)
  })

  React.useEffect(() => {
    fetchUserInfo()
    init()
  }, [init])

  if (loading) return <Spin fullscreen tip="加载中" size="large" />
  if (!hasPermission) return <NotPermissionPage />

  return (
    <React.Suspense fallback={<Spin className="spin-full" delay={100} />}>
      {children}
    </React.Suspense>
  )
})

export default AuthWrap
