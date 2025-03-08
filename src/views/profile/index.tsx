import React, { useState, useEffect } from 'react'
import {
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Select,
  Card,
  message,
  Space,
  Divider,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  BookOutlined,
  QqOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'

import './index.css' // 创建新的CSS文件
import { useLoginStore } from '@/store/login'
import { updateUser, UpdateUserForm } from './api'

const { Title, Text } = Typography
const { Option } = Select

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 从全局状态获取用户信息
  const userInfo = useLoginStore((state) => state.userInfo)
  const refreshUserInfo = useLoginStore((state) => state.refreshUserInfo)

  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    // 页面加载时重置表单
    form.resetFields()

    if (userInfo) {
      // 设置表单初始值
      form.setFieldsValue({
        name: userInfo.name,
        email: userInfo.email,
        gender: userInfo.gender,
        qq: userInfo.qq,
        mobile: userInfo.mobile,
        major: userInfo.major,
        studentId: userInfo.studentId, // 根据实际情况调整
      })

      // 设置头像
      if (userInfo.avatarBase64) {
        setAvatarUrl(userInfo.avatarBase64)
      }
    }
  }, [userInfo, form])

  const handleSubmit = async (values: UpdateUserForm) => {
    if (!userInfo) return

    setSubmitting(true)

    try {
      // 将头像URL添加到提交数据中
      const updatedData: UpdateUserForm = {
        name: values.name,
        gender: values.gender,
        qq: values.qq,
        mobile: values.mobile,
        major: values.major,
        avatarBase64: avatarUrl || userInfo.avatarBase64,
      }

      // 调用API更新用户信息
      const response = await updateUser(updatedData)

      if (response.success) {
        message.success('个人信息更新成功')
        setEditing(false)
      } else {
        message.error('个人信息更新失败，请重试')
      }
    } catch (error) {
      console.error('更新个人信息失败:', error)
      message.error('更新个人信息失败，请重试')
    } finally {
      setSubmitting(false)
      refreshUserInfo()
    }
  }

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

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.originFileObj) {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setAvatarUrl(url)
      })
    }
  }

  // 辅助函数，转换图片文件为Base64
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  // 如果没有用户信息，显示加载状态或提示
  if (!userInfo) {
    return (
      <div className="profile-container">
        <Card bordered={false} className="profile-card">
          <div className="flex justify-center items-center py-12">
            <Text type="secondary">用户信息加载中或请先登录...</Text>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <Card bordered={false} className="profile-card">
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={6} className="profile-avatar-col">
            <div className="profile-avatar-container">
              {editing ? (
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  className="avatar-uploader"
                >
                  {avatarUrl ? (
                    <Avatar
                      size={128}
                      src={avatarUrl}
                      alt={userInfo.name}
                      className="profile-avatar"
                    />
                  ) : (
                    <Avatar
                      size={128}
                      icon={<UserOutlined />}
                      alt={userInfo.name}
                      className="profile-avatar"
                    />
                  )}
                </Upload>
              ) : (
                <Avatar
                  size={128}
                  src={avatarUrl || userInfo.avatar}
                  icon={
                    !avatarUrl && !userInfo.avatar ? <UserOutlined /> : null
                  }
                  alt={userInfo.name}
                  className="profile-avatar"
                />
              )}
              <Title level={4} className="profile-name">
                {userInfo.name}
              </Title>
              <Text type="secondary" className="profile-major">
                {userInfo.major}
              </Text>
            </div>
          </Col>

          <Col xs={24} md={18}>
            <div className="profile-header">
              <Title level={3} className="profile-title">
                个人信息
              </Title>

              {!editing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  className="edit-button"
                >
                  编辑资料
                </Button>
              ) : (
                <Space>
                  <Button
                    onClick={() => {
                      setEditing(false)
                      // 重置表单和头像为用户当前信息
                      form.setFieldsValue({
                        name: userInfo.name,
                        email: userInfo.email,
                        gender: userInfo.gender,
                        qq: userInfo.qq,
                        mobile: userInfo.mobile,
                        major: userInfo.major,
                        studentId: userInfo.studentId || userInfo.id,
                      })
                      setAvatarUrl(userInfo.avatar || '')
                    }}
                    className="cancel-button"
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                    loading={submitting}
                    className="save-button"
                  >
                    保存
                  </Button>
                </Space>
              )}
            </div>

            <Divider className="profile-divider" />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!editing || submitting}
              className="profile-form"
              autoComplete="off"
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input
                      prefix={<UserOutlined className="form-icon" />}
                      placeholder="请输入姓名"
                      className="profile-input"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="请输入邮箱"
                      disabled
                      className="profile-input profile-input-disabled"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="gender" label="性别">
                    <Select placeholder="选择性别" className="profile-select">
                      <Option value="MALE">男</Option>
                      <Option value="FEMALE">女</Option>
                      <Option value="SECRET">保密</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="mobile" label="手机号码">
                    <Input
                      prefix={<PhoneOutlined className="form-icon" />}
                      placeholder="请输入手机号"
                      className="profile-input"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="qq" label="QQ">
                    <Input
                      prefix={<QqOutlined className="form-icon" />}
                      placeholder="请输入QQ号"
                      className="profile-input"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="major" label="专业">
                    <Input
                      prefix={<BookOutlined className="form-icon" />}
                      placeholder="请输入专业"
                      className="profile-input"
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="studentId" label="学号">
                    <Input
                      prefix={<IdcardOutlined className="form-icon" />}
                      placeholder="请输入学号"
                      className="profile-input"
                      disabled
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ProfilePage
