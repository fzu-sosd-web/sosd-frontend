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

const { Title, Text, Paragraph } = Typography;

// 竞赛接口定义
interface Competition {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  participantsCount: number;
  level: string; // 校级、省级、国家级等
}

// API基础URL


const CompetitionListPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取竞赛列表数据
  const fetchCompetitions = async () => {
    try {
      // API请求竞赛列表
      const response = await axios.get(`${API_BASE_URL}/api/competitions`);

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

  // 生成竞赛状态标签
  const getStatusTag = (status: string) => {
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
  const getLevelTag = (level: string) => {
    switch(level) {
      case 'school':
        return <Tag color="purple">校级</Tag>;
      case 'province':
        return <Tag color="orange">省级</Tag>;
      case 'national':
        return <Tag color="red">国家级</Tag>;
      case 'international':
        return <Tag color="volcano">国际级</Tag>;
      default:
        return null;
    }
  };

  // 跳转到竞赛详情页
  const navigateToCompetition = (compId: string) => {
    navigate(`/competition/${compId}`);
  };

  // 生成模拟数据（仅开发环境使用）
  const generateMockCompetitions = (): Competition[] => {
    return [
      {
        id: 'comp-1',
        title: '2025年福州大学服务外包与软件设计校赛',
        description: '以"创新驱动发展，软件定义未来"为主题，面向全校学生，培养创新能力和团队协作精神的校级软件设计竞赛。',
        coverImage: schoolcomp2025,
        startDate: '2024-04-10',
        endDate: '2024-06-15',
        status: 'ongoing',
        participantsCount: 120,
        level: 'school'
      },
      {
        id: 'comp-2',
        title: '2024年中国大学生计算机设计大赛(福建赛区)',
        description: '旨在培养大学生创新能力和团队协作精神，提升专业综合素质，鼓励学生运用信息技术解决实际问题。',
        coverImage: 'https://placehold.co/800x450/36cfc9/ffffff?text=计算机设计大赛',
        startDate: '2024-05-20',
        endDate: '2024-07-30',
        status: 'upcoming',
        participantsCount: 350,
        level: 'province'
      },
      {
        id: 'comp-3',
        title: '2024年全国大学生软件创新大赛',
        description: '以推动软件技术创新与应用为主题，激发大学生创新思维和实践能力，推动产学研合作的全国性赛事。',
        coverImage: 'https://placehold.co/800x450/722ed1/ffffff?text=软件创新大赛',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        status: 'ongoing',
        participantsCount: 560,
        level: 'national'
      },
      {
        id: 'comp-4',
        title: '2023年ACM程序设计大赛',
        description: '面向大学生的国际性程序设计竞赛，旨在考察参赛者的算法设计与实现能力，提高编程技能和团队协作能力。',
        coverImage: 'https://placehold.co/800x450/ff4d4f/ffffff?text=ACM大赛',
        startDate: '2023-10-15',
        endDate: '2023-12-20',
        status: 'ended',
        participantsCount: 210,
        level: 'international'
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
                      src={comp.coverImage} 
                      alt={comp.title} 
                      className="comp-cover-image"
                    />
                    <div className="comp-status-tag">
                      {getStatusTag(comp.status)}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="comp-content">
                    <div className="comp-header">
                      <Title level={4} className="comp-title">
                        {comp.title}
                      </Title>
                      <Space size={4}>
                        {getLevelTag(comp.level)}
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
                        <span>{comp.participantsCount} 人已参与</span>
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