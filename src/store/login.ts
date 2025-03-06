import { create } from 'zustand'
import { produce } from 'immer'
import { LoginMethod, LoginStore, IUserInfo } from '@/types'
import { loginApi } from '@/apis'
import { token } from '@/utils'

export const useLoginStore = create<LoginStore & LoginMethod>((set, get) => {
  const setUserInfo = (data: IUserInfo | null) => {
    set(
      produce((state: LoginStore) => {
        state.userInfo = data
        state.isLogin = true
      }),
    )
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
      return null
    }

    set(
      produce((state: LoginStore) => {
        state.userInfo = res.data as IUserInfo
        state.loading = false
        state.isLogin = true
      }),
    )

    return res.data
  }

  return {
    userInfo: null,
    isLogin: false,
    loading: false,
    setUserInfo,
    refreshUserInfo,
  }
})
