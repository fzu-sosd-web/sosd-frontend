import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IUserInfo } from '@/types'
import { loginApi } from '@/apis'
import { token } from '@/utils/'

interface LoginStore {
  // 状态
  userInfo: IUserInfo | null
  isLogin: boolean
  loading: boolean

  // 方法
  setUserInfo: (data: IUserInfo | null) => void
  updateUserInfo: (data: Partial<IUserInfo>) => void
  refreshUserInfo: () => Promise<IUserInfo | null>
  login: (credentials: any) => Promise<boolean>
  logout: () => void
}

export const useLoginStore = create<LoginStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      userInfo: null,
      isLogin: token.getIsLogin(),
      loading: false,

      // 设置用户信息
      setUserInfo: (data: IUserInfo | null) => {
        // 更新状态
        set({ userInfo: data, isLogin: !!data })

        // 更新token状态
        if (data) {
          token.setIsLogin(true)
          if (data.token) {
            token.setToken(data.token)
          }
        } else {
          token.setIsLogin(false)
          token.removeToken()
        }
      },

      // 更新用户信息（部分更新）
      updateUserInfo: (data: Partial<IUserInfo>) => {
        const currentUser = get().userInfo
        if (!currentUser) return

        set({
          userInfo: { ...currentUser, ...data },
        })
      },

      // 刷新用户信息
      refreshUserInfo: async () => {
        // 如果没有token，则不请求
        console.log('Token:', token.getToken())
        if (!token.getToken()) {
          set({ userInfo: null, isLogin: false })
          return null
        }

        set({ loading: true })

        try {
          const res = await loginApi.fetchIUserInfo()

          if (res.code === 200 && res.data) {
            // 如果成功获取用户信息
            const userData = res.data

            // 更新状态
            set({
              userInfo: userData,
              isLogin: true,
              loading: false,
            })

            // 确保token状态与内存状态一致
            token.setIsLogin(true)

            return userData
          } else {
            // 获取失败，清除登录状态
            set({
              userInfo: null,
              isLogin: false,
              loading: false,
            })

            token.setIsLogin(false)
            token.removeToken()

            return null
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)

          // 发生错误时，保持当前状态，但标记加载完成
          set({ loading: false })
          return get().userInfo
        }
      },

      // 登录
      login: async (credentials: any) => {
        set({ loading: true })

        try {
          const res = await loginApi.login(credentials)

          if (res.code === 200 && res.data) {
            // 登录成功，设置用户信息
            const { token: userToken, user: userInfo } = res.data
            console.log('登录成功:', userInfo)
            // 保存token
            if (userToken) {
              token.setToken(userToken)
            }

            // 更新状态
            set({
              userInfo: userInfo,
              isLogin: true,
              loading: false,
            })

            token.setIsLogin(true)

            return true
          } else {
            // 登录失败
            set({ loading: false })
            return false
          }
        } catch (error) {
          console.error('登录失败:', error)
          set({ loading: false })
          return false
        }
      },

      // 登出
      logout: () => {
        // 清除内存中的状态
        set({ userInfo: null, isLogin: false })

        // 清除本地存储
        token.setIsLogin(false)
        token.removeToken()
      },
    }),
    { name: 'login-store' },
  ),
)
