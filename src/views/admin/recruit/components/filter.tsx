import FilterWrap from '@/components/filter-wrap'
import { Button, Form } from 'antd'
import React from 'react'
import { useRecruitListEvent, useRecruitListSearch } from '../context'

export const RecruitListFilter = React.memo(() => {
  const [form] = Form.useForm()
  const Item = Form.Item
  const { search, loadList } = useRecruitListSearch()
  const { openCreate } = useRecruitListEvent()
  const handleSearch = (params: any) => {
    const val = form.getFieldsValue()
    return loadList({
      page: 1,
      pageSize: 10,
      query: { ...val, ...params },
    })
  }
  const NewButtons = React.memo(() => {
    return (
      <div>
        <Button onClick={() => openCreate()}>创建新纳新活动</Button>
      </div>
    )
  })

  return (
    <FilterWrap
      form={form as any}
      NewButtons={NewButtons}
      onSearch={handleSearch}
    ></FilterWrap>
  )
})
