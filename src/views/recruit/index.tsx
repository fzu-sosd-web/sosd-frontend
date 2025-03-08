import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Empty, Spin, Divider, Button, Image, message } from 'antd';
import { CalendarOutlined, FieldTimeOutlined, RightOutlined } from '@ant-design/icons';
import { fetchRecruitList, Recruit } from './api'; // 假设service文件存放在同一目录
import './index.css';

// 默认图片路径
import DEFAULT_IMAGE from '@/assets/sadaharu.png';

const { Title, Paragraph } = Typography;

const RecruitListPage: React.FC = () => {
  const [activities, setActivities] = useState<Recruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        // 使用提供的fetchRecruitList函数获取数据
        const response = await fetchRecruitList();
        console.log('Recruitment activities:', response);
        
        if (response.data && response.code === 200) {
          setActivities(response.data);
          setError(null);
        } else {
          console.error('API response is not an array:', response);
          setError('API返回的数据格式不正确');
          setActivities([]);
        }
      } catch (err) {
        setError('获取纳新活动失败，请稍后重试');
        console.error('Failed to fetch recruitment activities:', err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '未设置';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return '日期格式错误';
    }
  };

  // 判断活动是否进行中
  const isActivityInProgress = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return now >= start && now <= end;
  };

  // 处理不可报名的活动点击
  const handleDisabledClick = (e: React.MouseEvent, activity: Recruit) => {
    e.preventDefault(); // 阻止默认链接行为
    
    const now = new Date();
    const start = new Date(activity.startDate);
    
    if (now < start) {
      message.info('该纳新活动尚未开始，无法查看详情');
    } else {
      message.info('该纳新活动已结束，无法报名');
    }
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <Title level={2} className="pageTitle">纳新活动列表</Title>
        <Paragraph type="secondary" className="subtitle">
          纳新火热进行中，快来加入我们！
        </Paragraph>
        <div className="headerAccent"></div>
      </div>

      {error && (
        <div className="errorContainer">
          <Typography.Text type="danger">{error}</Typography.Text>
          <Button type="primary" onClick={() => window.location.reload()}>
            重试
          </Button>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无纳新活动"
          className="emptyState"
        />
      )}

      <div className="activitiesContainer">
        {activities.map((activity) => {
          // 判断活动是否进行中
          const inProgress = isActivityInProgress(activity.startDate, activity.endDate);
          
          // 根据活动状态创建不同的卡片包装
          const CardWrapper = ({ children }: { children: React.ReactNode }) => {
            if (inProgress) {
              // 如果活动进行中，使用Link包装
              return (
                <Link to={`/recruit/${activity.id}`} className="cardLink">
                  {children}
                </Link>
              );
            } else {
              // 否则使用div包装，添加点击事件
              return (
                <div 
                  className="cardLink disabledCardLink" 
                  onClick={(e) => handleDisabledClick(e, activity)}
                >
                  {children}
                </div>
              );
            }
          };
          
          return (
            <CardWrapper key={activity.id}>
              <Card 
                hoverable={inProgress} 
                className={`activityCardFullWidth ${!inProgress ? 'disabledCard' : ''}`}
                actions={inProgress ? [
                  <div key="more" className="viewMoreButton">
                    查看详情 <RightOutlined />
                  </div>
                ] : [
                  <div key="more" className="viewMoreButtonDisabled">
                    {new Date(activity.startDate) > new Date() ? '未开始' : '已结束'}
                  </div>
                ]}
              >
                <div className="cardContentRow">
                  <div className="activityImage">
                    <Image
                      src={DEFAULT_IMAGE}
                      alt={activity.name || '纳新活动'}
                      fallback={DEFAULT_IMAGE}
                      preview={false}
                      style={!inProgress ? { opacity: 0.6 } : {}}
                    />
                  </div>

                  <div className="activityMainInfo">
                    <div className="activityHeader">
                      <Typography.Title level={4} className="activityName">
                        {activity.name || '未命名活动'}
                      </Typography.Title>
                      
                      {new Date(activity.startDate) > new Date() ? 
                      <div className="activityStatus" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
                        未开始
                      </div>
                      : new Date(activity.endDate) < new Date() ? 
                      <div className="activityStatus" style={{ backgroundColor: '#fff1f0', color: '#f5222d' }}>
                        已结束
                      </div> 
                      : 
                      <div className="activityStatus">
                        进行中
                      </div>
                      }
                    </div>
                    
                    <Paragraph ellipsis={{ rows: 2 }} className="description">
                      {activity.description || '暂无描述'}
                    </Paragraph>
                  </div>
                  
                  <Divider type="vertical" className="verticalDivider" />
                  
                  <div className="dateInfoHorizontal">
                    <div className="dateItem">
                      <CalendarOutlined className="dateIcon" /> 开始: {formatDate(activity.startDate)}
                    </div>
                    <div className="dateItem">
                      <FieldTimeOutlined className="dateIcon" /> 结束: {formatDate(activity.endDate)}
                    </div>
                  </div>
                </div>
              </Card>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitListPage;