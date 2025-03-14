import { Card, Table, TableColumnType, Typography, Button } from 'antd'
import React, { useState } from 'react'
import {
  useRecruitInfoList,
  useRecruitListEvent,
  useRecruitListStore,
} from '../context'
import { useRecruitColumns } from '../columns'
import { useSearchTable } from '@/hooks/useSearchTable'
import type { TableColumnsType, TableProps } from 'antd'
import { fetchAdminRecruitList } from '@/apis/admin/recruit'

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection']

const { Link } = Typography

export const RecruitListTable = React.memo(() => {
  const loadList = useRecruitInfoList()
  const columns = useRecruitColumns()
  const { openChange, openInterview } = useRecruitListEvent()
  const { tableProps, paginationProps } = useSearchTable(
    useRecruitListStore,
    loadList,
  )

  const tableColumns: TableColumnType<any>[] = React.useMemo(() => {
    const cols: any[] = [
      ...columns,
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (col: any, item: any, index: any) => {
          return <Link onClick={() => openChange(item)}>修改</Link>
        },
      },
    ]
    return cols
  }, [columns, openChange])
  return (
    <Card>
      <Table
        rowKey="id"
        pagination={paginationProps}
        {...tableProps}
        columns={tableColumns}
      />
    </Card>
  )
})

export default RecruitListTable
