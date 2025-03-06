import React, { useState, useEffect } from 'react';
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
  Divider
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  BookOutlined,
  QqOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟用户数据，实际应用中应该从API获取
interface UserData {
  id: string;
  email: string;
  name: string;
  avatar: string;
  gender: string;
  qq: string;
  mobile: string;
  major: string;
  studentId: string;
}

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: 'usr123456789',
    email: 'student@fzu.edu.cn',
    name: '张三',
    avatar: 'https://placehold.co/200x200/3e97ff/ffffff?text=User',
    gender: 'MALE',
    qq: '123456789',
    mobile: '13800138000',
    major: '计算机科学与技术',
    studentId: '031902123'
  });
  
  const [avatarUrl, setAvatarUrl] = useState<string>(userData.avatar);
  
  useEffect(() => {
    // 这里可以添加API调用来获取用户数据
    form.setFieldsValue({
      name: userData.name,
      email: userData.email,
      gender: userData.gender,
      qq: userData.qq,
      mobile: userData.mobile,
      major: userData.major,
      studentId: userData.studentId,
    });
  }, [userData, form]);
  
  const handleSubmit = (values: any) => {
    // 这里处理表单提交，调用API更新用户信息
    console.log('提交的数据:', values);
    
    // 模拟API调用成功
    setUserData({
      ...userData,
      ...values,
      avatar: avatarUrl
    });
    
    message.success('个人信息更新成功');
    setEditing(false);
  };
  
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    
    return isJpgOrPng && isLt2M;
  };
  
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      // 实际应用中，这里应该从上传响应中获取URL
      // 这里仅模拟
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setAvatarUrl(url);
      });
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };
  
  // 辅助函数，转换图片文件为Base64
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>更换头像</div>
    </div>
  );

  return (
    <div className="py-8 px-6 sm:px-12 md:px-24">
      <Card bordered={false} className="shadow-sm rounded-lg">
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={6} className="text-center">
            <div className="flex flex-col items-center">
              {editing ? (
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  action="/api/upload" // 实际应用中，替换为你的上传API
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  className="avatar-uploader"
                >
                  {avatarUrl ? (
                    <Avatar 
                      size={128} 
                      src={avatarUrl} 
                      alt={userData.name} 
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
                />
              )}
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{userData.name}</Title>
              <Text type="secondary">{userData.major}</Text>
            </div>
          </Col>
          
          <Col xs={24} md={18}>
            <div className="flex justify-between items-center mb-6">
              <Title level={3} style={{ margin: 0 }}>个人信息</Title>
              
              {!editing ? (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setEditing(true)}
                >
                  编辑资料
                </Button>
              ) : (
                <Space>
                  <Button onClick={() => setEditing(false)}>
                    取消
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={() => form.submit()}
                  >
                    保存
                  </Button>
                </Space>
              )}
            </div>
            
            <Divider style={{ margin: '12px 0 24px' }} />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!editing}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="name" 
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="email" 
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="请输入邮箱" disabled />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="gender" 
                    label="性别"
                  >
                    <Select placeholder="选择性别">
                      <Option value="MALE">男</Option>
                      <Option value="FEMALE">女</Option>
                      <Option value="SECRET">保密</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="mobile" 
                    label="手机号码"
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="qq" 
                    label="QQ"
                  >
                    <Input prefix={<QqOutlined />} placeholder="请输入QQ号" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="major" 
                    label="专业"
                  >
                    <Input prefix={<BookOutlined />} placeholder="请输入专业" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="studentId" 
                    label="学号"
                  >
                    <Input prefix={<IdcardOutlined />} placeholder="请输入学号" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfilePage;