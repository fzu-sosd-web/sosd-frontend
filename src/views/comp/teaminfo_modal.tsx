import React from 'react';
import {
  Modal,
  Button,
  Card,
  Typography,
  Tag,
  Table,
  Space,
  Row,
  Col,
  Divider,
  Avatar
} from 'antd';
import {
  UserOutlined,
  FormOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  major: string;
  studentId: string;
}

interface TeamModalProps {
  visible: boolean;
  onCancel: () => void;
}

// 模拟团队数据，实际应用中应该从API获取
const mockTeam = {
  id: 'team-2024-001',
  name: '创新先锋队',
  leader: '张三',
  createTime: '2024-04-12',
  status: 'active',
  project: '智能校园导览系统',
  members: [
    { id: '1', name: '张三', role: '队长', major: '计算机科学与技术', studentId: '031902123' },
    { id: '2', name: '李四', role: '成员', major: '软件工程', studentId: '031902124' },
    { id: '3', name: '王五', role: '成员', major: '人工智能', studentId: '031902125' }
  ]
};

const TeamModal: React.FC<TeamModalProps> = ({ visible, onCancel }) => {
  // 团队成员表格列定义
  const teamMemberColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        role === '队长' ? <Tag color="blue">{role}</Tag> : role
      )
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    }
  ];

  return (
    <Modal
      title="我的队伍"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
      width={700}
    >
      {/* 简约风格的团队信息卡片 */}
      <div className="team-info">
        <div className="team-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar 
            size={64} 
            icon={<TeamOutlined />} 
            style={{ 
              backgroundColor: '#3e97ff',
              marginRight: '16px'
            }} 
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {mockTeam.name}
              <Tag color="green" style={{ marginLeft: '12px', fontSize: '12px', verticalAlign: 'middle' }}>
                <CheckCircleOutlined /> 已报名
              </Tag>
            </Title>
            <Text type="secondary">ID: {mockTeam.id}</Text>
          </div>
        </div>
        
        <Row gutter={24} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <Card 
              bordered={false} 
              size="small"
              style={{ 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: '18px', color: '#3e97ff', marginRight: '8px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>创建时间</div>
                  <div style={{ fontSize: '14px' }}>{mockTeam.createTime}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={16}>
            <Card 
              bordered={false} 
              size="small"
              style={{ 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ProjectOutlined style={{ fontSize: '18px', color: '#3e97ff', marginRight: '8px' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>项目名称</div>
                  <div style={{ fontSize: '14px' }}>{mockTeam.project}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div className="mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Title level={5} style={{ margin: 0 }}>团队成员</Title>
          <Text type="secondary">共 {mockTeam.members.length} 人</Text>
        </div>
        <Table 
          dataSource={mockTeam.members} 
          columns={teamMemberColumns} 
          pagination={false}
          rowKey="id"
          size="small"
          className="mt-2"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
      </div>
      
      <div className="team-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Space>
          <Button 
            type="primary" 
            icon={<UserOutlined />}
            style={{ borderRadius: '6px' }}
          >
            添加队员
          </Button>
          <Button 
            icon={<FormOutlined />}
            style={{ borderRadius: '6px' }}
          >
            编辑信息
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default TeamModal;