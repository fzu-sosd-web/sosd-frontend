export enum AdminRecruitEvent {
  Create = 'admin.recruit.create',
  Detail = 'admin.recruit.detail',
  Change = 'admin.recruit.change',
  InterviewDetail = 'admin.recruit.interview.detail',
}

/**纳新活动详情事件 */
export enum AdminRecruitDetailEvent {
  /**发送邮件 */
  Send = 'admin.recruit.detail.send',
  /**学生详情 */
  Detail = 'admin.recruit.detail.detail',
  /**一面详情 */
  FirstInterviewDetail = 'admin.recruit.detail.firstInterview.detail',
  /**二面详情 */
  SecondInterviewDetail = 'admin.recruit.detail.secondInterview.detail',
}
