import createLazyComponent from '@/components/create-lazy-component'
import { RoutePath } from '@/constant/routes'
import { RouteType } from '@/types'

const ProfilePage = createLazyComponent(() => import('@/views/profile'))
const RecruitListPage = createLazyComponent(() => import('@/views/recruit'))
const RecruitDetailPage = createLazyComponent(
  () => import('@/views/recruit/detail'),
)
const CompetitionListPage = createLazyComponent(
  () => import('@/views/comp/comp_list'),
)
const CompetitionPage = createLazyComponent(
  () => import('@/views/comp/competition'),
)
const AboutUsPage = createLazyComponent(() => import('@/views/aboutus'))
const HomePage = createLazyComponent(() => import('@/views/home'))

export const ClientRoutes: RouteType[] = [
  {
    name: '首页',
    path: RoutePath.Home,
    element: HomePage,
  },
  {
    name: '关于我们',
    path: RoutePath.AboutUs,
    element: AboutUsPage,
  },
  {
    name: '个人中心',
    path: RoutePath.Profile,
    element: ProfilePage,
  },
  {
    name: '纳新列表',
    path: RoutePath.Recruit,
    element: RecruitListPage,
    children: [
      {
        name: '纳新详情',
        path: RoutePath.RecruitDetail,
        element: RecruitDetailPage,
      },
    ],
  },
  {
    name: '竞赛列表',
    path: RoutePath.CompetitionList,
    element: CompetitionListPage,
    children: [
      {
        name: '竞赛详情',
        path: RoutePath.Competition,
        element: CompetitionPage,
      },
    ],
  },
]
