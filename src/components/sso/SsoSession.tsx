import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result, Typography } from 'antd'
import { useLoginStore } from '@/store/login'
import { RoutePath } from '@/constant/routes'
import { loginBySso } from '@/apis/login'

const { Text } = Typography

/**
 * 处理SSO回调的组件
 * 接收SSO重定向回来的ticket，通过后端验证ticket获取用户信息
 */
const SSOSession: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const login = useLoginStore((state) => state.login)

  // 从store获取状态和方法
  const { setUserInfo } = useLoginStore()

  useEffect(() => {
    const ticket = searchParams.get('ticket')
    console.log('ticket:', ticket)

    const handleSSOLogin = async () => {
      if (!ticket) {
        setError('未获取到有效的登录凭证')
        setLoading(false)
        return
      }

      try {
        // 调用后端接口验证ticket
        login(ticket)
      } catch (error) {
        console.error('SSO登录处理失败:', error)
        setError('登录处理失败，请稍后重试')
        setLoading(false)
      }
    }

    handleSSOLogin()
    navigate(RoutePath.Home)
  }, [searchParams, setUserInfo, navigate])

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spin size="large" tip="正在处理登录信息..." />
        <Text type="secondary" className="mt-4">
          请稍候，正在验证您的身份...
        </Text>
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="error"
        title="登录失败"
        subTitle={error}
        extra={[
          <button
            key="login"
            className="ant-btn ant-btn-primary"
            onClick={() => navigate(RoutePath.Home)}
          >
            返回主页
          </button>,
        ]}
      />
    )
  }

  return null // 登录成功后会重定向，不会渲染此处
}

export default SSOSession
