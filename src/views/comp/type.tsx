export interface CompetitionStage {
    startAt: string;
    endAt: string;
    description: string;
    status: string;
  }
  
  export interface CompetitionData {
    competitionStages: CompetitionStage[];
    teamMembers: number;
    type: string;  // 竞赛级别类型
    url: string;   // 封面图片URL
  }
  
  export interface Competition {
    id: number;
    name: string;
    type: string;
    description: string;
    data: CompetitionData;
    userId: string;
    managerId: string;
    startDate: string;
    endDate: string;
    createdAt: string;
  }

  // 下载文件接口
export interface CompetitionFile {
    name: string;
    key: string;
    url: string;
  }