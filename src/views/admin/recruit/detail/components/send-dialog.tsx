import { sendEmail } from '@/apis'
import { AdminRecruitDetailEvent } from '@/constant/event/recruit'
import { useEventBus } from '@/hooks/useEventBus'
import {
  Drawer,
  Spin,
  Form,
  message,
  Input,
  Select,
  Button,
  DatePicker,
} from 'antd'
import React, { useState } from 'react'
import moment from 'moment'

type props = {
  id: any
}

export const AdminSendDialog = React.memo<props>(({ id }: any) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [userId, setUserId] = useState<string[]>([''])
  const [form] = Form.useForm()
  const handleSend = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      // const formattedValues = {
      //   ...values,
      //   interviewTime: values.interviewTime
      //     ? values.interviewTime.format('YYYY-MM-DD HH:mm')
      //     : null,
      // }
      const vals = { ...values, userId }
      const res = await sendEmail(vals)
      if (res.code == 200) {
        message.success('发送成功')
      } else {
        message.error(res.msg)
      }
      form.resetFields()
      setVisible(false)
    } catch (error) {
      console.error('表单校验失败:', error)
      message.error('请填写完整信息')
    } finally {
      setLoading(false)
    }
  }
  const initVal = {
    taskId: Number(id),
    interviewType: '',
    interviewTime: '',
    interviewerGroup: '',
    interviewLocation: '',
    extend: '',
    name: '',
    contactNumber: '19999999999',
  }

  const open = (item: any) => {
    if (item.name) {
      setUserId([item.userId])
      initVal.name = item.name
    } else {
      setUserId(item)
    }
    form.setFieldsValue(initVal)
    setVisible(true)
  }
  useEventBus(AdminRecruitDetailEvent.Send, open)
  return (
    <Drawer
      title={'发送邮件'}
      open={visible}
      size={'large'}
      closable
      onClose={() => {
        form.resetFields(), setVisible(false)
      }}
    >
      <Spin spinning={loading}>
        <Form form={form} initialValues={initVal}>
          <Form.Item label={'发送对象'} name={'name'}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={'通知类型'}
            name="interviewType"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: '进入一轮面试', value: '进入一轮面试' },
                { label: '进入二轮面试', value: '进入二轮面试' },
                { label: '进入考核阶段', value: '进入考核阶段' },
                { label: '成为正式成员', value: '成为正式成员' },
                { label: '落选', value: '落选' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={'面试时间段'}
            name="interviewTime"
            rules={[{ required: true }]}
          >
            <Input placeholder="如2024-01-10 00:00 到 2024-01-10 01:00" />
          </Form.Item>
          <Form.Item
            label={'面试通知QQ群'}
            name="interviewerGroup"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={'面试地点'}
            name="interviewLocation"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: '204会议室', value: '204会议室' },
                {
                  label: '零壹拾光屋',
                  value: '零壹拾光屋',
                },
              ]}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 22, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleSend}>
              发送
            </Button>
          </Form.Item>
          <Form.Item name="taskId" />
          <Form.Item name="userId" />
          <Form.Item name="contactNumber" />
        </Form>
      </Spin>
    </Drawer>
  )
})

export default AdminSendDialog
