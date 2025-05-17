import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Segmented,
  message,
  Tooltip,
  Typography,
  Divider,
} from 'antd'
import {
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { data, useNavigate } from 'react-router-dom'
import { RoutePath } from '@/constant/routes'
import { sendEmailVerifyCode } from '@/apis/login'
import { useLoginStore } from '@/store/login'
import { setIsLogin, setToken } from '@/utils/token'
import { Timeout } from 'ahooks/lib/useRequest/src/types'

const { Text } = Typography

interface LoginFormProps {
  onSwitchToRegister: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loginMethod, setLoginMethod] = useState<'password' | 'code'>(
    'password',
  )
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 从store获取状态和方法
  const { loading, login } = useLoginStore()

  // 处理倒计时
  useEffect(() => {
    let timer: Timeout | null = null

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // 处理登录提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      let loginData: any = {}

      if (loginMethod === 'password') {
        // 学号+密码登录
        loginData = {
          id: values.id,
          studentId: values.studentId,
          email: values.email,
          password: values.password,
        }
      } else {
        // 邮箱+验证码登录
        loginData = {
          email: values.email,
          validCode: values.verifyCode,
        }
      }

      // 调用登录
      const success = await login(loginData)

      if (success) {
        message.success('登录成功')
        navigate(RoutePath.Home)
      } else {
        message.error('登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请检查输入后重试')
    }
  }

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      await form.validateFields(['email'])
      const email = form.getFieldValue('email')

      setSendingCode(true)
      // 调用发送验证码API
      const res = await sendEmailVerifyCode(email)

      if (res.success) {
        message.success('验证码已发送至邮箱，请注意查收')
        setCountdown(60) // 60秒倒计时
      } else {
        message.error(res.message || '验证码发送失败')
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      message.error('请输入有效的邮箱地址')
    } finally {
      setSendingCode(false)
    }
  }

  // 切换登录方式时重置表单
  const handleLoginMethodChange = (value: 'password' | 'code') => {
    setLoginMethod(value)
    form.resetFields()
  }

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <Segmented
          options={[
            { label: '学号密码登录', value: 'password' },
            { label: '邮箱验证码登录', value: 'code' },
          ]}
          value={loginMethod}
          onChange={(value) =>
            handleLoginMethodChange(value as 'password' | 'code')
          }
        />
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        initialValues={{}}
      >
        {loginMethod === 'password' ? (
          // 学号密码登录
          <>
            <Form.Item
              name="id"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input
                size="large"
                placeholder="id"
                prefix={<IdcardOutlined />}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入邮箱' }]}
            >
              <Input
                size="large"
                placeholder="email"
                prefix={<IdcardOutlined />}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="studentId"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input
                size="large"
                placeholder="studentId"
                prefix={<IdcardOutlined />}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                size="large"
                placeholder="password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
          </>
        ) : (
          // 邮箱验证码登录
          <>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                size="large"
                placeholder="邮箱"
                prefix={<MailOutlined />}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="verifyCode"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <div className="flex">
                <Input
                  size="large"
                  placeholder="验证码"
                  prefix={<SafetyCertificateOutlined />}
                  style={{ flex: 1 }}
                />
                <Button
                  size="large"
                  loading={sendingCode}
                  disabled={countdown > 0}
                  onClick={handleSendVerifyCode}
                  style={{ marginLeft: '8px', minWidth: '120px' }}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                </Button>
              </div>
            </Form.Item>
          </>
        )}

        <Form.Item>
          <div className="flex justify-between items-center mb-4">
            <Tooltip title="切换登录方式">
              <Button
                type="link"
                onClick={() =>
                  handleLoginMethodChange(
                    loginMethod === 'password' ? 'code' : 'password',
                  )
                }
                icon={<SwapOutlined />}
              >
                {loginMethod === 'password' ? '使用验证码登录' : '使用密码登录'}
              </Button>
            </Tooltip>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>
        <Text type="secondary">还没有账号?</Text>
      </Divider>

      <Button block onClick={onSwitchToRegister} className="register-button">
        创建新账号
      </Button>
    </div>
  )
}

export default LoginForm
