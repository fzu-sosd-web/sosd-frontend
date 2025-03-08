import React, { useState } from 'react'
import {
  Card,
  Typography,
  Tabs,
} from 'antd'
import sosd from '@/assets/logo.png'
import './index.css'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Paragraph from 'antd/es/typography/Paragraph'

const { Title, Text } = Typography
const { TabPane } = Tabs

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login')

  // 切换到注册页
  const switchToRegister = () => {
    setActiveTab('register')
  }

  // 切换到登录页
  const switchToLogin = () => {
    setActiveTab('login')
  }

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-content">
          <Card className="login-card" bordered={false}>
            <div className="text-center mb-6">
              <img src={sosd} alt="Logo" className="mb-4 mx-auto" style={{ height: "64px" }} />
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
                <LoginForm onSwitchToRegister={switchToRegister} />
              </TabPane>

              <TabPane tab="注册" key="register">
                <RegisterForm onSwitchToLogin={switchToLogin} />
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