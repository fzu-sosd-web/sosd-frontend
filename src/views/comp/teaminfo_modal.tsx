import React from 'react'
import {
  Modal,
  Button,
  Card,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  Avatar,
  message,
  Empty,
  Spin,
  Popconfirm,
  List,
  Tooltip,
} from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  BookOutlined,
  MailOutlined,
  TrophyOutlined,
  LinkOutlined,
  DeleteOutlined,
  IdcardOutlined,
  ReadOutlined,
  EditOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import { fetchCompetitionTeamInfo, delCompetitionTeam } from './api'
import { TeamInfo, TeamMember } from './type'

const { Title, Text, Paragraph } = Typography

interface TeamModalProps {
  visible: boolean
  onCancel: () => void
  competitionId: string
  onEdit?: () => void
}

const TeamInfoModal: React.FC<TeamModalProps> = ({
  visible,
  onCancel,
  competitionId,
  onEdit,
}) => {
  const [loading, setLoading] = React.useState(true)
  const [deleting, setDeleting] = React.useState(false)
  const [teamInfo, setTeamInfo] = React.useState<TeamInfo | null>(null)

  // 获取团队信息
  const fetchTeamInfo = async () => {
    if (!competitionId) return

    setLoading(true)
    try {
      const response = await fetchCompetitionTeamInfo(Number(competitionId))

      if (response && response.code === 200) {
        setTeamInfo(response.data)
      } else {
        message.error(response?.message || '获取团队信息失败')
        setTeamInfo(null)
      }
    } catch (error) {
      console.error('获取竞赛队伍信息出错:', error)
      message.error('获取团队信息失败，请稍后再试')
      setTeamInfo(null)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (visible && competitionId) {
      fetchTeamInfo()
    }
  }, [visible, competitionId])

  // 格式化创建时间
  const formatDate = (dateString: string) => {
    if (!dateString) return '未知'
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  // 处理删除队伍
  const handleDeleteTeam = async () => {
    if (!teamInfo) return

    setDeleting(true)
    try {
      const response = await delCompetitionTeam(teamInfo.id)

      if (response && response.code === 200) {
        message.success('队伍已成功删除')
        onCancel()
      } else {
        message.error(response?.message || '删除失败，请稍后再试')
      }
    } catch (error) {
      console.error('删除队伍失败:', error)
      message.error('删除失败，请稍后再试')
    } finally {
      setDeleting(false)
    }
  }

  // 加载中状态
  if (loading) {
    return (
      <Modal
        title={
          <div className="flex items-center">
            <TeamOutlined
              style={{
                fontSize: '22px',
                color: '#1890ff',
                marginRight: '12px',
              }}
            />
            <span style={{ fontSize: '18px' }}>我的参赛队伍</span>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="close" onClick={onCancel}>
            关闭
          </Button>,
        ]}
        width={820}
        bodyStyle={{ padding: '24px' }}
      >
        <div className="py-16 flex justify-center">
          <Spin size="large" tip="加载团队信息..." />
        </div>
      </Modal>
    )
  }

  // 未找到团队
  if (!teamInfo) {
    return (
      <Modal
        title={
          <div className="flex items-center">
            <TeamOutlined
              style={{
                fontSize: '22px',
                color: '#1890ff',
                marginRight: '12px',
              }}
            />
            <span style={{ fontSize: '18px' }}>我的参赛队伍</span>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="close" onClick={onCancel}>
            关闭
          </Button>,
        ]}
        width={820}
        bodyStyle={{ padding: '24px' }}
      >
        <Empty
          description={
            <div>
              <p className="text-gray-500">您尚未加入任何队伍</p>
              <Button
                type="primary"
                style={{ marginTop: '16px', borderRadius: '6px' }}
              >
                创建新队伍
              </Button>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-10"
        />
      </Modal>
    )
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <TeamOutlined
            style={{ fontSize: '22px', color: '#1890ff', marginRight: '12px' }}
          />
          <span style={{ fontSize: '18px' }}>我的参赛队伍</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={820}
      bodyStyle={{ padding: '20px 28px 28px' }}
    >
      {/* 团队基本信息 */}
      <div className="team-info">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Avatar
              size={64}
              icon={<TeamOutlined />}
              style={{
                backgroundColor: '#1890ff',
                marginRight: '18px',
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0, fontSize: '24px' }}>
                {teamInfo.name}
              </Title>
              <Space size={6} className="mt-2">
                <Tag color="success" style={{ margin: 0, padding: '0 8px' }}>
                  <CheckCircleOutlined /> 已报名
                </Tag>
                {teamInfo.rewardResult && (
                  <Tag color="gold" style={{ margin: 0, padding: '0 8px' }}>
                    <TrophyOutlined /> {teamInfo.rewardResult}
                  </Tag>
                )}
              </Space>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end">
              <ClockCircleOutlined className="text-gray-400 mr-2" />
              <Text type="secondary">
                创建于 {formatDate(teamInfo.createdAt)}
              </Text>
            </div>
            <Text type="secondary" className="text-sm block mt-1">
              ID: {teamInfo.id}
            </Text>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={15}>
            <Card
              bordered={false}
              className="bg-blue-50 rounded-lg"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-center mb-4">
                <ProjectOutlined className="text-blue-500 mr-2 text-lg" />
                <Text strong style={{ fontSize: '16px' }}>
                  项目信息
                </Text>
              </div>

              <div className="mb-4">
                <Text type="secondary">项目名称</Text>
                <div className="mt-1">
                  <Text strong style={{ fontSize: '16px' }}>
                    {teamInfo.projectName}
                  </Text>
                </div>
              </div>

              <div className="mb-4">
                <Text type="secondary">参赛选题</Text>
                <div className="mt-1">
                  <Text>{teamInfo.topic}</Text>
                </div>
              </div>

              {teamInfo.docUrl && (
                <div>
                  <Text type="secondary">项目文档</Text>
                  <div className="mt-1">
                    <a
                      href={teamInfo.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <LinkOutlined className="mr-1" /> 查看文档
                    </a>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col span={9}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card
                  bordered={false}
                  className="bg-gray-50 rounded-lg"
                  bodyStyle={{ padding: '16px 20px' }}
                >
                  <div className="flex items-center mb-2">
                    <UserOutlined className="text-blue-500 mr-2" />
                    <Text strong>指导教师</Text>
                  </div>
                  <Text>{teamInfo.advisor || '未设置'}</Text>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  bordered={false}
                  className="bg-gray-50 rounded-lg"
                  bodyStyle={{ padding: '16px 20px' }}
                >
                  <div className="flex items-center mb-2">
                    <MailOutlined className="text-blue-500 mr-2" />
                    <Text strong>联系邮箱</Text>
                  </div>
                  <Text>{teamInfo.email}</Text>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* 团队成员显示 */}
        <div className="mt-6 bg-gray-50 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TeamOutlined className="text-blue-500 mr-2 text-lg" />
              <Text strong style={{ fontSize: '16px' }}>
                团队成员
              </Text>
            </div>
            <Tag color="processing">{teamInfo.teamMembers.length} 人</Tag>
          </div>

          <Row gutter={[16, 16]}>
            {teamInfo.teamMembers.map((member, index) => {
              const isLeader = member.userId === teamInfo.leaderId

              return (
                <Col span={8} key={member.userId}>
                  <Card
                    bordered={false}
                    className={`${isLeader ? 'bg-blue-50' : 'bg-white'} rounded-lg h-full`}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <div className="flex items-start">
                      <Avatar
                        icon={isLeader ? <CrownOutlined /> : <UserOutlined />}
                        size={36}
                        className={isLeader ? 'bg-blue-500' : 'bg-gray-400'}
                        style={{ marginRight: '12px', marginTop: '2px' }}
                      />

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center mb-2">
                          <Text
                            strong
                            className="mr-2 truncate"
                            style={{ maxWidth: '100px' }}
                          >
                            {member.userName}
                          </Text>
                          {isLeader && (
                            <Tag color="blue" style={{ margin: 0 }}>
                              队长
                            </Tag>
                          )}
                        </div>

                        <div className="text-gray-500 text-sm mb-1 flex items-center">
                          <IdcardOutlined className="mr-1" />
                          <Text
                            type="secondary"
                            className="truncate"
                            style={{ maxWidth: '150px' }}
                          >
                            {member.userId}
                          </Text>
                        </div>

                        <div className="text-gray-500 text-sm flex items-center">
                          <ReadOutlined className="mr-1" />
                          <Text
                            type="secondary"
                            className="truncate"
                            style={{ maxWidth: '150px' }}
                          >
                            {member.major || '未知专业'}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>

        <Divider style={{ margin: '24px 0 20px' }} />

        <div className="flex justify-between">
          <Popconfirm
            title="删除队伍"
            description="确定要删除这个队伍吗？此操作不可撤销。"
            onConfirm={handleDeleteTeam}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true, loading: deleting }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="large"
              style={{ borderRadius: '6px' }}
            >
              删除队伍
            </Button>
          </Popconfirm>

          {/* <Button 
            type="primary"
            icon={<EditOutlined />} 
            onClick={onEdit}
            size="large"
            style={{ borderRadius: '6px' }}
          >
            编辑队伍信息
          </Button> */}
        </div>
      </div>
    </Modal>
  )
}

export default TeamInfoModal
