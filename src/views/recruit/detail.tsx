import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  Spin,
  Button,
  Card,
  Space,
  message,
  Result,
  Image,
  Row,
  Col,
  Divider,
  Form,
  Select,
  Tag,
  Upload,
  Modal,
} from 'antd'
import {
  LeftOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import {
  fetchRecruitDetail,
  Recruit,
  registerRecruit,
  RecruitRegisterReq,
  fetchRecruitResume,
  RecruitResume,
  fetchRecruitResumeUploadUrl,
  isRecruitResumeUploaded,
} from './api'
import './detail.css'

// 默认图片路径
import DEFAULT_IMAGE from '@/assets/recruit.png'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

const RecruitDetail: React.FC = () => {
  const { recruitId } = useParams<{ recruitId: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [activity, setActivity] = useState<Recruit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [resumeData, setResumeData] = useState<RecruitResume | null>(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [checkingResume, setCheckingResume] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [registerModalVisible, setRegisterModalVisible] = useState(false)

  // 获取活动详情
  useEffect(() => {
    const loadActivityDetail = async () => {
      console.log('Loading activity detail:', recruitId)
      if (!recruitId) return

      try {
        setLoading(true)
        const response = await fetchRecruitDetail(Number(recruitId))
        console.log('Activity detail:', response)

        if (response.data && response.code === 200) {
          setActivity(response.data)
          setError(null)

          // 获取当前用户的报名状态
          checkUserRegistration(Number(recruitId))
        } else {
          console.error('API response error:', response)
          setError('API返回的数据格式不正确')
          setActivity(null)
        }
      } catch (err) {
        setError('获取活动详情失败，请稍后重试')
        console.error('Failed to fetch activity detail:', err)
        setActivity(null)
      } finally {
        setLoading(false)
      }
    }

    loadActivityDetail()
  }, [recruitId])

  // 检查用户是否已报名
  const checkUserRegistration = async (id: number) => {
    try {
      const response = await fetchRecruitResume(id)

      if (response.data && response.code === 200) {
        setResumeData(response.data)
        setRegistered(true)

        // 初始化表单值
        form.setFieldsValue({
          firstChoose: response.data.firstChoose,
          secondChoose: response.data.secondChoose,
          status: response.data.status,
        })

        // 检查是否上传了简历
        checkResumeUploadStatus(id)
      } else {
        setRegistered(false)
        setResumeData(null)
      }
    } catch (err) {
      console.error('Failed to fetch user registration:', err)
      setRegistered(false)
      setResumeData(null)
    }
  }

  // 检查是否上传了简历
  const checkResumeUploadStatus = async (id: number) => {
    setCheckingResume(true)
    try {
      const response = await isRecruitResumeUploaded(id)
      if (response.data && response.code === 200) {
        setResumeUploaded(true)
      } else {
        setResumeUploaded(false)
      }
    } catch (error) {
      console.error('检查简历上传状态出错:', error)
      setResumeUploaded(false)
    } finally {
      setCheckingResume(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '未设置'

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (e) {
      console.error('Invalid date format:', dateString)
      return '日期格式错误'
    }
  }

  // 提交报名信息
  const handleSubmitRegistration = async (values: RecruitRegisterReq) => {
    if (!recruitId) return

    try {
      setApplying(true)
      const response = await registerRecruit(Number(recruitId), values)

      if (response.code === 200) {
        message.success('报名信息提交成功！')
        setRegisterModalVisible(false)

        // 刷新报名状态
        checkUserRegistration(Number(recruitId))
      } else {
        message.error(response.message || '提交失败，请稍后重试')
      }
    } catch (err) {
      message.error('申请提交失败，请稍后重试')
      console.error('Failed to submit application:', err)
    } finally {
      setApplying(false)
    }
  }

  const handleBack = () => {
    navigate('/recruit')
  }

  if (loading) {
    return (
      <div className="detail-loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="detail-page">
        <Result
          status="error"
          title="获取纳新活动信息失败"
          subTitle={error || '未找到该纳新活动信息'}
          extra={[
            <Button type="primary" key="back" onClick={handleBack}>
              返回纳新活动列表
            </Button>,
          ]}
        />
      </div>
    )
  }

  // 判断活动是否进行中
  const now = new Date()
  const startDate = new Date(activity.startDate)
  const endDate = new Date(activity.endDate)
  const activityStatus =
    now < startDate ? 'upcoming' : now > endDate ? 'ended' : 'active'

  // 获取简历上传按钮状态
  const getUploadButtonText = () => {
    if (uploading) return '正在上传...'
    if (resumeUploaded) return '重新上传简历'
    return '上传简历附件'
  }

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={handleBack}
          className="back-button"
        >
          返回纳新活动列表
        </Button>
      </div>

      <div className="detail-container">
        {/* 宽幅图片区域 - 现在位于顶部 */}
        <div className="detail-banner">
          <div className="banner-image-container">
            <img
              src={DEFAULT_IMAGE}
              alt={activity.name || '纳新活动'}
              className="banner-image"
            />
            <div className="banner-overlay">
              <div className="banner-content">
                <Typography.Title level={2} className="banner-title">
                  {activity.name || '未命名纳新活动'}
                </Typography.Title>
                <div className={`activity-status status-${activityStatus}`}>
                  {activityStatus === 'upcoming'
                    ? '即将开始'
                    : activityStatus === 'ended'
                      ? '已结束'
                      : '进行中'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <Row gutter={24}>
            {/* 右侧 - 报名操作区域 */}
            <Col xs={24} md={8} lg={7} xl={6} className="detail-sidebar">
              <Card bordered={false} className="action-card">
                <div className="action-section">
                  <h3 className="action-title">报名参与</h3>

                  {registered ? (
                    <>
                      <div className="registered-info">
                        <Tag color="success" className="register-status-tag">
                          <CheckCircleOutlined /> 已报名
                        </Tag>

                        {checkingResume ? (
                          <Tag color="processing" className="resume-status-tag">
                            <Spin size="small" /> 检查附件状态
                          </Tag>
                        ) : resumeUploaded ? (
                          <Tag color="green" className="resume-status-tag">
                            <FilePdfOutlined /> 已上传附件
                          </Tag>
                        ) : (
                          <Tag color="warning" className="resume-status-tag">
                            <ExclamationCircleOutlined /> 未上传附件
                          </Tag>
                        )}
                      </div>

                      <div className="registered-detail">
                        <div className="registered-item">
                          <Text type="secondary">第一志愿:</Text>
                          <Text strong style={{ marginLeft: '8px' }}>
                            {resumeData?.firstChoose || '-'}
                          </Text>
                        </div>
                        <div className="registered-item">
                          <Text type="secondary">第二志愿:</Text>
                          <Text strong style={{ marginLeft: '8px' }}>
                            {resumeData?.secondChoose || '-'}
                          </Text>
                        </div>
                        <div className="registered-item">
                          <Text type="secondary">是否服从调剂:</Text>
                          <Text strong style={{ marginLeft: '8px' }}>
                            {resumeData?.status === '1' ? '是' : '否'}
                          </Text>
                        </div>
                      </div>

                      <div className="resume-upload-section">
                        <Upload
                          accept=".pdf,.doc,.docx"
                          showUploadList={false}
                          beforeUpload={async (file) => {
                            const validTypes = ['application/pdf']
                            const isValidFileType =
                              validTypes.includes(file.type) ||
                              file.name.endsWith('.pdf')

                            if (!isValidFileType) {
                              message.error('只能上传PDF文档!')
                              return false
                            }

                            const isLt10M = file.size / 1024 / 1024 < 10
                            if (!isLt10M) {
                              message.error('文件大小不能超过10MB!')
                              return false
                            }

                            setUploading(true)
                            try {
                              if (!recruitId) return false

                              const response =
                                await fetchRecruitResumeUploadUrl(
                                  Number(recruitId),
                                )
                              if (response.code === 200 && response.data) {
                                try {
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  console.log('上传链接:', response.data)
                                  console.log('上传文件:', file)

                                  const uploadResponse = await fetch(
                                    response.data,
                                    {
                                      method: 'PUT',
                                      body: formData,
                                      redirect: 'follow',
                                    },
                                  )

                                  console.log('上传响应:', uploadResponse)

                                  if (!uploadResponse.ok) {
                                    throw new Error(
                                      `上传失败: ${uploadResponse.status} ${uploadResponse.statusText}`,
                                    )
                                  }

                                  message.success('简历上传成功！')
                                  setResumeUploaded(true)
                                } catch (error) {
                                  console.error('上传出错:', error)
                                  message.error('文件上传失败，请稍后重试')
                                }
                              } else {
                                console.error('获取上传链接失败:', response)
                                message.error(
                                  response.message ||
                                    '获取上传链接失败，请稍后重试',
                                )
                              }
                            } catch (error) {
                              console.error('获取上传链接网络错误:', error)
                              message.error('网络连接异常，请检查网络后重试')
                            } finally {
                              setUploading(false)
                            }
                            return false
                          }}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            loading={uploading}
                            className="resume-upload-button"
                          >
                            {getUploadButtonText()}
                          </Button>
                        </Upload>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="action-text">
                        {activityStatus === 'active'
                          ? '该纳新活动正在进行中，欢迎报名参加！'
                          : activityStatus === 'upcoming'
                            ? '该纳新活动尚未开始，请耐心等待。'
                            : '该纳新活动已结束，报名通道已关闭。'}
                      </p>

                      <Button
                        type="primary"
                        size="large"
                        onClick={() => setRegisterModalVisible(true)}
                        loading={applying}
                        disabled={activityStatus !== 'active'}
                        className="apply-button"
                      >
                        {activityStatus === 'active'
                          ? '立即报名'
                          : activityStatus === 'upcoming'
                            ? '未开始'
                            : '已结束'}
                      </Button>
                    </>
                  )}
                </div>

                <Divider className="action-divider" />

                <div className="contact-section">
                  <h3 className="action-title">联系我们</h3>
                  <p className="contact-item">邮箱：2609242369@qq.com</p>
                  <p className="contact-item">qq群：975834618</p>
                </div>
              </Card>
            </Col>

            {/* 左侧 - 活动详情区域 */}
            <Col xs={24} md={16} lg={17} xl={18} className="detail-main">
              <Card bordered={false} className="info-card">
                <div className="activity-dates">
                  <div className="date-item">
                    <CalendarOutlined className="date-icon" /> 开始时间:{' '}
                    {formatDate(activity.startDate)}
                  </div>
                  <div className="date-item">
                    <FieldTimeOutlined className="date-icon" /> 结束时间:{' '}
                    {formatDate(activity.endDate)}
                  </div>
                </div>

                <Divider className="info-divider" />

                <div className="description-section">
                  <Typography.Title level={4} className="section-title">
                    活动详情
                  </Typography.Title>
                  <div className="description-content">
                    <Paragraph>
                      {activity.description || '暂无详细描述'}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* 报名表单弹窗 */}
      <Modal
        title="填写报名信息"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRegistration}
          requiredMark={false}
          className="register-form"
        >
          <Form.Item
            name="firstChoose"
            label="第一志愿"
            rules={[{ required: true, message: '请选择第一志愿' }]}
          >
            <Select placeholder="请选择您的第一志愿">
              <Option value="Web组">Web组</Option>
              <Option value="设计组">设计组</Option>
              <Option value="移动组">移动组</Option>
              <Option value="AI组">AI组</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="secondChoose"
            label="第二志愿"
            rules={[{ required: true, message: '请选择第二志愿' }]}
          >
            <Select placeholder="请选择您的第二志愿">
              <Option value="Web组">Web组</Option>
              <Option value="设计组">设计组</Option>
              <Option value="移动组">移动组</Option>
              <Option value="AI组">AI组</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="是否服从调剂"
            rules={[{ required: true, message: '请选择是否服从调剂' }]}
          >
            <Select placeholder="请选择是否服从调剂">
              <Option value="1">是</Option>
              <Option value="0">否</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="form-actions">
              <Button
                onClick={() => setRegisterModalVisible(false)}
                style={{ marginRight: '12px' }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={applying}>
                提交报名
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RecruitDetail
