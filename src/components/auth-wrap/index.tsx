import * as React from 'react'
import { message, Spin } from 'antd'
import useRefCallback from '@/hooks/useRefCallback'
import { usePermission } from '@/hooks/usePermission'
import NotPermissionPage from '../other/not-permission-page'
import { fetchInfo } from '@/apis/login'
import { useLoginStore } from '@/store/login'

type AuthWrapProps = {
  children?: React.ReactNode
}

export const AuthWrap: React.FC<AuthWrapProps> = React.memo(({ children }) => {
  const { isLogin } = usePermission()
  const [hasPermission, setHasPermission] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [name, setName] = React.useState('')
  const { userInfo } = useLoginStore()

  const fetchUserInfo = async () => {
    const res = await fetchInfo()
    if (res.code === 200 && res.data) {
      setName(res.data.name)
    } else {
      message.error(res.msg)
    }
  }

  React.useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchUserInfo() // 确保用户信息已加载
      const flag = name === '游文馨' || userInfo?.name === '游文馨'
      setHasPermission(flag)
      setLoading(false)
    }
    init()
  }, [name, userInfo])

  if (loading) return <Spin fullscreen tip="加载中" size="large" />
  if (!hasPermission) return <NotPermissionPage />

  return (
    <React.Suspense fallback={<Spin className="spin-full" delay={100} />}>
      {children}
    </React.Suspense>
  )
})

export default AuthWrap
