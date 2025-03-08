import { RoutePath } from '@/constant/routes'
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Space,
  Menu,
  MenuProps,
  Typography,
  message,
} from 'antd'
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import sosd from '@/assets/logo.png'
import { useLoginStore } from '@/store/login'

const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

const navItems: MenuItem[] = [
  {
    label: '主页',
    key: RoutePath.Home,
  },
  {
    label: '服创校赛',
    key: RoutePath.CompetitionList,
  },
  {
    label: '纳新活动',
    key: RoutePath.JoinUs,
  },
  {
    label: '关于我们',
    key: RoutePath.AboutUs,
  },
]

const HeaderBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 从 store 中获取用户信息和方法
  const userInfo = useLoginStore((state) => state.userInfo)
  const isLogin = useLoginStore((state) => state.isLogin)
  const logout = useLoginStore((state) => state.logout)
  const refreshUserInfo = useLoginStore((state) => state.refreshUserInfo)

  // 根据当前路径设置活动菜单项
  const [current, setCurrent] = useState(RoutePath.Home)

  // 当路由变化时更新当前选中的菜单项
  useEffect(() => {
    // 找到匹配的导航项
    const currentPath = location.pathname
    refreshUserInfo()
    console.log('userInfo:', userInfo)
    console.log('isLogin:', isLogin)
    const matchedItem = navItems.find(
      (item) =>
        item &&
        'key' in item &&
        typeof item.key === 'string' &&
        (currentPath === item.key || currentPath.startsWith(`${item.key}/`)),
    )

    if (
      matchedItem &&
      'key' in matchedItem &&
      typeof matchedItem.key === 'string'
    ) {
      setCurrent(matchedItem.key)
    }
  }, [location.pathname])

  // 菜单点击处理函数
  const handleNavClick = (e: { key: string }) => {
    setCurrent(e.key)
    navigate(e.key)
  }

  // 处理登出操作
  const handleLogout = () => {
    logout() // 使用 store 中提供的 logout 方法
    message.success('已成功退出登录')

    // 如果当前在需要登录的页面，则重定向到首页
    const protectedRoutes = [RoutePath.Profile]
    if (protectedRoutes.includes(location.pathname as any)) {
      navigate(RoutePath.Home)
    }
  }

  // 用户下拉菜单
  const dropDownItems: MenuProps['items'] = [
    {
      label: '个人中心',
      key: 'profile',
      icon: <UserSwitchOutlined />,
      disabled: !isLogin,
      onClick: () => navigate(RoutePath.Profile),
    },
    {
      type: 'divider',
    },
    isLogin
      ? {
          label: '退出登录',
          key: 'logout',
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        }
      : {
          label: '登录',
          key: 'login',
          icon: <LoginOutlined />,
          onClick: () => navigate(RoutePath.Login),
        },
  ]

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemHoverColor: '#3e97ff',
            horizontalItemSelectedColor: '#3e97ff',
            itemActiveBg: 'transparent',
            activeBarHeight: 2,
            activeBarBorderWidth: 2,
            itemHoverColor: '#3e97ff',
            itemSelectedColor: '#3e97ff',
            horizontalItemHoverBg: 'transparent',
          },
        },
      }}
    >
      <div className="flex items-center justify-between w-full px-6 lg:px-12 py-2">
        {/* Logo 区域 */}
        <div className="flex items-center">
          <div
            className="flex items-center mr-8 cursor-pointer"
            onClick={() => navigate(RoutePath.Home)}
          >
            <img src={sosd} alt="Logo" className="h-10 w-10" />
            <Text strong style={{ fontSize: '1.2rem', marginLeft: '0.7rem' }}>
              福州大学服务外包与软件设计实验室
            </Text>
          </div>

          {/* 导航菜单 */}
          <Menu
            items={navItems}
            mode="horizontal"
            className="border-b-0"
            selectedKeys={[current]}
            onClick={handleNavClick}
            style={{ backgroundColor: 'transparent', fontWeight: 500 }}
          />
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center">
          {/* 用户问候 */}
          <div className="mr-4">
            {isLogin && userInfo ? (
              <Text
                strong
                style={{ backgroundColor: 'transparent', fontWeight: 500 }}
              >
                你好，{userInfo.name}
              </Text>
            ) : (
              <Text
                type="secondary"
                style={{ backgroundColor: 'transparent', fontWeight: 500 }}
              >
                你好，游客
              </Text>
            )}
          </div>

          <Space size={16}>
            <Dropdown
              menu={{ items: dropDownItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer ml-4">
                {isLogin && userInfo?.avatar ? (
                  <Avatar size={36} src={userInfo.avatar} alt={userInfo.name} />
                ) : (
                  <Avatar
                    size={36}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: isLogin ? '#3e97ff' : '#ccc' }}
                  />
                )}
                <DownOutlined
                  style={{ fontSize: '12px', marginLeft: '8px', color: '#666' }}
                />
              </div>
            </Dropdown>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default React.memo(HeaderBar)
