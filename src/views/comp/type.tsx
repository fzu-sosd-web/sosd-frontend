export interface CompetitionStage {
  startAt: string
  endAt: string
  description: string
  status: string
}

export interface CompetitionData {
  competitionStages: CompetitionStage[]
  teamMembers: number
  type: string // 竞赛级别类型
  url: string // 封面图片URL
}

export interface Competition {
  id: number
  name: string
  type: string
  description: string
  data: CompetitionData
  userId: string
  managerId: string
  startDate: string
  endDate: string
  createdAt: string
}

export interface TeamInfo {
  id: number
  name: string
  projectName: string
  leaderName: string
  teamMembers: TeamMember[]
  leaderId: string
  topic: string
  advisor: string
  email: string
  rewardResult: string
  docUrl: string
  createdAt: string
}

export interface TeamMember {
  userId: string
  userName: string
  major: string
}

// 下载文件接口
export interface CompetitionFile {
  name: string
  key: string
  url: string
}

// 带有详细注释和可选字段的定义
export interface CompetitionRegisterForm {
  name: string // 团队名称
  projectName: string // 项目名称/作品名称
  teamMembers: string // 团队成员列表，通常是逗号分隔的姓名或JSON字符串
  topic: string // 参赛选题/赛题
  advisor?: string // 指导教师名称，可选
  email: string // 联系邮箱，用于通知和沟通
  docUrl?: string // 文档或作品链接，可选
}
