import {
  Drawer,
  Form,
  Spin,
  Input,
  Select,
  message,
  Button,
  DatePicker,
} from 'antd'
import React, { useState } from 'react'
import { useRecruitListSearch } from '../context'
import useRefCallback from '@/hooks/useRefCallback'
import { useEventBus } from '@/hooks/useEventBus'
import { AdminRecruitEvent } from '@/constant/event/recruit'
import { createAdminRecruit, fetchAdminMemberList } from '@/apis'
export const AdminCreateRecruitDialog = React.memo(() => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<any>([])
  const [form] = Form.useForm()
  const { loadList } = useRecruitListSearch()

  const fetchMembers = async () => {
    const res = await fetchAdminMemberList()
    if (res.code == 200) {
      setMembers(res.data)
    } else {
      message.error(res.msg)
    }
  }

  const options = members.map((member: any) => ({
    label: member.userName,
    value: member.userId,
  }))

  const open = useRefCallback(() => {
    fetchMembers()
    setVisible(true)
  })
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const formatInterviewers = (userIds: string[]) => {
        return userIds.map((userId) => {
          const member = members.find((m: any) => m.userId === userId)
          if (member) {
            return {
              userId: member.userId,
              userName: member.userName,
            }
          } else {
            return {
              userId: userId,
              userName: null,
            }
          }
        })
      }
      const formattedValues = {
        name: values.name,
        description: values.description,
        interviewer: {
          webInterviewer: formatInterviewers(values.webInterviewer),
          designInterviewer: formatInterviewers(values.designInterviewer),
          mobileInterviewer: formatInterviewers(values.mobileInterviewer),
          aiinterviewer: formatInterviewers(values.aiInterviewer),
        },
        startDate: values.startDate
          ? values.startDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
        endDate: values.endDate
          ? values.endDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
      }
      const res = await createAdminRecruit(formattedValues)
      if (res.success) {
        message.success('创建成功')
      } else {
        message.error(res.msg)
      }
      setLoading(false)
      loadList()
      form.resetFields()
      setVisible(false)
    } catch (error) {
      console.error('表单校验失败:', error)
      message.error('表单校验失败')
    } finally {
      setLoading(false)
    }
  }
  useEventBus(AdminRecruitEvent.Create, open)
  return (
    <Drawer
      open={visible}
      size={'large'}
      closable
      onClose={() => setVisible(false)}
      title={'创建新的纳新活动'}
    >
      <Spin spinning={loading}>
        <Form form={form}>
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="webInterviewer"
            label="web组面试官"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name="designInterviewer"
            label="设计组面试官"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name="mobileInterviewer"
            label="移动组面试官"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name="aiInterviewer"
            label="ai组面试官"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="开始时间"
            rules={[{ required: true }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="结束时间"
            rules={[{ required: true }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 22, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
})
