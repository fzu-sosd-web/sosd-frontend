import { ConfigProvider, Layout } from 'antd'
import React from 'react'
import HeaderBar from '../header-bar'
import { Outlet } from 'react-router-dom'

const { Header, Footer, Content } = Layout
// 创建一个布局组件，包含HeaderBar和底部
const MainLayout = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerPadding: '0',
            headerBg: '#ffffff',
            bodyBg: '#ffffff',
          },
          Button: {
            colorPrimary: '#3e97ff',
            colorPrimaryHover: '#2486f9',
          },
          Typography: {
            colorTextHeading: '#1a1a1a',
          },
        },
        token: {
          colorPrimary: '#3e97ff',
          borderRadius: 8,
        }
      }}
    >
      <Layout className="min-h-screen w-screen p-0">
        <Header className="p-0 m-0 flex bg-[#ffffff] w-screen shadow-sm fixed z-10">
          <HeaderBar />
        </Header>
        
        <Content className="pt-16">
          <Outlet /> {/* 这里渲染子路由 */}
        </Content>

        <Footer style={{ textAlign: 'center', background: '#fff' }}>
          spaceluke ©{new Date().getFullYear()} 版权所有
          <a href="https://beian.miit.gov.cn/" rel="nofollow">闽ICP备2023001214号-1</a>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout
