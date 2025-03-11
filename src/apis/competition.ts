import { request } from '@/request'
import { API_BASE_URL } from '@/constant/web'

const BASE_URL = API_BASE_URL + 'user/competition'

export const fetchTeamInfo = (taskId: any) => {
  return request.get<any>(`${BASE_URL}/team/${taskId}`)
}

export const updateTeamInfo = (teamId: any, teamInfo: any) => {
  return request.put<any>(`${BASE_URL}/update/${teamId}`, teamInfo)
}
