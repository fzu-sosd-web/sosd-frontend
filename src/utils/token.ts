const TOKEN_KEY = 'SOSD_TOKEN'
const ISLOGIN_KEY = 'SOSD_ISLOGIN'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const setIsLogin = (need: boolean) => {
  localStorage.setItem(ISLOGIN_KEY, `${need}`)
}

export const getIsLogin = () => {
  return localStorage.getItem(ISLOGIN_KEY) === 'true'
}
