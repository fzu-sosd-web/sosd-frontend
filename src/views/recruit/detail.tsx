import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Spin, 
  Button, 
  Card, 
  Space,
  message,
  Result,
  Image,
  Row,
  Col,
  Divider
} from 'antd';
import { LeftOutlined, CalendarOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { fetchRecruitDetail, Recruit } from './api';
import './detail.css';

// 默认图片路径
import DEFAULT_IMAGE from '@/assets/sadaharu.png';

const { Title, Paragraph } = Typography;

const RecruitDetail: React.FC = () => {
  const { recruitId } = useParams<{ recruitId: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Recruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadActivityDetail = async () => {
      console.log('Loading activity detail:', recruitId);
      if (!recruitId) return;
      
      try {
        setLoading(true);
        const response = await fetchRecruitDetail(Number(recruitId));
        console.log('Activity detail:', response);
        
        if (response.data && response.code === 200) {
          setActivity(response.data);
          setError(null);
        } else {
          console.error('API response error:', response);
          setError('API返回的数据格式不正确');
          setActivity(null);
        }
      } catch (err) {
        setError('获取活动详情失败，请稍后重试');
        console.error('Failed to fetch activity detail:', err);
        setActivity(null);
      } finally {
        setLoading(false);
      }
    };

    loadActivityDetail();
  }, [recruitId]);

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

  const handleApply = async () => {
    if (!recruitId) return;
    
    try {
      setApplying(true);
      // 这里需要替换为实际的报名API
      // 例如: await submitApplication(Number(id));
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('申请提交成功！');
    } catch (err) {
      message.error('申请提交失败，请稍后重试');
      console.error('Failed to submit application:', err);
    } finally {
      setApplying(false);
    }
  };

  const handleBack = () => {
    navigate('/recruit');
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="detail-page">
        <Result
          status="error"
          title="获取纳新活动信息失败"
          subTitle={error || "未找到该纳新活动信息"}
          extra={[
            <Button type="primary" key="back" onClick={handleBack}>
              返回纳新活动列表
            </Button>,
          ]}
        />
      </div>
    );
  }

  // 判断活动是否进行中
  const now = new Date();
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  const activityStatus = now < startDate ? 'upcoming' : now > endDate ? 'ended' : 'active';

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={handleBack}
          className="back-button"
        >
          返回纳新活动列表
        </Button>
      </div>

      <div className="detail-header">
        <div className="detail-header-content">
          <div className="detail-image-container">
            <Image
              src={DEFAULT_IMAGE}
              alt={activity.name || '纳新活动'}
              fallback={DEFAULT_IMAGE}
              preview={false}
              className="detail-image"
            />
          </div>
          
          <div className="detail-header-info">
            <Typography.Title level={2} className="detail-title">
              {activity.name || '未命名纳新活动'}
            </Typography.Title>
            
            <div className={`activity-status status-${activityStatus}`}>
              {activityStatus === 'upcoming' ? '即将开始' : 
               activityStatus === 'ended' ? '已结束' : '进行中'}
            </div>
            
            <div className="activity-dates">
              <div className="date-item">
                <CalendarOutlined className="date-icon" /> 开始时间: {formatDate(activity.startDate)}
              </div>
              <div className="date-item">
                <FieldTimeOutlined className="date-icon" /> 结束时间: {formatDate(activity.endDate)}
              </div>
            </div>

            <Divider className="info-divider" />
            
            <div className="description-content">
              <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                {activity.description || '暂无详细描述'}
              </Paragraph>
            </div>
          </div>

          <div className="detail-actions">
            <div className="action-section">
              <h3 className="action-title">报名参与</h3>
              <p className="action-text">
                {activityStatus === 'active' ? 
                  '该纳新活动正在进行中，欢迎报名参加！' : 
                  activityStatus === 'upcoming' ? 
                    '该纳新活动尚未开始，请耐心等待。' :
                    '该纳新活动已结束，报名通道已关闭。'
                }
              </p>
              
              <Button 
                type="primary" 
                size="large" 
                onClick={handleApply} 
                loading={applying}
                disabled={activityStatus !== 'active'}
                className="apply-button"
              >
                {activityStatus === 'active' ? '立即报名' : 
                 activityStatus === 'upcoming' ? '未开始' : '已结束'}
              </Button>
            </div>

            <Divider className="action-divider" />
            
            <div className="contact-section">
              <h3 className="action-title">联系我们</h3>
              <p className="contact-item">邮箱：contact@example.com</p>
              <p className="contact-item">电话：123-456-7890</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="progress-section-placeholder">
        {/* 这里将来可以放置纳新进度组件 */}
        <div className="progress-container">
          <h2 className="progress-title">纳新进度</h2>
          <p className="progress-note">该功能正在开发中，敬请期待...</p>
        </div>
      </div>
    </div>
  );
};

export default RecruitDetail;