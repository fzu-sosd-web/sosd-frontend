import HeaderBar from '@/components/header-bar'
import { ConfigProvider, Layout, Typography, Button, Space, Card, Row, Col, Divider } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { ArrowRightOutlined, RocketOutlined, BulbOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import React from 'react'

import sadaharu from '@/assets/sadaharu.png' 
import { Navigate, useNavigate } from 'react-router-dom'
import { routes } from '@/routes'
import { RoutePath } from '@/constant/routes'

const { Title, Paragraph, Text } = Typography;

const HomePage = React.memo(() => {
  const navigate = useNavigate();
  return <>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#3e97ff',
            colorPrimaryHover: '#2486f9',
          },
          Typography: {
            colorTextHeading: '#1a1a1a',
          },
        },
        token: {
          colorPrimary: '#3e97ff',
          borderRadius: 8,
        }
      }}
    >
      <section className="hero-section bg-gradient-to-r from-[#f0f7ff] to-[#e0f0ff] py-32 px-6 sm:px-12 md:px-24">
        <Row justify="space-between" align="middle" gutter={[48, 48]}>
          <Col xs={24} md={14}>
            <Title level={1} style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
              福州大学服务外包与软件设计实验室
            </Title>
            <Paragraph style={{ color: '#555', fontSize: '1.2rem', marginBottom: '2rem' }}>
              我们是一支年轻、充满活力的团队。
            </Paragraph>
            <Space size="large">
              <Button type="primary" size="large" className="px-8 h-12 text-lg font-medium">
                加入我们
              </Button>
              <Button ghost style={{ borderColor: '#3e97ff', color: '#3e97ff' }} size="large" className="px-8 h-12 text-lg font-medium">
                了解更多 <ArrowRightOutlined />
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <div className="hero-image-container rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={sadaharu}  
                alt="FZU SOSD Lab" 
                className="w-full h-auto"
              />
            </div>
          </Col>
        </Row>
      </section>

      <section className="py-24 px-6 sm:px-12 md:px-24 bg-white">
        <div className="text-center mb-16">
          <Title level={2}>Service Outsourcing & Software Design Lab</Title>
          <Paragraph style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
            This is an awesome team with miracles.
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card 
              className="h-full" 
              bordered={false} 
              hoverable 
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
            >
              <BulbOutlined style={{ fontSize: '2.5rem', color: '#3e97ff', marginBottom: '1rem' }} />
              <Title level={4}>协同创新</Title>
              <Paragraph>
              ACM协同创新团队建立了“以学生为主体，以能力培养为核心，融知识、能力、素质协调发展”的拔尖创新人才培养理念；
              始终坚持协同“教学改革”、“科学研究”、“社会服务”、“国际交流”和“文化创新与传承”这五个方面来培养高水平专业人才。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="h-full" 
              bordered={false} 
              hoverable 
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
            >
              <RocketOutlined style={{ fontSize: '2.5rem', color: '#3e97ff', marginBottom: '1rem' }} />
              <Title level={4}>竞赛成果</Title>
              <Paragraph>
              福州大学服务外包与软件设计实验室成立于2013年，先后组织队员们参与了“中国大学生服务外包创新创业大赛”、
              “中国软件杯大学生软件设计大赛”、“移动应用创新赛”、“中国大学生计算机设计大赛”、“国际用户体验创新大赛”、
              “泛珠三角大学生计算机作品赛”、“海峡两岸信息服务创新大赛” 等比赛。
              累计斩获国家 特等奖1项，一等奖4项，二等奖24项，三等奖36项；省级 一等奖26项， 二等奖60项，三等奖59项。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="h-full" 
              bordered={false} 
              hoverable 
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
            >
              <SafetyCertificateOutlined style={{ fontSize: '2.5rem', color: '#3e97ff', marginBottom: '1rem' }} />
              <Title level={4}>组织架构</Title>
              <Paragraph>
              目前实验室主要设有四个小组：Web组、移动组、设计组和AI-NLP组，正式成员60余名。
              实验室先后开发了包括福州大学算法与数据结构教学网站、福州大学教务信息化管理系统在内的一系列应用软件。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="py-20 px-6 sm:px-12 md:px-24 bg-[#f0f7ff] text-center">
        <Title level={2} style={{ marginBottom: '1.5rem' }}>
          最新资讯
        </Title>
        <Paragraph style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
          2025年福州大学服务外包与软件设计校赛
        </Paragraph>
        <Button type="primary" size="large" className="px-10 h-12 text-lg font-medium"
          onClick={() => navigate(RoutePath.Competition)}>
          立即参加！
        </Button>
      </section>
    </ConfigProvider>
  </>
})

export default HomePage