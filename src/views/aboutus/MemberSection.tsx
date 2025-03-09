// components/MemberSection.tsx
import React from 'react';
import classNames from 'classnames';

export interface Member {
  name: string;
  role: string;
  description: string;
  department?: string;
  photo: string;
}

interface MemberSectionProps {
  title: string;
  members: Member[];
  avatarSize?: 'sm' | 'md' | 'lg';
  showDivider?: boolean;
  columns?: number | { base: number; md?: number; lg?: number };
  className?: string;
}

const defaultAvatar = require('@/assets/aboutUs/default-avatar.png');

const MemberSection: React.FC<MemberSectionProps> = ({
                                                       title,
                                                       members,
                                                       avatarSize = 'md',
                                                       showDivider = false,
                                                       columns = 2,
                                                       className
                                                     }) => {
  // 响应式列数处理
  const getGridClasses = () => {
    if (typeof columns === 'object') {
      return [
        `grid-cols-${columns.base}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`
      ].filter(Boolean).join(' ');
    }
    return `grid-cols-1 md:grid-cols-${columns}`;
  };

  // 头像尺寸配置
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  return (
    <section className={classNames('mb-12', className)}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-blue-500 pl-4">
          {title}
          {showDivider && (
            <div className="mt-3 w-16 h-1 bg-blue-500 rounded-full" />
          )}
        </h2>

        <div className={classNames('grid gap-6', getGridClasses())}>
          {members.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex items-start space-x-4">
                {/* 头像容器 */}
                <div className="flex-shrink-0">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className={classNames(
                      sizeClasses[avatarSize],
                      'rounded-full object-cover border-4 border-blue-50'
                    )}
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                </div>

                {/* 成员信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-base text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <div className="text-sm text-gray-600">
                    <p className="truncate">{member.description}</p>
                    {member.department && (
                      <p className="text-gray-500 mt-1">{member.department}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberSection;