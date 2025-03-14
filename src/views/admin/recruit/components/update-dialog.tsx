import { updateAdminRecruit } from '@/apis'
import {
  Drawer,
  Spin,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
} from 'antd'
import React, { useState } from 'react'
import { useRecruitListSearch } from '../context'
import { useEventBus } from '@/hooks/useEventBus'
import { AdminRecruitEvent } from '@/constant/event/recruit'
import moment from 'moment' // 引入 moment 库
import { fetchAdminMemberList } from '@/apis'

export const AdminRecruitUpdateDialog = React.memo(() => {
  const [loading, setLoading] = useState(false)
  const [initVal, setInitVal] = useState<any>()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [members, setMembers] = useState<any>([])
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

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()

      // 转换选中的 userId 为包含 userId 和 userName 的对象数组
      const formatInterviewers = (userIds: string[]) => {
        return userIds?.map((userId) => {
          const member = members.find((m: any) => m.userId === userId)
          return {
            userId: member?.userId || userId,
            userName: member?.userName || null,
          }
        })
      }

      const formattedValues = {
        id: values.id,
        name: values.name,
        description: values.description,
        interviewer: {
          webInterviewer: formatInterviewers(
            values.interviewer?.webInterviewer,
          ),
          designInterviewer: formatInterviewers(
            values.interviewer?.designInterviewer,
          ),
          mobileInterviewer: formatInterviewers(
            values.interviewer?.mobileInterviewer,
          ),
          aiinterviewer: formatInterviewers(values.interviewer?.aiinterviewer),
        },
        startDate: values.startDate
          ? values.startDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
        endDate: values.endDate
          ? values.endDate.format('YYYY-MM-DD HH:mm:ss')
          : null,
      }

      const res = await updateAdminRecruit(formattedValues)
      if (res.success) {
        message.success('更新成功')
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

  const open = (item: any) => {
    fetchMembers()
    const formattedItem = {
      ...item,
      startDate: item.startDate
        ? moment(item.startDate, 'YYYY-MM-DD HH:mm:ss')
        : null,
      endDate: item.endDate
        ? moment(item.endDate, 'YYYY-MM-DD HH:mm:ss')
        : null,
      interviewer: {
        webInterviewer: item.interviewer?.webInterviewer?.map(
          (i: any) => i.userId,
        ),
        designInterviewer: item.interviewer?.designInterviewer?.map(
          (i: any) => i.userId,
        ),
        mobileInterviewer: item.interviewer?.mobileInterviewer?.map(
          (i: any) => i.userId,
        ),
        aiinterviewer: item.interviewer?.aiinterviewer?.map(
          (i: any) => i.userId,
        ),
      },
    }
    setInitVal(formattedItem)
    setVisible(true)
    form.setFieldsValue(formattedItem) // 设置表单初始值
  }

  useEventBus(AdminRecruitEvent.Change, open)

  return (
    <Drawer
      title={'修改纳新活动信息'}
      open={visible}
      closable
      onClose={() => {
        setVisible(false), form.resetFields()
      }}
      size={'large'}
    >
      <Spin spinning={loading}>
        <Form form={form} initialValues={initVal}>
          <Form.Item name="name" label="活动名称">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="活动描述">
            <Input />
          </Form.Item>
          <Form.Item
            name={['interviewer', 'webInterviewer']}
            label="web组面试官"
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name={['interviewer', 'designInterviewer']}
            label="设计组面试官"
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item
            name={['interviewer', 'mobileInterviewer']}
            label="移动组面试官"
          >
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item name={['interviewer', 'aiinterviewer']} label="ai组面试官">
            <Select mode="multiple" allowClear options={options} />
          </Form.Item>
          <Form.Item name="startDate" label="开始日期">
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="endDate" label="结束日期">
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 22, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              提交
            </Button>
          </Form.Item>
          <Form.Item name="id"></Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
})

export default AdminRecruitUpdateDialog
