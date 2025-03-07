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
} from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import sosd from '@/assets/logo.png'

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

const dropDownItems: MenuProps['items'] = [
  {
    label: '个人中心',
    key: RoutePath.Profile,
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: RoutePath.Login,
  },
]

const HeaderBar = React.memo(() => {
  const [current, setCurrent] = useState(RoutePath.Home)
  const navigate = useNavigate()

  const handleClick = (e: { key: string }) => {
    setCurrent(e.key)
    navigate(e.key)
  }

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
          <div className="flex items-center mr-8">
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
            onClick={handleClick}
            style={{ backgroundColor: 'transparent', fontWeight: 500 }}
          />
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center">
          <Space size={16}>
            <Dropdown
              menu={{ items: dropDownItems, onClick: handleClick }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer ml-4">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#3e97ff' }}
                />
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
})

export default HeaderBar
