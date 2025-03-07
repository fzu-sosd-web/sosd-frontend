import {
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  Divider,
  List,
  Timeline,
  Spin,
  message,
  Empty
} from 'antd'
import {
  DownloadOutlined,
  TeamOutlined,
  FormOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import sadaharu from '@/assets/sadaharu.png'
import RegisterModal from './register_modal'
import TeamModal from './teaminfo_modal'

const { Title, Paragraph, Text } = Typography

// 竞赛数据接口
interface CompetitionData {
  id: string;
  title: string;
  description: string;
  participantRequirements: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: string;
  prizeInfo: string;
  mentorInfo: string;
  timelineItems: Array<{
    title: string;
    time: string;
    description: string;
    status: 'finish' | 'process' | 'wait';
  }>;
  files: Array<{
    name: string;
    key: string;
    url: string;
  }>;
}

// API基础URL
const API_BASE_URL = 'http://81.68.212.127:5083';

const CompPage = React.memo(() => {
  // 获取URL参数
  const { competitionId } = useParams<{ competitionId: string }>();
  
  // 状态管理
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState<CompetitionData | null>(null);

  // 获取竞赛详情数据
  const fetchCompetitionDetails = async () => {
    if (!competitionId) return;
    
    setLoading(true);
    try {
      // 调用API获取竞赛详情
      const response = await axios.get(`${API_BASE_URL}/api/competitions/${competitionId}`);
      
      if (response.data && response.data.code === 200) {
        setCompetition(response.data.data);
      } else {
        message.error('获取竞赛信息失败: ' + (response.data?.message || '未知错误'));
        // 使用模拟数据作为后备
        setCompetition(getMockCompetitionData());
      }
    } catch (error) {
      console.error('获取竞赛详情出错:', error);
      message.error('获取竞赛信息失败，请稍后再试');
      // 使用模拟数据作为后备
      setCompetition(getMockCompetitionData());
    } finally {
      setLoading(false);
    }
  };

  // 文件下载处理函数
  const handleFileDownload = (file: { name: string, key: string, url: string }) => {
    // 实际项目中应该处理文件下载
    message.info(`开始下载: ${file.name}`);
    
    if (file.url) {
      // 如果有URL，创建一个隐藏的a标签并触发下载
      const link = document.createElement('a');
      link.href = file.url;
      link.target = '_blank';
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 生成模拟竞赛数据
  const getMockCompetitionData = (): CompetitionData => {
    return {
      id: competitionId || 'comp-default',
      title: '2024年福州大学服务外包校赛',
      description: '福州大学服务外包与软件设计实验室举办的校内软件设计大赛，旨在提高学生的实际项目开发能力、创新思维和团队协作精神。比赛模拟真实企业项目需求，参赛者将在有限时间内完成从需求分析到系统实现的全过程。',
      participantRequirements: '面向福州大学全日制在校学生，不限年级和专业。每队3-5人，鼓励跨专业组队。',
      coverImage: sadaharu,
      startDate: '2024-04-10',
      endDate: '2024-06-15',
      status: 'ongoing',
      prizeInfo: '总奖金池超过1万元',
      mentorInfo: '行业专家一对一指导',
      timelineItems: [
        {
          title: '报名阶段',
          time: '4月10日-4月30日',
          description: '组建团队并完成报名手续',
          status: 'finish',
        },
        {
          title: '初赛阶段',
          time: '5月1日-5月20日',
          description: '完成初赛作品提交',
          status: 'process',
        },
        {
          title: '决赛阶段',
          time: '5月25日-6月10日',
          description: '入围队伍进行决赛路演',
          status: 'wait',
        },
        {
          title: '颁奖典礼',
          time: '6月15日',
          description: '公布获奖名单并举行颁奖仪式',
          status: 'wait',
        }
      ],
      files: [
        { name: '赛事规则.pdf', key: 'rules', url: '' },
        { name: '评分标准.pdf', key: 'scoring', url: '' },
        { name: '参赛指南.pdf', key: 'guide', url: '' }
      ]
    };
  };

  // 在组件挂载时和competitionId变化时获取数据
  useEffect(() => {
    fetchCompetitionDetails();
  }, [competitionId]);

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Spin size="large" tip="加载竞赛信息..." />
      </div>
    );
  }

  // 如果没有找到竞赛数据
  if (!competition) {
    return (
      <div className="py-24">
        <Empty 
          description="未找到竞赛信息" 
          image={Empty.PRESENTED_IMAGE_DEFAULT}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-6 sm:px-12 md:px-24">
      {/* 赛事标题 */}
      <div className="text-center mb-8">
        <Title level={2} style={{ fontWeight: 600 }}>
          {competition.title}
        </Title>
        <div className="flex justify-center items-center">
          <CalendarOutlined style={{ color: '#3e97ff' }} />
          <Text type="secondary" className="ml-2">
            {competition.startDate} - {competition.endDate}
          </Text>
        </div>
      </div>

      {/* 赛事主要介绍区域 - 左图右文 */}
      <Row gutter={[48, 32]} className="my-12" align="middle">
        {/* 左侧赛事图片 */}
        <Col xs={24} md={12}>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src={competition.coverImage || sadaharu} 
              alt={competition.title} 
              className="w-full h-auto"
              onError={(e) => {
                // 图片加载失败时使用默认图片
                e.currentTarget.src = sadaharu;
              }} 
            />
          </div>
        </Col>

        {/* 右侧赛事介绍 */}
        <Col xs={24} md={12}>
          <Title level={3}>关于比赛</Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {competition.description}
          </Paragraph>

          <Title level={4} className="mt-6">
            参赛对象
          </Title>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {competition.participantRequirements}
          </Paragraph>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center">
              <TrophyOutlined style={{ fontSize: '24px', color: '#3e97ff' }} />
              <div className="ml-3">
                <div className="text-base font-medium">丰厚奖金</div>
                <div className="text-sm text-gray-500">{competition.prizeInfo}</div>
              </div>
            </div>
            <div className="flex items-center">
              <TeamOutlined style={{ fontSize: '24px', color: '#3e97ff' }} />
              <div className="ml-3">
                <div className="text-base font-medium">企业导师</div>
                <div className="text-sm text-gray-500">{competition.mentorInfo}</div>
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
          <Card
            title="赛事资料"
            bordered={false}
            className="shadow-md rounded-xl"
          >
            <List
              itemLayout="horizontal"
              dataSource={competition.files}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<DownloadOutlined />}
                      key={item.key}
                      onClick={() => handleFileDownload(item)}
                    >
                      下载
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <FileTextOutlined
                        style={{ fontSize: '20px', color: '#3e97ff' }}
                      />
                    }
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
                onClick={() => setShowRegisterModal(true)}
                disabled={competition.status === 'ended'}
              >
                立即报名
              </Button>
              <Button
                type="default"
                size="large"
                icon={<TeamOutlined />}
                className="px-8 h-12 text-lg font-medium"
                onClick={() => setShowTeamModal(true)}
              >
                我的队伍
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 比赛流程时间轴 */}
      <div className="my-12">
        <Title level={3} className="text-center mb-8">
          比赛流程
        </Title>
        <div className="bg-gray-50 p-8 rounded-xl">
          {/* 横向时间轴 */}
          <div className="horizontal-timeline">
            <Timeline
              mode="alternate"
              items={competition.timelineItems.map((item, index) => ({
                color: item.status === 'wait' ? 'gray' : '#3e97ff',
                children: (
                  <div
                    className={`timeline-item ${item.status === 'process' ? 'timeline-active' : ''}`}
                  >
                    <div
                      className="text-xl font-semibold"
                      style={{ color: item.status === 'wait' ? 'gray' : '#3e97ff' }}
                    >
                      {item.title}
                    </div>
                    <div className="text-base text-gray-600">{item.time}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      {item.description}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>

      {/* 报名弹窗 */}
      <RegisterModal 
        visible={showRegisterModal} 
        onCancel={() => setShowRegisterModal(false)} 
        competitionId={competition.id}
      />
      
      {/* 队伍弹窗 */}
      <TeamModal 
        visible={showTeamModal} 
        onCancel={() => setShowTeamModal(false)} 
      />
    </div>
  )
})

export default CompPage