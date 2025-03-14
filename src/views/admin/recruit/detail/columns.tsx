import React from 'react'
import { useRecruitDetailListEvent } from './context'
import { TableColumnProps, TableColumnType, Typography } from 'antd'
import { RoutePath } from '@/constant/routes'
import { Navigate, useNavigate } from 'react-router-dom'

const { Link } = Typography

export const useRecruitDetailColumns = () => {
  const { openFirstInterview, openSecondInterview, openDetail } =
    useRecruitDetailListEvent()

  const cols = React.useMemo(() => {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return <Link onClick={() => openDetail(item)}>{item.name}</Link>
        },
      },
      {
        title: '学号',
        dataIndex: 'userId',
        width: 200,
      },
      {
        title: '一志愿',
        dataIndex: 'firstChoose',
        width: 200,
      },
      {
        title: '二志愿',
        dataIndex: 'secondChoose',
        width: 200,
      },
      {
        title: '是否服从调剂',
        dataIndex: 'status',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return item.status === 1 ? '是' : '否'
        },
      },
      {
        title: '一面',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return <Link onClick={() => openFirstInterview(item)}>查看详情</Link>
        },
      },
      {
        title: '二面',
        width: 200,
        render: (col: any, item: any, index: any) => {
          return <Link onClick={() => openSecondInterview(item)}>查看详情</Link>
        },
      },
    ] as any[]
  }, [])
  return cols
}
