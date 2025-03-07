import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  Select,
  Upload,
  message,
  Divider,
  Space,
  Row,
  Col,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  QqOutlined,
  BookOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { RoutePath } from '@/constant/routes'
import type { UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'

import sosd from '@/assets/logo.png'

import './index.css'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface LoginData {
  email: string
  studentId: string
  password: string
}

interface RegisterData {
  email: string
  name: string
  password: string
  gender: string
  qq: string
  mobile: string
  major: string
  studentId: string
  avatarBase64: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [avatarBase64, setAvatarBase64] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // 处理登录提交
  const handleLoginSubmit = async (values: any) => {
    try {
      setLoading(true)
      console.log('登录信息:', values)
      // 这里调用登录API

      // 模拟登录成功
      setTimeout(() => {
        message.success('登录成功')
        localStorage.setItem('token', 'mock-token')
        navigate(RoutePath.Home)
        setLoading(false)
      }, 800)
    } catch (error) {
      setLoading(false)
      message.error('登录失败，请检查用户名和密码')
    }
  }

  // 处理注册提交
  const handleRegisterSubmit = async (values: any) => {
    try {
      setLoading(true)

      const registerData: RegisterData = {
        ...values,
        avatarBase64: avatarBase64,
      }

      console.log('注册信息:', registerData)
      // 这里调用注册API

      // 模拟注册成功
      setTimeout(() => {
        message.success('注册成功，请登录')
        setActiveTab('login')
        setLoading(false)
      }, 800)
    } catch (error) {
      setLoading(false)
      message.error('注册失败，请稍后再试')
    }
  }

  // 图片上传前检查
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!')
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!')
    }

    return isJpgOrPng && isLt2M
  }

  // 处理头像上传
  const handleAvatarChange: UploadProps['onChange'] = (info) => {
    if (info.file.originFileObj) {
      getBase64(info.file.originFileObj as RcFile, (base64String) => {
        setAvatarBase64(base64String)
      })
    }
  }

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

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-content">
          <Card className="login-card" bordered={false}>
            <div className="text-center mb-6">
              <img src={sosd} alt="Logo" className="mb-4 mx-auto" />
              <Title level={3} className="mb-1">
                福州大学服务外包与软件设计实验室
              </Title>
              <Text type="secondary">
                Service Outsourcing & Software Design Laboratory
              </Text>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              className="auth-tabs"
            >
              <TabPane tab="登录" key="login">
                <Form
                  form={loginForm}
                  name="login"
                  layout="vertical"
                  onFinish={handleLoginSubmit}
                  className="mt-4"
                  initialValues={{}} // 明确设置为空对象
                >
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱或学号' }]}
                  >
                    <Input
                      size="large"
                      placeholder="邮箱或学号"
                      prefix={<UserOutlined />}
                      autoComplete="off"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="密码"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item>
                    <div className="flex justify-between items-center mb-4">
                      <Link to="/forgot-password" className="text-blue-500">
                        忘记密码?
                      </Link>
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

                <Button
                  block
                  onClick={() => setActiveTab('register')}
                  className="register-button"
                >
                  创建新账号
                </Button>
              </TabPane>

              <TabPane tab="注册" key="register">
                <Form
                  form={registerForm}
                  name="register"
                  layout="vertical"
                  onFinish={handleRegisterSubmit}
                  className="mt-4"
                  requiredMark={false} // 移除必填标记，使表单更简洁
                >
                  {/* 更紧凑的字段排列 - 第一行 */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input
                          size="middle" // 中等大小而不是large
                          placeholder="邮箱"
                          prefix={<MailOutlined />}
                        />
                      </Form.Item>
                    </Col>
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
                  </Row>

                  {/* 第二行 */}
                  <Row gutter={16}>
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
                    <Col span={12}>
                      <Form.Item name="gender">
                        <Select size="middle" placeholder="性别">
                          <Option value="MALE">男</Option>
                          <Option value="FEMALE">女</Option>
                          <Option value="SECRET">保密</Option>
                        </Select>
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
                        <Input
                          size="middle"
                          placeholder="QQ号"
                          prefix={<QqOutlined />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="major"
                    rules={[{ required: true, message: '请输入专业' }]}
                  >
                    <Input
                      size="middle"
                      placeholder="专业"
                      prefix={<BookOutlined />}
                    />
                  </Form.Item>

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
                          return Promise.reject(
                            new Error('两次输入的密码不匹配'),
                          )
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

                  {/* 减小头像上传的视觉权重 */}
                  <Form.Item name="avatar">
                    <Upload
                      name="avatar"
                      listType="picture"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleAvatarChange}
                    >
                      <div className="upload-button">
                        {avatarBase64 ? (
                          <img
                            src={avatarBase64}
                            alt="avatar"
                            className="uploaded-avatar"
                            style={{ width: '60px', height: '60px' }} // 减小头像尺寸
                          />
                        ) : (
                          <Button size="small" icon={<UploadOutlined />}>
                            上传头像
                          </Button>
                        )}
                      </div>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="middle" // 中等大小按钮
                      loading={loading}
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>

                <div className="text-center">
                  <Text type="secondary">
                    已有账号?{' '}
                    <a
                      onClick={() => setActiveTab('login')}
                      className="text-blue-500"
                    >
                      登录
                    </a>
                  </Text>
                </div>
              </TabPane>
            </Tabs>

            <Paragraph className="text-center text-gray-400 text-xs mt-8">
              © {new Date().getFullYear()} 福州大学SOSD实验室. 保留所有权利.
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
