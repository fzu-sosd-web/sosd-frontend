import { RoutePath } from '@/constant/routes'
import createLazyComponent from '@/components/create-lazy-component'
import { RouteType } from '@/types'

const AdminRecruitDetailPage = createLazyComponent(
  () => import('@/views/admin/recruit/detail'),
)

const AdminRecruitPage = createLazyComponent(
  () => import('@/views/admin/recruit'),
)

export const AdminRoutes: RouteType[] = [
  {
    name: '管理端纳新管理页面',
    path: RoutePath.AdminRecruit,
    element: AdminRecruitPage,
    children: [
      {
        name: '管理端纳新详情页',
        path: RoutePath.AdminRecruitDetail,
        element: AdminRecruitDetailPage,
        permission: 'ViewCandidate',
      },
    ],
  },
]
