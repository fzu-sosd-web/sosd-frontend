import createLazyComponent from '@/components/create-lazy-component'
import { RoutePath } from '@/constant/routes'

const LoginPage = createLazyComponent(() => import('@/views/login'))

export const loginRoutes = [
  {
    name: '登录',
    path: RoutePath.Login,
    element: LoginPage,
  }
]
