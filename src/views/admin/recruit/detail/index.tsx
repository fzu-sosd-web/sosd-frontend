import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminRecruitDetailListTable from './components/table'
import AdminRecruitDetailListFilter from './components/filter'
import { InterviewDialog } from './components/interview-dialog'
import AdminSendDialog from './components/send-dialog'
import Link from 'antd/es/typography/Link'
import { RoutePath } from '@/constant/routes'

/**管理端纳新活动详情页 */
export const AdminRecruitDetailPage = React.memo(() => {
  const { adminRecruitId } = useParams<{ adminRecruitId: string }>()
  const navigate = useNavigate()
  return (
    <>
      <InterviewDialog />
      <AdminRecruitDetailListFilter id={adminRecruitId} />
      <AdminRecruitDetailListTable taskId={adminRecruitId} />
      <AdminSendDialog id={adminRecruitId} />
      <Link onClick={() => navigate(RoutePath.AdminRecruit)}>
        返回纳新活动列表
      </Link>
    </>
  )
})

export default AdminRecruitDetailPage
