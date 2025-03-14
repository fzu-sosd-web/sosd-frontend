import { AdminRecruitEvent } from '@/constant/event/recruit'
import { useEventBus } from '@/hooks/useEventBus'
import { Drawer } from 'antd'
import { useState } from 'react'

export const AdminInterviewDialog = () => {
  const [visible, setVisible] = useState(false)
  const [interviewers, setInterviews] = useState<any>([])
  const open = (item: any) => {
    setInterviews(item)
    setVisible(true)
  }
  useEventBus(AdminRecruitEvent.InterviewDetail, open)
  return (
    <Drawer
      open={visible}
      onClose={() => setVisible(false)}
      title="纳新活动面试官详情"
      closable
    >
      <div className="flex flex-col">
        <div className="flex-row flex space-x-2">
          web组面试官:
          {interviewers?.webInterviewer?.map((interview: any, index: any) => (
            <div key={index}>{interview.userName}</div>
          ))}
        </div>
        <div className="flex-row flex">
          移动组面试官:
          {interviewers?.mobileInterviewer?.map(
            (interview: any, index: any) => (
              <div key={index}>{interview.userName}</div>
            ),
          )}
        </div>
        <div className="flex-row flex">
          ai组面试官:
          {interviewers?.aiInterviewer?.map((interview: any, index: any) => (
            <div key={index}>{interview.userName}</div>
          ))}
        </div>
        <div className="flex-row flex">
          设计组面试官:
          {interviewers?.designInterviewer?.map(
            (interview: any, index: any) => (
              <div key={index}>{interview.userName}</div>
            ),
          )}
        </div>
      </div>
    </Drawer>
  )
}
