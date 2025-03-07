import { request } from '@/request'
import { Competition, CompetitionRegisterForm } from './type'
import { API_BASE_URL } from '@/constant/web'
import { IResult } from '@/types'

const baseURL = API_BASE_URL + '/user/competition'

export const fetchAllCompetitions = (): Promise<IResult<Competition[]>> => {
  return request.get<Competition[]>(`${baseURL}/getAll`)
}

export const fetchCompetitionById = (
  id: number,
): Promise<IResult<Competition>> => {
  return request.get<Competition>(`${baseURL}/getOne/${id}`)
}

export const fetchCompetitionTeamInfo = (
  competitionId: number,
): Promise<IResult<any>> => {
  return request.get<any>(`${baseURL}/team/${competitionId}`)
}

export const registerCompetition = (
  competitionId: number,
  form: CompetitionRegisterForm,
): Promise<IResult<any>> => {
  return request.post<CompetitionRegisterForm>(
    `${baseURL}/register/${competitionId}`,
    form,
  )
}

export const delCompetitionTeam = (teamId: number): Promise<IResult<any>> => {
  return request.delete<any>(`${baseURL}/deleteTeam/${teamId}`)
}
