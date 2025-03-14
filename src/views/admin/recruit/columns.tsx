import React from 'react'
import { useRecruitListEvent } from './context'
import { TableColumnProps, TableColumnType, Typography } from 'antd'
import { RoutePath } from '@/constant/routes'
import { Navigate, useNavigate } from 'react-router-dom'

const { Link } = Typography

export const useRecruitColumns = () => {
  const { openInterview, openChange } = useRecruitListEvent()
  const navigate = useNavigate()
  const cols = React.useMemo(() => {
    return [
      {
        title: '活动名称',
        dataIndex: 'name',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return (
            <Link
              onClick={() => navigate(`${RoutePath.AdminRecruit}/${item.id}`)}
            >
              {item.name}
            </Link>
          )
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 200,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        width: 200,
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        width: 200,
      },
      {
        title: '面试官',
        dataIndex: 'interviewer',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return (
            <Link onClick={() => openInterview(item.interviewer)}>
              查看详情
            </Link>
          )
        },
      },
    ] as any[]
  }, [])
  return cols
}
