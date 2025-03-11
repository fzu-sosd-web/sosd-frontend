import { request } from '@/request'
import { API_BASE_URL } from '@/constant/web'

export interface UpdateUserForm {
  name: string
  gender: string
  qq: string
  mobile: string
  major: string
  avatarBase64: string
  email: string
}

export const updateUser = (form: UpdateUserForm) => {
  return request.put(API_BASE_URL + `/user`, form)
}
