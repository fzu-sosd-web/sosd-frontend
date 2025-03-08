import { API_BASE_URL } from '@/constant/web'
import { request } from '@/request'

export interface Recruit {
  id: number
  name: string
  description: string

  startDate: string
  endDate: string
}
const baseURL = API_BASE_URL + '/user/recruit/'
export const fetchRecruitList = async () => {
  return request.get<Recruit[]>(baseURL + 'list')
}

export const fetchRecruitDetail = async (id: number) => {
  return request.get<Recruit>(baseURL + 'detail/' + id)
}

export interface RecruitRegisterReq {
  firstChoose: string // 第一志愿
  secondChoose: string // 第二志愿
  status: string // 是否服从调剂
}

export const registerRecruit = async (id: number, form: RecruitRegisterReq) => {
  return request.post(baseURL + id + '/register/', form)
}

export interface RecruitResume {
  id: number
  recruitId: number
  name: string
  userId: number
  firstChoose: string
  secondChoose: string
  status: string
}

export const fetchRecruitResume = async (id: number) => {
  return request.get<RecruitResume>(baseURL + id + '/resume/')
}

export const fetchRecruitResumeUploadUrl = async (id: number) => {
  return request.post<string>(baseURL + id + '/resume/upload/')
}

export const isRecruitResumeUploaded = async (id: number) => {
  return request.post<boolean>(baseURL + id + '/resume/isUploaded/')
}
