import HeaderBar from '@/components/header-bar'
import {
  ConfigProvider,
  Layout,
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  Divider,
} from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import {
  ArrowRightOutlined,
  RocketOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import React from 'react'
import recruit from '@/assets/recruit.png'

import sadaharu from '@/assets/sadaharu.png'
import { Navigate, useNavigate } from 'react-router-dom'
import { routes } from '@/routes'
import { RoutePath } from '@/constant/routes'

import schoolcomp2025 from '@/assets/2025schoolcomp.png'

const { Title, Paragraph, Text } = Typography

const HomePage = React.memo(() => {
  const navigate = useNavigate()
  return (
    <>
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
          },
        }}
      >
        <section className="hero-section bg-gradient-to-r from-[#f0f7ff] to-[#e0f0ff] py-32 px-6 sm:px-12 md:px-24">
          <Row justify="space-between" align="middle" gutter={[48, 48]}>
            <Col xs={24} md={14}>
              <Title
                level={1}
                style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
              >
                福州大学服务外包与软件设计实验室
              </Title>
              <Paragraph
                style={{
                  color: '#555',
                  fontSize: '1.2rem',
                  marginBottom: '2rem',
                }}
              >
                我们是一支年轻、充满活力的团队。
              </Paragraph>
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  className="px-8 h-12 text-lg font-medium"
                >
                  加入我们
                </Button>
                <Button
                  ghost
                  style={{ borderColor: '#3e97ff', color: '#3e97ff' }}
                  size="large"
                  className="px-8 h-12 text-lg font-medium"
                >
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
            <Paragraph
              style={{
                fontSize: '1.1rem',
                maxWidth: '800px',
                margin: '0 auto',
              }}
            >
              This is an awesome team with miracles.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card
                className="h-full"
                bordered={false}
                hoverable
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                }}
              >
                <BulbOutlined
                  style={{
                    fontSize: '2.5rem',
                    color: '#3e97ff',
                    marginBottom: '1rem',
                  }}
                />
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
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                }}
              >
                <RocketOutlined
                  style={{
                    fontSize: '2.5rem',
                    color: '#3e97ff',
                    marginBottom: '1rem',
                  }}
                />
                <Title level={4}>竞赛成果</Title>
                <Paragraph>
                  福州大学服务外包与软件设计实验室成立于2013年，先后组织队员们参与了“中国大学生服务外包创新创业大赛”、
                  “中国软件杯大学生软件设计大赛”、“移动应用创新赛”、“中国大学生计算机设计大赛”、“国际用户体验创新大赛”、
                  “泛珠三角大学生计算机作品赛”、“海峡两岸信息服务创新大赛” 等比赛。
                  累计斩获国家 特等奖1项，一等奖4项，二等奖24项，三等奖36项；省级 一等奖26项，
                  二等奖60项，三等奖59项。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                className="h-full"
                bordered={false}
                hoverable
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                }}
              >
                <SafetyCertificateOutlined
                  style={{
                    fontSize: '2.5rem',
                    color: '#3e97ff',
                    marginBottom: '1rem',
                  }}
                />
                <Title level={4}>组织架构</Title>
                <Paragraph>
                  目前实验室主要设有四个小组：Web组、移动组、设计组和AI-NLP组，正式成员60余名。
                  实验室先后开发了包括福州大学算法与数据结构教学网站、福州大学教务信息化管理系统在内的一系列应用软件。
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="py-20 px-6 sm:px-12 md:px-24 bg-[#f0f7ff]">
          <div className="text-center mb-12">
            <Title level={2} style={{ marginBottom: '1.5rem' }}>
              最新资讯
            </Title>
            <Paragraph
              style={{
                fontSize: '1.1rem',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              关注我们的最新活动与通知，公众号：ACM协同创新团队
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            {/* 校赛活动卡片 */}
            <Col xs={24} md={12} lg={10}>
              <Card
                className="event-card"
                bordered={false}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                  height: '100%',
                }}
                cover={
                  <div
                    style={{
                      height: '200px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      alt="校赛封面"
                      src={schoolcomp2025}
                      style={{
                        width: '100%',
                        objectFit: 'cover',
                        height: '100%',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#8c8c8c',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      未开放
                    </div>
                  </div>
                }
              >
                <div style={{ padding: '8px 8px 16px' }}>
                  <Title level={4} style={{ marginBottom: '8px' }}>
                    2025年福州大学服务外包与软件设计校赛
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                    <div>时间：2025年3月15日 - 2025年4月9日</div>
                    <div>地点：福州大学</div>
                  </Paragraph>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: '20px' }}
                  >
                    参与校内最具影响力的软件设计赛事，展示你的创意和技术实力，优胜者将代表学校参加全国大赛！
                  </Paragraph>
                  <div style={{ textAlign: 'right' }}>
                    <Button type="primary" disabled size="middle">
                      即将开始
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>

            {/* 纳新活动卡片 */}
            <Col xs={24} md={12} lg={10}>
              <Card
                className="event-card"
                bordered={false}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                  height: '100%',
                }}
                cover={
                  <div
                    style={{
                      height: '200px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      alt="纳新封面"
                      src={recruit}
                      style={{
                        width: '100%',
                        objectFit: 'cover',
                        height: '100%',
                        filter: 'grayscale(0.4)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#ff4d4f',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      进行中
                    </div>
                  </div>
                }
              >
                <div style={{ padding: '8px 8px 16px' }}>
                  <Title level={4} style={{ marginBottom: '8px' }}>
                    2025年服务外包与软件设计实验室春季纳新
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                    <div>时间：2025年3月9日 - 2025年3月14日</div>
                    <div>地点：福州大学</div>
                  </Paragraph>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: '20px' }}
                  >
                    加入我们的团队，提升技术能力，参与各类比赛，结交志同道合的伙伴！我们期待着你的加入！
                  </Paragraph>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      type="primary"
                      onClick={() => navigate(RoutePath.Recruit)}
                      size="middle"
                    >
                      立即参加
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 底部的查看更多按钮 */}
          {/* <div style={{ textAlign: 'center', marginTop: '32px' }}>
    <Button 
      type="default"
      icon={<ArrowRightOutlined />}
      size="large"
      className="px-8"
    >
      查看全部公告
    </Button>
  </div> */}
        </section>
      </ConfigProvider>
    </>
  )
})

export default HomePage
