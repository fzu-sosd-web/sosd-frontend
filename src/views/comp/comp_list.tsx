import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Tag, 
  Spin, 
  Empty, 
  message,
  Space
} from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  ArrowRightOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './comp_list.css';
import schoolcomp2025 from '@/assets/2025schoolcomp.png'
import { API_BASE_URL } from '@/constant/web';
import { Competition } from './type';

const { Title, Text, Paragraph } = Typography;

const CompetitionListPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取竞赛列表数据
  const fetchCompetitions = async () => {
    try {
      // API请求竞赛列表
      const response = await axios.get(`${API_BASE_URL}/user/competition/getAll`);

      if (response.data && response.data.code === 200) {
        setCompetitions(response.data.data || []);
      } else {
        // 如果API调用失败，使用模拟数据
        setCompetitions(generateMockCompetitions());
      }
    } catch (error) {
      console.error('获取竞赛列表出错:', error);
      // 使用模拟数据作为后备
      setCompetitions(generateMockCompetitions());
    } finally {
      setLoading(false);
    }
  };

  // 获取竞赛当前状态
  const getCompetitionStatus = (comp: Competition) => {
    // 如果有竞赛阶段数据，尝试从中确定状态
    if (comp.data?.competitionStages?.length > 0) {
      // 查找进行中的阶段
      const ongoingStage = comp.data.competitionStages.find(
        stage => stage.status === 'process' || stage.status === 'ongoing'
      );
      if (ongoingStage) return 'ongoing';
      
      // 检查时间判断是否已结束
      const now = new Date();
      const endDate = new Date(comp.endDate);
      if (endDate < now) return 'ended';
      
      // 否则为即将开始
      return 'upcoming';
    } else {
      // 根据开始和结束日期判断
      const now = new Date();
      const startDate = new Date(comp.startDate);
      const endDate = new Date(comp.endDate);
      
      if (now < startDate) return 'upcoming';
      if (now > endDate) return 'ended';
      return 'ongoing';
    }
  };

  // 生成竞赛状态标签
  const getStatusTag = (comp: Competition) => {
    const status = getCompetitionStatus(comp);
    switch(status) {
      case 'upcoming':
        return <Tag color="blue">即将开始</Tag>;
      case 'ongoing':
        return <Tag color="green">进行中</Tag>;
      case 'ended':
        return <Tag color="gray">已结束</Tag>;
      default:
        return null;
    }
  };
  
  // 生成竞赛级别标签
  const getLevelTag = (comp: Competition) => {
    // 从data.type获取竞赛级别
    const level = comp.data?.type || 'unknown';
    switch(level.toLowerCase()) {
      case 'school':
        return <Tag color="purple">校级</Tag>;
      case 'province':
        return <Tag color="orange">省级</Tag>;
      case 'national':
        return <Tag color="red">国家级</Tag>;
      case 'international':
        return <Tag color="volcano">国际级</Tag>;
      default:
        return <Tag>{level}</Tag>;
    }
  };

  // 跳转到竞赛详情页
  const navigateToCompetition = (compId: number) => {
    navigate(`/competition/${compId}`);
  };

  // 获取竞赛封面图片
  const getCoverImage = (comp: Competition) => {
    // 如果有URL就使用，否则使用默认图片
    return comp.data?.url || schoolcomp2025;
  };

  // 获取参与人数
  const getParticipantsCount = (comp: Competition) => {
    // 使用data.teamMembers或默认值
    return comp.data?.teamMembers || 0;
  };

  // 生成模拟数据（仅开发环境使用）
  const generateMockCompetitions = (): Competition[] => {
    return [
      {
        id: 1,
        name: '2025年福州大学服务外包与软件设计校赛',
        type: 'Competition',
        description: '以"创新驱动发展，软件定义未来"为主题，面向全校学生，培养创新能力和团队协作精神的校级软件设计竞赛。',
        data: {
          competitionStages: [
            {
              startAt: '2024-04-10',
              endAt: '2024-04-30',
              description: '报名阶段',
              status: 'finish'
            },
            {
              startAt: '2024-05-01',
              endAt: '2024-05-20',
              description: '初赛阶段',
              status: 'process'
            },
            {
              startAt: '2024-05-25',
              endAt: '2024-06-10',
              description: '决赛阶段',
              status: 'wait'
            }
          ],
          teamMembers: 120,
          type: 'school',
          url: schoolcomp2025
        },
        userId: 'user-001',
        managerId: 'manager-001',
        startDate: '2024-04-10',
        endDate: '2024-06-15',
        createdAt: '2024-03-01'
      },
      {
        id: 2,
        name: '2024年中国大学生计算机设计大赛(福建赛区)',
        type: 'Competition',
        description: '旨在培养大学生创新能力和团队协作精神，提升专业综合素质，鼓励学生运用信息技术解决实际问题。',
        data: {
          competitionStages: [
            {
              startAt: '2024-05-20',
              endAt: '2024-06-10',
              description: '报名阶段',
              status: 'wait'
            }
          ],
          teamMembers: 350,
          type: 'province',
          url: schoolcomp2025
        },
        userId: 'user-002',
        managerId: 'manager-002',
        startDate: '2024-05-20',
        endDate: '2024-07-30',
        createdAt: '2024-03-10'
      },
      {
        id: 3,
        name: '2024年全国大学生软件创新大赛',
        type: 'Competition',
        description: '以推动软件技术创新与应用为主题，激发大学生创新思维和实践能力，推动产学研合作的全国性赛事。',
        data: {
          competitionStages: [
            {
              startAt: '2024-03-01',
              endAt: '2024-04-15',
              description: '报名阶段',
              status: 'finish'
            },
            {
              startAt: '2024-04-16',
              endAt: '2024-09-30',
              description: '比赛阶段',
              status: 'process'
            }
          ],
          teamMembers: 560,
          type: 'national',
          url: schoolcomp2025
        },
        userId: 'user-003',
        managerId: 'manager-003',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        createdAt: '2024-01-15'
      },
      {
        id: 4,
        name: '2023年ACM程序设计大赛',
        type: 'Competition',
        description: '面向大学生的国际性程序设计竞赛，旨在考察参赛者的算法设计与实现能力，提高编程技能和团队协作能力。',
        data: {
          competitionStages: [
            {
              startAt: '2023-10-15',
              endAt: '2023-12-20',
              description: '比赛阶段',
              status: 'finish'
            }
          ],
          teamMembers: 210,
          type: 'international',
          url: schoolcomp2025
        },
        userId: 'user-004',
        managerId: 'manager-004',
        startDate: '2023-10-15',
        endDate: '2023-12-20',
        createdAt: '2023-09-01'
      }
    ];
  };

  // 首次加载获取数据
  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="comp-list-container">
      <div className="comp-list-header">
        <Title level={2}>竞赛列表</Title>
        <Paragraph className="header-description">
          发现并参与各类精彩竞赛，展示你的才华和创新能力
        </Paragraph>
      </div>

      {/* 竞赛卡片列表 */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : competitions.length === 0 ? (
        <Empty description="暂无可用竞赛" />
      ) : (
        <div className="comp-cards">
          {competitions.map((comp) => (
            <Card 
              key={comp.id}
              className="comp-card"
              bordered={false}
              style={{
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <div className="comp-image-container">
                    <img 
                      src={getCoverImage(comp)} 
                      alt={comp.name} 
                      className="comp-cover-image"
                      onError={(e) => {
                        e.currentTarget.src = schoolcomp2025;
                      }}
                    />
                    <div className="comp-status-tag">
                      {getStatusTag(comp)}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="comp-content">
                    <div className="comp-header">
                      <Title level={4} className="comp-title">
                        {comp.name}
                      </Title>
                      <Space size={4}>
                        {getLevelTag(comp)}
                      </Space>
                    </div>
                    
                    <Paragraph 
                      ellipsis={{ rows: 2 }}
                      className="comp-description"
                    >
                      {comp.description}
                    </Paragraph>
                    
                    <div className="comp-meta">
                      <div className="comp-meta-item">
                        <CalendarOutlined /> 
                        <span>{comp.startDate} 至 {comp.endDate}</span>
                      </div>
                      <div className="comp-meta-item">
                        <TeamOutlined /> 
                        <span>{getParticipantsCount(comp)} 人已参与</span>
                      </div>
                    </div>
                    
                    <div className="comp-action">
                      <Button 
                        type="primary"
                        onClick={() => navigateToCompetition(comp.id)}
                      >
                        查看详情 <ArrowRightOutlined />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitionListPage;