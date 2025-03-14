import { request } from '@/request'
import { IUserInfo, IResult, LoginResp, LoginRes } from '@/types'
import { API_BASE_URL } from '@/constant/web'

const baseURL = API_BASE_URL + '/user'

// 格式化当前时间为 yyyy-MM-dd HH:mm:ss
const formatCurrentTime = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const loginBySso = (form: LoginRes) => {
  return request.post<LoginResp>(`${baseURL}/login/sso`, form)
}

export const fetchIUserInfo = (withAvatar: boolean) => {
  return request.get<IUserInfo>(`${baseURL}/info?withAvatar=${withAvatar}`, {})
}

export const sendEmailVerifyCode = (email: string) => {
  return request.get(`${baseURL}/validCode?email=${email}`)
}

export interface RegisterData {
  email: string
  name: string
  password: string
  gender: string
  qq: string
  mobile: string
  major: string
  studentId: string
  validCode: string // 新增验证码字段
}

export const register = (form: RegisterData) => {
  return request.post(`${baseURL}/register`, form)
}

export const fetchInfo = () => {
  return request.get<IResult>(`${baseURL}/info`)
}
