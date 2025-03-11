import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Divider,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Cascader,
} from 'antd'
import {
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
  LinkOutlined,
  BookOutlined,
  PlusOutlined,
  DeleteOutlined,
  IdcardOutlined,
  ReadOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import { CompetitionRegisterForm, TeamMember } from './type'
import {
  fetchCompetitionTeamInfo,
  registerCompetition,
  updateTeamInfo,
} from './api'
import { useLoginStore } from '@/store/login'

const { Title, Text } = Typography
const { TextArea } = Input

interface RegisterModalProps {
  visible: boolean
  onCancel: () => void
  competitionId: string
  setFlag1?: any
}

const MAX_MEMBERS = 3

const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onCancel,
  competitionId,
  setFlag1,
}) => {
  const userInfo = useLoginStore((state) => state.userInfo)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = React.useState(false)
  const [flag, setFlag] = useState<boolean>(false)
  const [teamInfo, setTeamInfo] = useState<any>({
    name: '',
    projectName: '',
    topic: '',
    advisor: '',
    email: userInfo?.email || '',
    docUrl: '',
  })
  // 获取队伍信息
  const fetchTeamInfo = async () => {
    if (!competitionId) return
    const res = await fetchCompetitionTeamInfo(Number(competitionId))
    if (res.data) {
      setTeamInfo(res.data)
      setMembers(res.data.teamMembers)
      setFlag(true)
    }
  }

  // 团队成员状态管理
  const [members, setMembers] = useState<TeamMember[]>([])

  // 初始化队长信息 (当前登录用户)
  useEffect(() => {
    if (visible) {
      form.resetFields()
      fetchTeamInfo()
    }
    if (visible && teamInfo) {
      form.setFieldsValue(teamInfo) // 动态设置表单初始值
    }
    if (userInfo) {
      // 使用当前登录用户的信息作为队长
      const captain: TeamMember = {
        userId: userInfo.id || '',
        userName: userInfo.name || '',
        major: userInfo.major || '',
      }
      fetchTeamInfo()
      // 初始化成员列表，第一个成员就是队长
      if (!flag) setMembers([captain])
    }
  }, [userInfo, visible, competitionId])

  // 添加成员
  const addMember = () => {
    if (members.length < MAX_MEMBERS) {
      setMembers([...members, { userId: '', userName: '', major: '' }])
    } else {
      message.warning(`团队成员不能超过${MAX_MEMBERS}人`)
    }
  }

  // 删除成员（不能删除队长）
  const removeMember = (index: number) => {
    if (index === 0) {
      message.warning('队长信息不能删除')
      return
    }

    const newMembers = [...members]
    newMembers.splice(index, 1)
    setMembers(newMembers)
  }

  // 更新成员信息（队长信息不能修改）
  const updateMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    if (index === 0) return // 队长信息不能修改

    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  // 处理表单提交
  const handleSubmit = async (values: CompetitionRegisterForm) => {
    // 检查队员信息完整性（跳过队长，因为队长信息已经确保完整）
    const hasOtherMembers = members.length > 1
    const isTeamValid =
      !hasOtherMembers ||
      members
        .slice(1)
        .every(
          (member) =>
            member.userId.trim() &&
            member.userName.trim() &&
            member.major.trim(),
        )

    if (!isTeamValid) {
      message.error('请完整填写所有队员信息')
      return
    }

    setSubmitting(true)
    if (Array.isArray(values.topic)) {
      values.topic = values.topic[values.topic.length - 1] // 取最后一个元素
    }
    // 如果未报名
    if (!flag) {
      try {
        // 整合表单数据
        const submitData = {
          ...values,
          teamMembers: JSON.stringify(members),
        }

        // 调用API提交报名信息
        const resp = await registerCompetition(
          Number(competitionId),
          submitData,
        )
        if (resp && resp.code === 200) {
          message.success('报名成功！')
          form.resetFields()
          // 重置成员列表只保留队长
          if (userInfo) {
            setMembers([
              {
                userId: userInfo.id || '',
                userName: userInfo.name || '',
                major: userInfo.major || '',
              },
            ])
          }
          setFlag1(true)
          onCancel()
          return
        }
        message.error(resp.data || '报名提交失败')
      } catch (error) {
        console.error('报名提交失败:', error)
        message.error(`报名提交失败, 请稍后再试`)
      } finally {
        setSubmitting(false)
      }
    } else {
      try {
        // 整合表单数据
        const submitData = {
          ...values,
          teamMembers: JSON.stringify(members),
        }

        // 调用API提交报名信息
        const resp = await updateTeamInfo(Number(teamInfo.id), submitData)
        if (resp && resp.code === 200) {
          message.success('修改成功！')
          form.resetFields()
          onCancel()
          return
        }
        message.error(resp.data || '报名修改失败')
      } catch (error) {
        console.error('报名修改失败:', error)
        message.error(`报名修改失败, 请稍后再试`)
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (!userInfo) {
    return (
      <Modal
        open={visible}
        onCancel={onCancel}
        title="提示"
        footer={[
          <Button key="ok" type="primary" onClick={onCancel}>
            确定
          </Button>,
        ]}
      >
        <div className="py-6 text-center">请先登录后再进行报名</div>
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
          <span style={{ fontSize: '18px', fontWeight: 500 }}>参赛报名</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
      bodyStyle={{ padding: '20px 24px' }}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        initialValues={teamInfo}
        className="register-form"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="团队名称"
              rules={[{ required: true, message: '请输入团队名称' }]}
            >
              <Input
                placeholder="给你的团队起个名字"
                prefix={<TeamOutlined />}
                allowClear
                autoFocus
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="projectName"
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input
                placeholder="你的参赛项目/作品名称"
                prefix={<FileTextOutlined />}
                allowClear
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="topic"
          label="参赛选题"
          rules={[{ required: true, message: '请输入参赛选题' }]}
        >
          <Cascader
            prefix={<BookOutlined />}
            placeholder="你选择的赛题"
            options={[
              {
                value: 'A类指定命题类',
                label: 'A类指定命题类',
                children: [
                  {
                    value: 'A1演出看了啥',
                    label: 'A1演出看了啥',
                  },
                  {
                    value: 'A2智能论文阅读助手',
                    label: 'A2智能论文阅读助手',
                  },
                  {
                    value: 'A3寝室管家--公平管理与协作平台',
                    label: 'A3寝室管家--公平管理与协作平台',
                  },
                  {
                    value: 'A4智能学习资源管理平台',
                    label: 'A4智能学习资源管理平台',
                  },
                  {
                    value: 'A5智慧校园全场景智能中枢系统',
                    label: 'A5智慧校园全场景智能中枢系统',
                  },
                  {
                    value: 'A6AI校园心理医生',
                    label: 'A6AI校园心理医生',
                  },
                ],
              },
              {
                value: 'B类自由命题类',
                label: 'B类自由命题类',
              },
              {
                value: 'C类用户体验类',
                label: 'C类用户体验类',
              },
            ]}
          />
        </Form.Item>

        {/* 团队成员列表 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <Text strong style={{ fontSize: '14px' }}>
              团队成员 <span className="text-red-500">*</span>
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              最多 {MAX_MEMBERS} 人
            </Text>
          </div>

          {/* 队长信息（当前用户） */}
          <div
            className="p-4 mb-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center"
            style={{ borderRadius: '8px' }}
          >
            <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
              <CrownOutlined style={{ fontSize: '16px' }} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <Text strong style={{ fontSize: '15px' }}>
                  {members[0]?.userName}
                </Text>
                <Tag color="blue" style={{ marginLeft: '8px' }}>
                  队长(您)
                </Tag>
              </div>
              <div className="flex text-gray-600">
                <div className="mr-8">
                  <UserOutlined className="mr-1" /> 学号: {members[0]?.userId}
                </div>
                <div>
                  <BookOutlined className="mr-1" /> 专业:{' '}
                  {members[0]?.major || '未设置'}
                </div>
              </div>
            </div>
          </div>

          {/* 其他队员 */}
          {members.slice(1).map((member, idx) => {
            const index = idx + 1 // 真实索引（考虑队长）
            return (
              <div
                key={index}
                className="p-4 mb-3 bg-white rounded-lg border border-gray-200 relative hover:border-blue-200 transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <Row gutter={24}>
                  <Col span={7}>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">姓名</div>
                      <Input
                        value={member.userName}
                        onChange={(e) =>
                          updateMember(index, 'userName', e.target.value)
                        }
                        placeholder="队员姓名"
                        prefix={<UserOutlined className="text-gray-400" />}
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                  </Col>

                  <Col span={7}>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">学号</div>
                      <Input
                        value={member.userId}
                        onChange={(e) =>
                          updateMember(index, 'userId', e.target.value)
                        }
                        placeholder="队员学号"
                        prefix={<IdcardOutlined className="text-gray-400" />}
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                  </Col>

                  <Col span={7}>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">专业</div>
                      <Input
                        value={member.major}
                        onChange={(e) =>
                          updateMember(index, 'major', e.target.value)
                        }
                        placeholder="队员专业"
                        prefix={<ReadOutlined className="text-gray-400" />}
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                  </Col>

                  <Col span={2}>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">移除</div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeMember(index)}
                        size="small"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="absolute -top-2 -left-1">
                  <Tag color="green">队员 {index}</Tag>
                </div>
              </div>
            )
          })}

          {members.length < MAX_MEMBERS && (
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={addMember}
              className="mt-3"
              style={{ borderRadius: '6px', height: '40px' }}
            >
              添加团队成员
            </Button>
          )}
        </div>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="advisor" label="指导教师">
              <Input
                placeholder="指导教师姓名 (可选)"
                prefix={<UserOutlined />}
                allowClear
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="联系邮箱"
              rules={[
                { required: true, message: '请输入联系邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                placeholder="团队联系邮箱"
                prefix={<MailOutlined />}
                allowClear
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item
          name="docUrl"
          label="文档链接"
        >
          <Input 
            placeholder="项目文档或作品链接 (可选)" 
            prefix={<LinkOutlined />}
            allowClear
            style={{ borderRadius: '6px' }}
          />
        </Form.Item> */}

        <Divider style={{ margin: '8px 0 16px' }} />

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button
              onClick={onCancel}
              style={{
                borderRadius: '6px',
                height: '38px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{
                borderRadius: '6px',
                height: '38px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              {flag === true ? '修改报名' : '提交报名'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RegisterModal
