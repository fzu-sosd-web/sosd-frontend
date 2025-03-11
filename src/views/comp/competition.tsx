import {
  Typography,
  Button,
  Space,
  Row,
  Col,
  Divider,
  List,
  Timeline,
  Spin,
  message,
  Empty,
} from 'antd'
import {
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
import { API_BASE_URL } from '@/constant/web'
import { Competition, CompetitionFile } from './type'

import schoolcomp2025 from '@/assets/2025schoolcomp.png'
import { useLoginStore } from '@/store/login'
import { fetchCompetitionById, fetchCompetitionTeamInfo } from './api'

const { Title, Paragraph, Text } = Typography

const CompPage = React.memo(() => {
  // 获取URL参数
  const { competitionId } = useParams<{ competitionId: string }>()

  // 状态管理
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [flag, setFlag] = useState<boolean>(false)

  const isLogin = useLoginStore((state) => state.isLogin)
  const fetchTeamInfo = async () => {
    const res = await fetchCompetitionTeamInfo(Number(competitionId))
    if (res.code == 200) {
      setFlag(true)
    }
  }

  // 获取竞赛详情数据
  const fetchCompetitionDetails = async () => {
    if (!competitionId) return

    setLoading(true)
    try {
      // 调用API获取竞赛详情
      const response = await fetchCompetitionById(Number(competitionId))

      if (response && response.code === 200) {
        setCompetition(response.data || null)
      } else {
        message.error('获取竞赛信息失败: ' + (response?.message || '未知错误'))
      }
    } catch (error) {
      console.error('获取竞赛详情出错:', error)
      message.error('获取竞赛信息失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  // 文件查看处理函数 - 在新标签页打开PDF
  const handleFileView = (file: CompetitionFile) => {
    // 通知用户正在打开文件
    message.info(`正在打开: ${file.name}`)

    if (file.url) {
      try {
        // 构建完整URL (public文件夹中的文件可以直接通过相对路径访问)
        const fileUrl = file.url.startsWith('http')
          ? file.url
          : window.location.origin + file.url

        // 在新标签页打开PDF
        window.open(fileUrl, '_blank', 'noopener,noreferrer')
      } catch (error) {
        console.error('打开文件时出错:', error)
        message.error('打开文件失败，请稍后再试')
      }
    } else {
      message.error('文件链接不可用')
    }
  }

  // 获取竞赛状态
  const getCompetitionStatus = (
    comp: Competition,
  ): 'upcoming' | 'ongoing' | 'ended' => {
    // 如果有竞赛阶段数据，尝试从中确定状态
    if (comp.data?.competitionStages?.length > 0) {
      // 查找进行中的阶段
      const ongoingStage = comp.data.competitionStages.find(
        (stage) => stage.status === 'process' || stage.status === 'ongoing',
      )
      if (ongoingStage) return 'ongoing'

      // 检查时间判断是否已结束
      const now = new Date()
      const endDate = new Date(comp.endDate)
      if (endDate < now) return 'ended'

      // 否则为即将开始
      return 'upcoming'
    } else {
      // 根据开始和结束日期判断
      const now = new Date()
      const startDate = new Date(comp.startDate)
      const endDate = new Date(comp.endDate)

      if (now < startDate) return 'upcoming'
      if (now > endDate) return 'ended'
      return 'ongoing'
    }
  }

  // 从竞赛阶段数据生成时间轴项
  const generateTimelineItems = (comp: Competition) => {
    // 获取当前时间
    const now = new Date()
    return comp.data.competitionStages.map((stage) => {
      // 将字符串日期转换为Date对象
      const startDate = new Date(stage.startAt)
      const endDate = new Date(stage.endAt)

      // 根据时间动态计算阶段状态，而不是依赖后端返回的status
      let timelineStatus: 'finish' | 'process' | 'wait'
      if (now > endDate) {
        // 如果当前时间已经超过了结束时间，则为已完成
        timelineStatus = 'finish'
      } else if (now >= startDate && now <= endDate) {
        // 如果当前时间在开始和结束之间，则为进行中
        timelineStatus = 'process'
      } else {
        // 如果当前时间在开始时间之前，则为等待中
        timelineStatus = 'wait'
      }

      return {
        title: stage.status,
        time: formatTimeRange(new Date(stage.startAt), new Date(stage.endAt)),
        description: stage.description,
        status: timelineStatus,
      }
    })
  }

  // 格式化时间范围
  const formatTimeRange = (start: Date | string, end: Date | string) => {
    const startDate = typeof start === 'string' ? new Date(start) : start
    const endDate = typeof end === 'string' ? new Date(end) : end

    return `${startDate.getMonth() + 1}月${startDate.getDate()}日-${endDate.getMonth() + 1}月${endDate.getDate()}日`
  }

  // 日期工具：添加天数
  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(date.getDate() + days)
    return result
  }

  // 生成文件列表
  const getPdfFiles = (): CompetitionFile[] => {
    return [
      {
        name: '赛事通知文件',
        key: 'notification',
        url: '/schoolcomp2025/notification.pdf',
      },
      {
        name: '赛题汇总',
        key: 'subjects',
        url: '/schoolcomp2025/comp_subjects.pdf',
      },
    ]
  }

  // 在组件挂载时和competitionId变化时获取数据
  useEffect(() => {
    fetchCompetitionDetails()
    fetchTeamInfo()
  }, [competitionId, flag])

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Spin size="large" tip="加载竞赛信息..." />
      </div>
    )
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
    )
  }

  // 获取竞赛状态
  const competitionStatus = getCompetitionStatus(competition)

  // 生成时间轴数据
  const timelineItems = generateTimelineItems(competition)

  return (
    <div className="max-w-6xl mx-auto py-12 px-5 sm:px-8">
      {/* 赛事标题区 - 简约大气 */}
      <div className="mb-10">
        <Title
          level={1}
          style={{
            fontWeight: 600,
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            color: '#1a1a1a',
          }}
        >
          {competition.name}
        </Title>
        <div className="flex items-center text-gray-500 mt-2">
          <CalendarOutlined style={{ color: '#3e97ff' }} />
          <Text className="ml-2 text-base">
            {competition.startDate} - {competition.endDate}
          </Text>
        </div>
      </div>

      {/* 顶部赛事图片 - 完整显示 */}
      <div className="mb-16">
        <div className="rounded-2xl overflow-hidden">
          <img
            src={competition.data?.url || schoolcomp2025}
            alt={competition.name}
            className="w-full h-auto"
            style={{
              maxWidth: '100%',
              objectFit: 'contain',
            }}
            onError={(e) => {
              e.currentTarget.src = schoolcomp2025
            }}
          />
        </div>
      </div>

      {/* 中部内容区 - 左边比赛介绍，右边比赛流程 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* 左侧赛事介绍 */}
        <div>
          <Title
            level={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#1a1a1a',
            }}
          >
            关于比赛
          </Title>

          <div className="mb-8">
            <Title
              level={3}
              style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              竞赛形式
            </Title>
            <Paragraph
              style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444' }}
            >
              公开选拔和现场答辩与演示相结合。
            </Paragraph>
          </div>

          <div className="mb-8">
            <Title
              level={3}
              style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              参赛对象
            </Title>
            <Paragraph
              style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444' }}
            >
              各学院全日制本一批学生均可参加。
            </Paragraph>
          </div>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrophyOutlined
                  style={{ fontSize: '24px', color: '#3e97ff' }}
                />
              </div>
              <div className="ml-4">
                <Title
                  level={4}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  奖项设置
                </Title>
                <div
                  style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}
                >
                  比赛将评出一等奖、二等奖、三等奖各若干项，
                  奖项名额由竞赛组委会根据参赛的作品数来确定，并颁发证书和奖金。
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileTextOutlined
                  style={{ fontSize: '24px', color: '#3e97ff' }}
                />
              </div>
              <div className="ml-4">
                <Title
                  level={4}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#333',
                  }}
                >
                  奖励学分政策
                </Title>
                <div
                  style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}
                >
                  获得二等奖以上的学生可根据《福州大学本科生奖励学分管理实施办法》申请奖励学分。
                  同时根据个人意愿，成绩优秀的同学可加入福州大学服务外包与软件设计实验室，学校将对其进行提高训练，为参加全国赛做准备。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧比赛流程时间轴 */}
        <div>
          <Title
            level={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#1a1a1a',
            }}
          >
            比赛流程
          </Title>

          <div className="bg-gray-50 rounded-2xl p-8">
            <Timeline
              mode="left"
              items={timelineItems.map((item) => ({
                color: item.status === 'wait' ? '#aaa' : '#3e97ff',
                children: (
                  <div
                    className={`timeline-item ${item.status === 'process' ? 'font-medium' : ''}`}
                  >
                    <div
                      className="text-lg mb-1"
                      style={{
                        color: item.status === 'wait' ? '#999' : '#3e97ff',
                        fontWeight: item.status === 'process' ? 600 : 500,
                      }}
                    >
                      {item.title}
                    </div>
                    <div className="text-gray-500 mb-1">{item.time}</div>
                    <div className="text-gray-600 text-sm">
                      {item.description}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>

      <Divider style={{ margin: '3rem 0', borderColor: '#eee' }} />

      {/* 底部内容区 - 左边立即参与，右边赛事资料 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* 左侧操作按钮 */}
        <div>
          <Title
            level={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#1a1a1a',
            }}
          >
            即刻参与
          </Title>

          <Paragraph
            style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#444',
              marginBottom: '2rem',
            }}
          >
            比赛报名已开放，截止日期为2024年4月30日。组队完成后请点击下方"立即报名"按钮。
          </Paragraph>

          <div className="flex flex-wrap gap-4">
            <Button
              type="primary"
              size="large"
              icon={<FormOutlined />}
              onClick={() => {
                if (!isLogin) {
                  message.error('请先登录后再报名')
                  return
                }
                setShowRegisterModal(true)
              }}
              disabled={competitionStatus === 'ended'}
              style={{
                height: '3rem',
                borderRadius: '0.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {flag == true ? '修改报名' : '立即报名'}
            </Button>
            <Button
              type="default"
              size="large"
              icon={<TeamOutlined />}
              onClick={() => {
                if (!isLogin) {
                  message.error('请先登录后再查看队伍')
                  return
                }
                setShowTeamModal(true)
              }}
              style={{
                height: '3rem',
                borderRadius: '0.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                fontSize: '1rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              我的队伍
            </Button>
          </div>
        </div>

        {/* 右侧赛事文件列表 */}
        <div>
          <Title
            level={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              color: '#1a1a1a',
            }}
          >
            赛事资料
          </Title>

          <div className="rounded-2xl bg-gray-50 p-6">
            <List
              itemLayout="horizontal"
              dataSource={getPdfFiles()}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem',
                    border: 'none',
                    backgroundColor: 'white',
                  }}
                  actions={[
                    <Button
                      type="link"
                      icon={<FileTextOutlined />}
                      key={item.key}
                      onClick={() => handleFileView(item)}
                      style={{ color: '#3e97ff' }}
                    >
                      查看
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="p-2 bg-blue-50 rounded-md">
                        <FileTextOutlined
                          style={{ fontSize: '20px', color: '#3e97ff' }}
                        />
                      </div>
                    }
                    title={
                      <span style={{ fontWeight: 500, fontSize: '1rem' }}>
                        {item.name + '.pdf'}
                      </span>
                    }
                    style={{ alignItems: 'center' }}
                  />
                </List.Item>
              )}
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </div>
      </div>

      {/* 报名弹窗 */}
      <RegisterModal
        setFlag1={setFlag}
        visible={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        competitionId={competition.id.toString()}
      />

      {/* 队伍弹窗 */}
      <TeamModal
        setFlag={setFlag}
        visible={showTeamModal}
        setShowTeamModal={setShowTeamModal}
        setShowRegisterModal={setShowRegisterModal}
        onCancel={() => setShowTeamModal(false)}
        competitionId={competition.id.toString()}
      />
    </div>
  )
})

export default CompPage
