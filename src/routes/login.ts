import createLazyComponent from '@/components/create-lazy-component'
import { RoutePath } from '@/constant/routes'

const LoginPage = createLazyComponent(() => import('@/views/login'))
const RegisterPage = createLazyComponent(() => import('@/views/register'))

export const loginRoutes = [
  {
    name: '登录',
    path: RoutePath.Login,
    element: LoginPage,
  },
  {
    name: '注册',
    path: RoutePath.Register,
    element: RegisterPage,
  },
]
