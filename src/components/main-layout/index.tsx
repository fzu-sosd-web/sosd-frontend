import { ConfigProvider, Layout } from 'antd'
import React from 'react'
import HeaderBar from '../header-bar'
import { Outlet } from 'react-router-dom'

const { Header, Footer, Content } = Layout

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
        },
      }}
    >
      {/* 将 Layout 设置为 flex 容器，并使其占据整个视口高度 */}
      <Layout
        className="min-h-screen flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        {/* Header 固定在顶部 */}
        <Header className="p-0 m-0 flex bg-[#ffffff] w-full shadow-sm fixed z-10">
          <HeaderBar />
        </Header>

        {/* Content 占据剩余空间 */}
        <Content className="flex-1 pt-16">
          <Outlet /> {/* 这里渲染子路由 */}
        </Content>

        {/* Footer 保持在页面底部 */}
        <Footer className="text-center bg-white py-4">
          spaceluke ©{new Date().getFullYear()} 版权所有
          <a href="https://beian.miit.gov.cn/" rel="nofollow">
            闽ICP备2023001214号-1
          </a>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout
