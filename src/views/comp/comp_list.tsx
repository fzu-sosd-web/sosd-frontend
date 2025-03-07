import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Spin,
  Empty,
  message,
  Space,
} from 'antd'
import {
  CalendarOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import './comp_list.css'
import schoolcomp2025 from '@/assets/2025schoolcomp.png'
import { API_BASE_URL } from '@/constant/web'
import { Competition } from './type'
import { fetchAllCompetitions } from './api'

const { Title, Text, Paragraph } = Typography

const CompetitionListPage: React.FC = () => {
  const navigate = useNavigate()

  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // 获取竞赛列表数据
  const fetchCompetitions = async () => {
    try {
      // API请求竞赛列表
      const response = await fetchAllCompetitions()

      if (response && response.code === 200) {
        setCompetitions(response.data || [])
      } else {
        message.error('获取竞赛列表失败')
      }
    } catch (error) {
      console.error('获取竞赛列表出错:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取竞赛当前状态
  const getCompetitionStatus = (comp: Competition) => {
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

  // 生成竞赛状态标签
  const getStatusTag = (comp: Competition) => {
    const status = getCompetitionStatus(comp)
    switch (status) {
      case 'upcoming':
        return <Tag color="blue">即将开始</Tag>
      case 'ongoing':
        return <Tag color="green">进行中</Tag>
      case 'ended':
        return <Tag color="gray">已结束</Tag>
      default:
        return null
    }
  }

  // 生成竞赛级别标签
  const getLevelTag = (comp: Competition) => {
    // 从data.type获取竞赛级别
    const level = comp.data?.type || 'unknown'
    switch (level.toLowerCase()) {
      case 'school':
        return <Tag color="purple">校级</Tag>
      case '校赛':
        return <Tag color="purple">校级</Tag>
      case 'province':
        return <Tag color="orange">省级</Tag>
      case 'national':
        return <Tag color="red">国家级</Tag>
      case 'international':
        return <Tag color="volcano">国际级</Tag>
      default:
        return <Tag>{level}</Tag>
    }
  }

  // 跳转到竞赛详情页
  const navigateToCompetition = (compId: number) => {
    navigate(`/competition/${compId}`)
  }

  // 获取竞赛封面图片
  const getCoverImage = (comp: Competition) => {
    // 如果有URL就使用，否则使用默认图片
    return comp.data?.url || schoolcomp2025
  }

  // 获取参与人数
  const getParticipantsCount = (comp: Competition) => {
    // 使用data.teamMembers或默认值
    return comp.data?.teamMembers || 0
  }

  // 首次加载获取数据
  useEffect(() => {
    fetchCompetitions()
  }, [])

  return (
    <div className="comp-list-container">
      <div className="comp-list-header">
        <Title level={2}>竞赛列表</Title>
        <Paragraph className="header-description">
          发现并参与各类精彩竞赛，展示你的才华和创新能力
        </Paragraph>
      </div>

      {/* 竞赛卡片列表 */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : competitions.length === 0 ? (
        <Empty description="暂无可用竞赛" />
      ) : (
        <div className="comp-cards">
          {competitions.map((comp) => (
            <Card
              key={comp.id}
              className="comp-card"
              bordered={false}
              style={{
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <div className="comp-image-container">
                    <img
                      src={getCoverImage(comp)}
                      alt={comp.name}
                      className="comp-cover-image"
                      onError={(e) => {
                        e.currentTarget.src = schoolcomp2025
                      }}
                    />
                    <div className="comp-status-tag">{getStatusTag(comp)}</div>
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="comp-content">
                    <div className="comp-header">
                      <Title level={4} className="comp-title">
                        {comp.name}
                      </Title>
                      <Space size={4}>{getLevelTag(comp)}</Space>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="comp-description"
                    >
                      {comp.description}
                    </Paragraph>

                    <div className="comp-meta">
                      <div className="comp-meta-item">
                        <CalendarOutlined />
                        <span>
                          {comp.startDate} 至 {comp.endDate}
                        </span>
                      </div>
                      <div className="comp-meta-item">
                        {/* <TeamOutlined /><span>{getParticipantsCount(comp)} 人已参与</span> */}
                      </div>
                    </div>

                    <div className="comp-action">
                      <Button
                        type="primary"
                        onClick={() => navigateToCompetition(comp.id)}
                      >
                        查看详情 <ArrowRightOutlined />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompetitionListPage
