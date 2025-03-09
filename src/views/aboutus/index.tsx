// views/AboutUsPage.tsx
import React, { useState, useEffect } from 'react';
import MemberSection from '@/views/aboutus/MemberSection.tsx';

// 教师数据
const teachers = [
  {
    name: '刘宪玲',
    photo: require('@/assets/aboutUs/liu-xianling.png'),
    role: '博士，实验师',
    description: '计算机科学与技术'
  },
  {
    name: '孙岚',
    photo: require('@/assets/aboutUs/sun-lan.png'),
    role: '硕士，副教授',
    description: '计算机科学与技术'
  },
  {
    name: '傅仰耿',
    photo: require('@/assets/aboutUs/fu-yanggeng.png'),
    role: '博士，教授',
    description: '计算机科学与技术'
  },
  {
    name: '王一蕾',
    photo: require('@/assets/aboutUs/wang-yilei.png'),
    role: '博士，副教授',
    description: '计算机科学与技术'
  }
];

// 实验室成员数据
const labMembers = {
  webGroup: [
    {
      name: '叶飞扬',
      photo: require('@/assets/aboutUs/ye-feiyang.png'),
      role: '2022级硕士',
      description: '计算机应用技术'
    },
    {
      name: '陈宏侨',
      photo: require('@/assets/aboutUs/chen-hongqiao.png'),
      role: '2020级本科',
      description: '计算机科学与技术'
    },
    {
      name: '魏知乐',
      photo: require('@/assets/aboutUs/wei-zhile.png'),
      role: '2021级本科',
      description: '计算机科学与技术'
    },
    {
      name: '赖沛超',
      photo: require('@/assets/aboutUs/lai-peichao.png'),
      role: '2015级硕士',
      description: '计算机科学与技术'
    }
  ],
  mobileGroup: [
    // {
    //   name: '孙金恒',
    //   photo: require('@/assets/aboutUs/sun-jinheng.png'),
    //   role: '2024级本科',
    //   description: '软件工程（中外合作）'
    // },
    {
      name: '崔修起',
      photo: require('@/assets/aboutUs/cui-xiuqi.png'),
      role: '2021级本科',
      description: '计算机科学与技术'
    }
  ],

  uiGroup: [
    {
      name: '张程越',
      photo: require('@/assets/aboutUs/zhang-chenyue.png'),
      role: '2021级本科',
      description: '计算机科学与技术'
    },
    {
      name: '陈诗雪',
      photo: require('@/assets/aboutUs/chen-shixue.png'),
      role: '2021级本科',
      description: '计算机科学与技术'
    },
    {
      name: '林毅',
      photo: require('@/assets/aboutUs/lin-yi.png'),
      role: '2021级本科',
      description: '计算机科学与技术'
    },
  ]
};

const AboutUsPage: React.FC = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const banners = [
    {
      image: require('@/assets/aboutUs/banner1.png'),
      label: "日常状态",
      title: "Dream House",
      subtitle: "创新实践日常，打造理想技术之家"
    },
    {
      image: require('../../assets/aboutUs/banner2.png'),
      label: "项目成果",
      title: "Innovation Showcase",
      subtitle: "探索前沿技术，展现团队创新成果"
    },
    {
      image: require('../../assets/aboutUs/banner3.png'),
      label: "团队风采",
      title: "Team Spirit",
      subtitle: "凝聚团队力量，共创科技未来"
    }
  ];
  // 自动轮播逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % banners.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // 处理导航点点击
  const handleDotClick = (index: number) => {
    setActiveBanner(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <header className="pt-12 pb-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">了解团队</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-600">
              ACM协同创新团队
            </h2>
            <p className="text-xl text-gray-600 md:text-2xl font-medium">
              协同育人 ● 五位一体 ● 合作创新
            </p>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 教师介绍 */}
          <MemberSection
            title="教师介绍"
            members={teachers}
            avatarSize="lg"
            showDivider
            columns={2}
            className="mb-16"
          />

          {/* 实验室成员 */}
          <section className="space-y-16">
            <MemberSection
              title="Web组"
              members={labMembers.webGroup}
              avatarSize="lg"
              columns={{ base: 1, md: 2, lg: 3 }}
            />

            <MemberSection
              title="移动组"
              members={labMembers.mobileGroup}
              avatarSize="lg"
              columns={{ base: 1, md: 2 }}
            />

            <MemberSection
              title="设计组"
              members={labMembers.uiGroup}
              avatarSize="lg"
              columns={{ base: 1, md: 2, lg: 3 }}
            />
          </section>

          {/* 三张Banner轮播区 */}
          <div className="relative h-[480px] md:h-[600px] rounded-2xl overflow-hidden shadow-xl">
            {/* Banner列表 */}
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeBanner === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                <div className="relative z-10 h-full flex items-center p-8">
                  <div className="max-w-2xl space-y-6 text-white">
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {banner.label}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      {banner.title.split(' ')[0]}
                      <span className="block mt-2 text-blue-300">
                        {banner.title.split(' ')[1]}
                      </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* 导航按钮 */}
            <div className="absolute bottom-8 right-8 z-20 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeBanner === index
                      ? 'bg-blue-400'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;