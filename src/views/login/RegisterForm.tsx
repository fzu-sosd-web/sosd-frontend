import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
  message,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  QqOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'
import { register, RegisterData, sendEmailVerifyCode } from '@/apis/login' // 确保导入这个API
import { Timeout } from 'ahooks/lib/useRequest/src/types'

const { Text } = Typography
const { Option } = Select

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarBase64, setAvatarBase64] = useState<string>('')
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

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

  // 将图片转为Base64
  const getBase64 = (
    file: RcFile,
    callback: (base64String: string) => void,
  ) => {
    const reader = new FileReader()
    reader.addEventListener('load', () =>
      callback(reader.result?.toString() || ''),
    )
    reader.readAsDataURL(file)
  }

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      // 先验证邮箱字段
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

  // 处理注册提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)

      const registerData: RegisterData = {
        email: values.email,
        password: values.password,
        name: values.name,
        studentId: values.studentId,
        gender: values.gender,
        qq: values.qq,
        mobile: values.mobile,
        major: values.major,
        validCode: values.validCode,
      }

      console.log('注册信息:', registerData)
      // 这里调用注册API
      const resp = await register(registerData)
      console.log('注册结果:', resp)
      if (resp.success) {
        message.success('注册成功')
        onSwitchToLogin()
      }
    } catch (error) {
      setLoading(false)
      message.error('注册失败，请稍后再试')
    }
  }

  return (
    <div>
      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* 邮箱和验证码 */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input size="middle" placeholder="邮箱" prefix={<MailOutlined />} />
        </Form.Item>

        {/* 个人信息字段 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input
                size="middle"
                placeholder="姓名"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="studentId"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input
                size="middle"
                placeholder="学号"
                prefix={<IdcardOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 第二行 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="gender">
              <Select size="middle" placeholder="性别">
                <Option value="MALE">男</Option>
                <Option value="FEMALE">女</Option>
                <Option value="SECRET">保密</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="major">
              <Input
                size="middle"
                placeholder="专业"
                prefix={<BookOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 第三行 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="mobile">
              <Input
                size="middle"
                placeholder="手机号"
                prefix={<PhoneOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="qq">
              <Input size="middle" placeholder="QQ号" prefix={<QqOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少为6个字符' },
          ]}
        >
          <Input.Password
            size="middle"
            placeholder="密码"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不匹配'))
              },
            }),
          ]}
        >
          <Input.Password
            size="middle"
            placeholder="确认密码"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="validCode"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <div className="flex">
            <Input
              size="middle"
              placeholder="验证码"
              prefix={<SafetyCertificateOutlined />}
              style={{ flex: 1 }}
            />
            <Button
              size="middle"
              loading={sendingCode}
              disabled={countdown > 0}
              onClick={handleSendVerifyCode}
              style={{ marginLeft: '8px', minWidth: '120px' }}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="middle"
            loading={loading}
          >
            注册
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <Text type="secondary">
          已有账号?{' '}
          <a onClick={onSwitchToLogin} className="text-blue-500">
            登录
          </a>
        </Text>
      </div>
    </div>
  )
}

export default RegisterForm
