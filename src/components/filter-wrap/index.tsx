import { Button, Form, FormInstance, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import useRefCallback from '@/hooks/useRefCallback'
import React, { useEffect, useState } from 'react'

type FilterWrapProps = {
  /**存放筛选条件的表单 */
  form: FormInstance
  /** 初始值 */
  initialValues?: Record<string, any>
  direction?: 'vertical' | 'horizontal'
  className?: string
  style?: React.CSSProperties
  onSearch?: (params: Record<string, any>) => Promise<any>
  /**特殊按钮 */
  NewButtons?: React.MemoExoticComponent<() => JSX.Element>
}

/**通用筛选器封装 */
export const FilterWrap: React.FC<React.PropsWithChildren<FilterWrapProps>> =
  React.memo((props) => {
    const {
      form,
      initialValues,
      children,
      direction,
      className,
      style,
      onSearch,
      NewButtons,
    } = props

    const [loading, setLoading] = useState(false)

    const handleSearch = useRefCallback(async () => {
      const params = form?.getFieldsValue()
      setLoading(true)
      await onSearch?.(params)
      setLoading(false)
    })

    const handleReset = useRefCallback(() => {
      form.resetFields()
      form.setFieldsValue(initialValues)
      return handleSearch()
    })
    // 获取初始table数据
    useEffect(() => {
      handleSearch()
    }, [])
    return (
      <div
        className="w-full flex flex-wrap flex-row p-auto border round-md bg-[#fafafa] items-center py-3 space-y-2"
        style={style}
      >
        <div className="flex m-auto">
          <Form form={form} className="flex flex-row">
            {children}
          </Form>
        </div>
        <div className="flex flex-row ml-auto">
          <Space>
            {NewButtons && <NewButtons />}
            <Button
              onClick={handleSearch}
              loading={loading}
              icon={<SearchOutlined />}
            >
              查询
            </Button>
            <Button
              onClick={handleReset}
              loading={loading}
              icon={<DeleteOutlined />}
            >
              清空
            </Button>
          </Space>
        </div>
      </div>
    )
  })

export default FilterWrap
