import { request } from '@/request'
import { API_BASE_URL } from '@/constant/web'

const baseURL = API_BASE_URL + '/admin/recruit'

/**管理端获取所有纳新活动列表 */
export const fetchAdminRecruitList = (query: any) => {
  return request.get<any>(`${baseURL}/task/${query.page}/${query.pageSize}`)
}

/**管理端更新纳新活动信息 */
export const updateAdminRecruit = (data: any) => {
  return request.put<any>(`${baseURL}/task/update/${data.id}`, data)
}

/**管理端创建新的纳新活动 */
export const createAdminRecruit = (data: any) => {
  return request.post<any>(`${baseURL}/task/create`, data)
}

/**获取纳新活动详情列表 */
export const fetchAdminRecruitDetailList = (query: any) => {
  if (query.query.groupName) {
    return request.get<any>(
      `${baseURL}/task/${query.id}/${query.page}/${query.pageSize}?groupName=${query.query.groupName}`,
    )
  } else {
    return request.get<any>(
      `${baseURL}/task/${query.id}/${query.page}/${query.pageSize}?groupName=0`,
    )
  }
}

/**获取面试详情 */
export const fetchAdminInterviewDetail = (id: number) => {
  return request.get<any>(`${baseURL}/interview/${id}`)
}

/**管理端发送面试邮件 */
export const sendEmail = (data: any) => {
  return request.post<any>(`${baseURL}/interview/sendEmail`, data)
}

/**管理端获取简历url */
export const fetchAdminRecruitFile = (id: any, taskId: any) => {
  return request.get<any>(`${baseURL}/resume/file/${id}?taskId=${taskId}`)
}

/**管理端获取正式成员列表 */
export const fetchAdminMemberList = () => {
  return request.get<any>(`${baseURL}/task/member`)
}

/**管理端修改面试情况 */
export const updateAdminInterview = (data: any, id: any) => {
  return request.put<any>(`${baseURL}/interview/update/${id}`, data)
}

/**管理端创建学生面试 */
export const createAdminInterview = (data: any) => {
  return request.post<any>(`${baseURL}/interview/create`, data)
}
