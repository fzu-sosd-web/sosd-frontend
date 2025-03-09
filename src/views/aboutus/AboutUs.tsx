import React from 'react';

// 教师信息接口
interface Teacher {
  name: string;
  degree: string;
  position: string;
  department: string;
}

// 教师数据
const teachers: Teacher[] = [
  { name: '刘宪玲', degree: '博士', position: '实验师', department: '计算机科学与技术' },
  { name: '孙岚', degree: '硕士', position: '副教授', department: '计算机科学与技术' },
  { name: '傅仰耿', degree: '博士', position: '教授', department: '计算机科学与技术' },
  { name: '王一蕾', degree: '博士', position: '副教授', department: '计算机科学与技术' },
];

const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 头部 */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">了解团队</h1>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">ACM协同创新团队</h2>
          <p className="text-gray-600">协同育人·五位一体·合作创新</p>
        </div>
      </header>

      {/* 教师介绍 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">教师介绍</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{teacher.name}</h3>
              <p className="text-gray-600 mb-1">{teacher.degree}，{teacher.position}</p>
              <p className="text-gray-500 text-sm">{teacher.department}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 服务外包实验室 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-3">服务外包与软件设计实验室</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="font-medium text-gray-700">正式队员</span>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;