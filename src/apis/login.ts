import { request } from '@/request'
import { IUserInfo, ILoginInfo } from '@/types'
import { API_BASE_URL } from '@/constant/web'

const baseURL = API_BASE_URL + '/user'
export const login = (form: any) => {
  return request.post<ILoginInfo>(`${baseURL}/login`, form)
}

export const fetchIUserInfo = () => {
  return request.get<IUserInfo>(`${baseURL}/info`)
}
