import { request } from '@/request'
import { IUserInfo, ILoginInfo } from '@/types'

const baseURL = '/user'
export const login = (form: any) => {
  return request.post<ILoginInfo>(`${baseURL}/login`, form)
}

export const fetchIUserInfo = () => {
  return request.get<IUserInfo>(`${baseURL}/info`)
}
