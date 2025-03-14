import React from 'react'
import { RecruitListFilter } from './components/filter'
import RecruitListTable from './components/table'
import { AdminCreateRecruitDialog } from './components/create-dialog'
import AdminRecruitUpdateDialog from './components/update-dialog'
import { AdminInterviewDialog } from './components/interview-dialog'

/**管理端纳新管理页面 */
const AdminRecruitPage = React.memo(() => {
  return (
    <div>
      <AdminRecruitUpdateDialog />
      <AdminCreateRecruitDialog />
      <RecruitListFilter />
      <RecruitListTable />
      <AdminInterviewDialog />
    </div>
  )
})

export default AdminRecruitPage
