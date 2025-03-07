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

const { Title, Text } = Typography
const { Option } = Select

// 模拟用户数据，实际应用中应该从API获取
interface UserData {
  id: string
  email: string
  name: string
  avatar: string
  gender: string
  qq: string
  mobile: string
  major: string
  studentId: string
}

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm()
  const [editing, setEditing] = useState(false)
  const userInfo = useLoginStore((state) => state.userInfo)
  const [userData, setUserData] = useState<UserData>({
    id: 'usr123456789',
    email: 'student@fzu.edu.cn',
    name: '张三',
    avatar: 'https://placehold.co/200x200/3e97ff/ffffff?text=User',
    gender: 'MALE',
    qq: '123456789',
    mobile: '13800138000',
    major: '计算机科学与技术',
    studentId: '031902123',
  })

  const [avatarUrl, setAvatarUrl] = useState<string>(userData.avatar)

  useEffect(() => {
    // 重置表单以消除潜在的自动填充影响
    form.resetFields()

    console.log(userInfo)
    if (userInfo) {
      form.setFieldsValue({
        name: userInfo.name,
        email: userInfo.email,
        gender: userInfo.gender,
        qq: userInfo.qq,
        mobile: userInfo.mobile,
        major: userInfo.major,
        studentId: userInfo.studentId,
      })
    } else {
      // 这里可以添加API调用来获取用户数据
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        gender: userData.gender,
        qq: userData.qq,
        mobile: userData.mobile,
        major: userData.major,
        studentId: userData.studentId,
      })
    }
  }, [userData, form])

  const handleSubmit = (values: any) => {
    // 这里处理表单提交，调用API更新用户信息
    console.log('提交的数据:', values)

    // 模拟API调用成功
    setUserData({
      ...userData,
      ...values,
      avatar: avatarUrl,
    })

    message.success('个人信息更新成功')
    setEditing(false)
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

  const uploadButton = (
    <div className="upload-placeholder">
      <div className="upload-icon">
        <UploadOutlined />
      </div>
      <div>更换头像</div>
    </div>
  )

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
                      alt={userData.name}
                      className="profile-avatar"
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              ) : (
                <Avatar
                  size={128}
                  src={avatarUrl}
                  alt={userData.name}
                  className="profile-avatar"
                />
              )}
              <Title level={4} className="profile-name">
                {userData.name}
              </Title>
              <Text type="secondary" className="profile-major">
                {userData.major}
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
                    onClick={() => setEditing(false)}
                    className="cancel-button"
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
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
              disabled={!editing}
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
