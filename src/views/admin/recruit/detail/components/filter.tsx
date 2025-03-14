import FilterWrap from '@/components/filter-wrap'
import { Button, Form, Select, Space } from 'antd'
import React from 'react'
import {
  useRecruitDetailListEvent,
  useRecruitDetailListSearch,
} from '../context'

type props = {
  id?: any
}

export const AdminRecruitDetailListFilter = React.memo<props>(({ id }: any) => {
  const [form] = Form.useForm()
  const Item = Form.Item
  const { search, loadList } = useRecruitDetailListSearch()
  const handleSearch = (params: any) => {
    const val = form.getFieldsValue()
    return loadList({
      page: 1,
      pageSize: 10,
      id: Number(id),
      query: { ...val, ...params },
    })
  }

  return (
    <FilterWrap form={form as any} onSearch={handleSearch}>
      <Space size={30}>
        <Item label="一志愿" name="groupName" className="w-60 my-auto">
          <Select
            options={[
              { label: 'web组', value: '1' },
              { label: '移动组', value: '4' },
              { label: 'ai组', value: '2' },
              { label: '设计组', value: '3' },
            ]}
            allowClear
            onChange={() => handleSearch({})}
            onClear={() => handleSearch({})}
          />
        </Item>
      </Space>
    </FilterWrap>
  )
})

export default AdminRecruitDetailListFilter
