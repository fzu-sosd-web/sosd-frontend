import * as React from 'react'
import { UseBoundStore, StoreApi } from 'zustand'
import { CommonSearchServiceReturn, CommonSearchStore } from '../types'
import { PaginationProps, TablePaginationConfig, TableProps } from 'antd'
import { AnyObject } from 'antd/es/_util/type'

export const useSearchTable = <Q = any, T = any>(
  store: UseBoundStore<StoreApi<CommonSearchStore<Q, T>>>,
  loadList: CommonSearchServiceReturn<Q, T>,
) => {
  const search = store((state) => state.search)
  const data = store((state) => state.data)
  const loading = store((state) => state.loading)
  const setData = store((state) => state.setData)
  const tableProps = React.useMemo(() => {
    const props: TableProps = {
      loading,
      dataSource: (data.rows as any) || [],
      bordered: true,
      onChange(pagination, filters, sorter, extra) {
        console.log(pagination, sorter)
        setData({ total: 0, rows: [] })
        loadList({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      },
    }
    return props
  }, [data.rows, loadList, loading, search])

  const paginationProps = React.useMemo(() => {
    const props: TablePaginationConfig = {
      position: ['bottomRight'],
      current: search?.page || 1,
      // pageSize: 10,
      total: data?.total || 0,
      showTotal: (total, range) => `共有${total}条数据`,
      showSizeChanger: true,
    }
    return props
  }, [data?.total, search?.page, search?.pageSize])
  return {
    tableProps,
    paginationProps,
  }
}
