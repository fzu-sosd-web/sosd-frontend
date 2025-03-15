import { Button, DatePicker, Drawer, Form, Input, message, Select } from 'antd'
import React, { useState } from 'react'
import { useRecruitDetailListSearch } from '../context'
import useRefCallback from '@/hooks/useRefCallback'
import {
  createAdminInterview,
  fetchAdminInterviewDetail,
  updateAdminInterview,
} from '@/apis'
import { useEventBus } from '@/hooks/useEventBus'
import { AdminRecruitDetailEvent } from '@/constant/event/recruit'
import { useParams } from 'react-router-dom'
import moment from 'moment'
export const InterviewDialog = React.memo(() => {
  const { adminRecruitId } = useParams<{ adminRecruitId: string }>()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState('')
  const [data, setData] = useState<any>({
    stage: '',
    userId: '',
    interviewId: '',
    interviewName: '',
    interviewTime: '',
    interviewerName: '',
    interviewResult: '',
    groupName: '',
  })

  const fetchInterviewDetail = async (id: any) => {
    const res = await fetchAdminInterviewDetail(Number(id))
    if (res.code == 200) {
      console.log(res.data)
      const initVal = {
        ...res.data,
        interviewId: id,
        interviewTime: res.data.interviewTime
          ? moment(res.data.interviewTime)
          : null,
      }
      console.log(initVal)
      form.setFieldsValue(initVal) // 动态设置表单值
    } else {
      message.error(res.msg)
    }
  }

  const open = useRefCallback((item: any) => {
    form.resetFields() // 清空表单
    const newData = {
      stage: '一轮面试',
      userId: item.userId,
      interviewId: item.firstInterviewId || '',
      interviewName: '',
      interviewTime: '',
      interviewerName: '',
      interviewResult: '',
      groupName: item.firstChoose,
    }
    setId(item.firstInterviewId)
    setData(newData) // 更新状态
    form.setFieldsValue(newData) // 动态设置表单值
    fetchInterviewDetail(item.firstInterviewId)
    setVisible(true)
  })

  const openSecond = useRefCallback((item: any) => {
    form.resetFields() // 清空表单
    setId(item.secondInterviewId)
    const newData = {
      stage: '二轮面试',
      userId: item.userId,
      interviewId: item.secondInterviewId || '',
      interviewName: '',
      interviewTime: '',
      interviewerName: '',
      interviewResult: '',
      groupName: item.firstChoose,
    }
    setData(newData) // 更新状态
    form.setFieldsValue(newData) // 动态设置表单值
    fetchInterviewDetail(item.secondInterviewId)
    setVisible(true)
  })

  const handleSubmit = async () => {
    if (data.interviewId == '') {
      const values = await form.validateFields()
      const formattedValues = {
        stage: values.stage,
        userId: values.userId,
        interviewName: values.interviewName,
        interviewResult: values.interviewResult,
        groupName: values.groupName,
        taskId: Number(adminRecruitId),
        interviewTime: values.interviewTime
          ? values.interviewTime.format('YYYY-MM-DD HH:mm:ss')
          : null,
      }
      const res = await createAdminInterview(formattedValues)
      if (res.code == 200) {
        message.success('更新成功')
        setVisible(false)
      } else {
        message.error(res.msg)
      }
    } else {
      const values = await form.validateFields()
      const formattedValues = {
        interviewerId: values.interviewerId,
        interviewerName: values.interviewerName,
        interviewName: values.interviewName,
        interviewResult: values.interviewResult,
        groupName: values.groupName,
        stage: values.stage,
        userId: values.userId,
        interviewTime: values.interviewTime
          ? values.interviewTime.format('YYYY-MM-DD HH:mm')
          : null,
      }
      const res = await updateAdminInterview(formattedValues,id)
      if (res.code == 200) {
        message.success('创建成功')
        setVisible(false)
      } else {
        message.error(res.msg)
      }
    }
  }

  useEventBus(AdminRecruitDetailEvent.FirstInterviewDetail, open)
  useEventBus(AdminRecruitDetailEvent.SecondInterviewDetail, openSecond)

  return (
    <Drawer
      open={visible}
      size={'large'}
      closable
      onClose={() => {
        form.resetFields() // 清空表单
        setVisible(false) // 关闭弹窗
      }}
      title={data?.stage || '该面试待创建'}
    >
      <Form form={form} initialValues={data}>
        <Form.Item label="面试名称" name="interviewName">
          <Input />
        </Form.Item>
        {data.interviewId && (
          <Form.Item label="面试官" name="interviewerName">
            <Input />
          </Form.Item>
        )}
        <Form.Item label="面试组别" name="groupName">
          <Select
            options={[
              { label: 'web组', value: 'web组' },
              { label: '移动组', value: '移动组' },
              { label: '设计组', value: '设计组' },
              { label: 'ai组', value: 'AI组' },
            ]}
          />
        </Form.Item>
        <Form.Item label="面试阶段" name="stage">
          <Select
            options={[
              { label: '第一轮面试', value: '一轮面试' },
              { label: '第二轮面试', value: '二轮面试' },
            ]}
          />
        </Form.Item>
        <Form.Item label="面试时间" name="interviewTime">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        {data.interviewId && (
          <Form.Item label="面试结果" name="interviewResult">
            <Select
              options={[
                { label: '通过', value: 'pass' },
                { label: '未通过', value: 'fail' },
                { label: '等待', value: 'wait' },
              ]}
            />
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ offset: 22, span: 16 }}>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
        {data.interviewId && <Form.Item name="interviewId" />}
        {data.interviewId && <Form.Item name="interviewerId" />}
        <Form.Item name="userId" />
      </Form>
    </Drawer>
  )
})

export default InterviewDialog
