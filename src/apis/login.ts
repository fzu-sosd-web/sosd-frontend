import { request } from '@/request'
import { IUserInfo } from '@/types'

const baseURL = '/user'
export const login = () => {
  return request.get<IUserInfo>(`${baseURL}/login`)
}

export const fetchIUserInfo = () => {
  return request.get<IUserInfo>(`${baseURL}/info`)
}
