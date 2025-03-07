import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { produce } from 'immer'
import { LoginMethod, LoginStore, IUserInfo } from '@/types'
import { loginApi } from '@/apis'
import { token } from '@/utils'

export const useLoginStore = create<LoginStore & LoginMethod>()(
  persist(
    (set, get) => {
      const setUserInfo = (data: IUserInfo | null) => {
        set(
          produce((state: LoginStore) => {
            state.userInfo = data
            state.isLogin = !!data
          }),
        )
        // 同步更新 token 工具类中的状态
        token.setIsLogin(!!data)
        if (data?.token) {
          token.setToken(data.token)
        }
      }

      const refreshUserInfo = async (refresh?: boolean) => {
        set(
          produce((state: LoginStore) => {
            state.loading = true
          }),
        )

        const res = await loginApi.fetchIUserInfo()
        if (!res.data) {
          set(
            produce((state: LoginStore) => {
              state.userInfo = null
              state.loading = false
              state.isLogin = false
            }),
          )
          token.setIsLogin(false)
          token.removeToken()
          return null
        }

        set(
          produce((state: LoginStore) => {
            state.userInfo = res.data as IUserInfo
            state.loading = false
            state.isLogin = true
          }),
        )
        token.setIsLogin(true)
        if (res.data.token) {
          token.setToken(res.data.token)
        }

        return res.data
      }

      const logout = () => {
        set(
          produce((state: LoginStore) => {
            state.userInfo = null
            state.isLogin = false
          }),
        )
        // 清除本地存储
        token.setIsLogin(false)
        token.removeToken()
      }

      return {
        userInfo: null,
        isLogin: token.getIsLogin() || false, // 初始化时尝试从本地存储获取
        loading: false,
        setUserInfo,
        refreshUserInfo,
        logout,
      }
    },
    {
      name: 'user-login-storage', // localStorage 的键名
      storage: createJSONStorage(() => localStorage),
      // 只持久化这些字段
      partialize: (state) => ({
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
    },
  ),
)
