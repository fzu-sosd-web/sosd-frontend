import { Typography, Button, Space, Card, Row, Col, Divider, List, Timeline } from 'antd'
import { DownloadOutlined, TeamOutlined, FormOutlined, CalendarOutlined, TrophyOutlined, FileTextOutlined } from '@ant-design/icons'
import React from 'react'

import sadaharu from '@/assets/sadaharu.png'

const { Title, Paragraph, Text } = Typography;

const CompPage = React.memo(() => {
  // 赛事文件列表数据
  const competitionFiles = [
    { name: '赛事规则.pdf', key: 'rules' },
    { name: '评分标准.pdf', key: 'scoring' },
    { name: '参赛指南.pdf', key: 'guide' }
  ];

  // 时间轴数据 - 可以从API动态获取
  const timelineItems = [
    {
      title: '报名阶段',
      time: '4月10日-4月30日',
      description: '组建团队并完成报名手续',
      status: 'finish', // 已完成
      color: '#3e97ff',
    },
    {
      title: '初赛阶段',
      time: '5月1日-5月20日',
      description: '完成初赛作品提交',
      status: 'process', // 进行中
      color: '#3e97ff',
    },
    {
      title: '决赛阶段',
      time: '5月25日-6月10日',
      description: '入围队伍进行决赛路演',
      status: 'wait', // 等待中
      color: 'gray',
    },
    {
      title: '颁奖典礼',
      time: '6月15日',
      description: '公布获奖名单并举行颁奖仪式',
      status: 'wait', // 等待中
      color: 'gray',
    }
  ];

  return (
    <div className="py-8 px-6 sm:px-12 md:px-24">
      {/* 赛事标题 */}
      <div className="text-center mb-8">
        <Title level={2} style={{ fontWeight: 600 }}>2024年福州大学服务外包校赛</Title>
        <div className="flex justify-center items-center">
          <CalendarOutlined style={{ color: '#3e97ff' }} />
          <Text type="secondary" className="ml-2">2024年4月10日 - 6月15日</Text>
        </div>
      </div>
      
      {/* 赛事主要介绍区域 - 左图右文 */}
      <Row gutter={[48, 32]} className="my-12" align="middle">
        {/* 左侧赛事图片 */}
        <Col xs={24} md={12}>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src={sadaharu} 
              alt="服务外包校赛" 
              className="w-full h-auto"
            />
          </div>
        </Col>
        
        {/* 右侧赛事介绍 */}
        <Col xs={24} md={12}>
          <Title level={3}>关于比赛</Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            福州大学服务外包与软件设计实验室举办的校内软件设计大赛，旨在提高学生的实际项目开发能力、创新思维和团队协作精神。比赛模拟真实企业项目需求，参赛者将在有限时间内完成从需求分析到系统实现的全过程。
          </Paragraph>
          
          <Title level={4} className="mt-6">参赛对象</Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            面向福州大学全日制在校学生，不限年级和专业。每队3-5人，鼓励跨专业组队。
          </Paragraph>
          
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center">
              <TrophyOutlined style={{ fontSize: '24px', color: '#3e97ff' }} />
              <div className="ml-3">
                <div className="text-base font-medium">丰厚奖金</div>
                <div className="text-sm text-gray-500">总奖金池超过1万元</div>
              </div>
            </div>
            <div className="flex items-center">
              <TeamOutlined style={{ fontSize: '24px', color: '#3e97ff' }} />
              <div className="ml-3">
                <div className="text-base font-medium">企业导师</div>
                <div className="text-sm text-gray-500">行业专家一对一指导</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      {/* 赛事文件和操作按钮区域 */}
      <Row gutter={[32, 32]} className="my-8">
        {/* 左侧赛事文件列表 */}
        <Col xs={24} md={12}>
          <Card title="赛事资料" bordered={false} className="shadow-md rounded-xl">
            <List
              itemLayout="horizontal"
              dataSource={competitionFiles}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />}
                      key={item.key}
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: '20px', color: '#3e97ff' }} />}
                    title={item.name}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* 右侧操作按钮 */}
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-md rounded-xl">
            <Title level={4}>即刻参与</Title>
            <Paragraph className="mb-6">
              比赛报名已开放，截止日期为2024年4月30日。组队完成后请点击下方"立即报名"按钮。
            </Paragraph>
            <Space size="large" className="mt-4">
              <Button 
                type="primary" 
                size="large" 
                icon={<FormOutlined />}
                className="px-8 h-12 text-lg font-medium"
              >
                立即报名
              </Button>
              <Button 
                type="default" 
                size="large" 
                icon={<TeamOutlined />}
                className="px-8 h-12 text-lg font-medium"
              >
                我的队伍
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      
      {/* 比赛流程时间轴 */}
      <div className="my-12">
        <Title level={3} className="text-center mb-8">比赛流程</Title>
        <div className="bg-gray-50 p-8 rounded-xl">
          {/* 横向时间轴 */}
          <div className="horizontal-timeline">
            <Timeline
              mode="alternate"
              items={timelineItems.map((item, index) => ({
                color: item.color,
                children: (
                  <div className={`timeline-item ${item.status === 'process' ? 'timeline-active' : ''}`}>
                    <div className="text-xl font-semibold" style={{ color: item.color }}>{item.title}</div>
                    <div className="text-base text-gray-600">{item.time}</div>
                    <div className="text-sm text-gray-500 mt-2">{item.description}</div>
                  </div>
                ),
              }))}
            />
          </div>
          
          {/* 添加一些CSS样式让Timeline水平显示 */}

        </div>
      </div>
    </div>
  )
})

export default CompPage