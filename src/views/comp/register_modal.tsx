import React from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
  Space,
  message
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RegisterModalProps {
  visible: boolean;
  onCancel: () => void;
  competitionId: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, onCancel, competitionId }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('报名信息:', values);
    message.success('报名成功！请等待审核');
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      title="参赛报名"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="pt-4"
      >
        <Title level={5}>团队信息</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="teamName"
              label="团队名称"
              rules={[{ required: true, message: '请输入团队名称' }]}
            >
              <Input placeholder="给你的团队起个名字" prefix={<TeamOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="projectTitle"
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="你的参赛项目名称" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="projectDesc"
              label="项目简介"
              rules={[{ required: true, message: '请输入项目简介' }]}
            >
              <TextArea 
                placeholder="简要描述你的项目定位和创新点（不超过300字）" 
                rows={4}
                maxLength={300}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Title level={5} className="mt-4">队长信息</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leaderName"
              label="姓名"
              rules={[{ required: true, message: '请输入队长姓名' }]}
            >
              <Input placeholder="队长姓名" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="leaderStudentId"
              label="学号"
              rules={[{ required: true, message: '请输入队长学号' }]}
            >
              <Input placeholder="学号" prefix={<IdcardOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leaderMajor"
              label="专业"
              rules={[{ required: true, message: '请选择专业' }]}
            >
              <Select placeholder="选择专业">
                <Option value="计算机科学与技术">计算机科学与技术</Option>
                <Option value="软件工程">软件工程</Option>
                <Option value="人工智能">人工智能</Option>
                <Option value="数据科学">数据科学</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="leaderPhone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input placeholder="联系电话" prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="leaderEmail"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="电子邮箱" prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        
        <Title level={5} className="mt-4">其他队员</Title>
        <Paragraph type="secondary" className="mb-4">
          每支队伍至少3人，最多5人。每位队员信息将在报名后添加。
        </Paragraph>
        
        <Form.Item className="mt-6">
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
            >
              提交报名
            </Button>
            <Button 
              onClick={onCancel}
              size="large"
            >
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;