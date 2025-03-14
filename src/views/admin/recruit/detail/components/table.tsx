import {
  Card,
  Table,
  TableColumnType,
  Typography,
  Modal,
  message,
  Button,
} from 'antd'
import React, { useState } from 'react'
import {
  useRecruitDetailInfoList,
  useRecruitDetailListEvent,
  useRecruitDetailListStore,
} from '../context'
import { useRecruitDetailColumns } from '../columns'
import { useSearchTable } from '@/hooks/useSearchTable'
import type { TableColumnsType, TableProps } from 'antd'
import { fetchAdminRecruitFile } from '@/apis'

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection']

const { Link } = Typography

type props = {
  taskId: any
}

export const AdminRecruitDetailListTable = React.memo<props>(({ taskId }) => {
  const loadList = useRecruitDetailInfoList()
  const columns = useRecruitDetailColumns()
  const { openSend } = useRecruitDetailListEvent()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const hasSelected = selectedRowKeys.length > 0
  const { tableProps, paginationProps } = useSearchTable(
    useRecruitDetailListStore,
    loadList,
  )

  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null)
  const [isPdfModalVisible, setIsPdfModalVisible] = React.useState(false)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const handleCancel = () => {
    setSelectedRowKeys([])
  }

  const handleViewFile = async (id: any) => {
    const res = await fetchAdminRecruitFile(Number(id), Number(taskId))
    if (res?.data) {
      setPdfUrl(res.data) // 存储 PDF 文件的 URL
    } else {
      message.error('获取简历失败')
    }
  }

  const handleClosePdfModal = () => {
    setIsPdfModalVisible(false)
    setPdfUrl(null) // 关闭模态框时清空 PDF URL
  }

  const tableColumns: TableColumnType<any>[] = React.useMemo(() => {
    const cols: any[] = [
      ...columns,
      {
        title: '简历',
        width: 100,
        render: (col: any, item: any, index: any) => {
          return (
            <Link
              onClick={() => {
                handleViewFile(item.userId) // 获取 PDF 文件的 URL
                setIsPdfModalVisible(true) // 打开模态框
              }}
            >
              查看
            </Link>
          )
        },
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (col: any, item: any, index: any) => {
          return <Link onClick={() => openSend(item)}>发送邮件</Link>
        },
      },
    ]
    return cols
  }, [columns, openSend])

  return (
    <Card>
      <div className="bg-[#fafafa] mb-2 p-2 flex">
        <p className="my-auto ml-4 font-normal text-sm text-slate-400">
          {hasSelected ? `选中 ${selectedRowKeys.length} 条数据` : null}
        </p>
        <div className="ml-auto space-x-3 mr-2">
          <Button
            type="primary"
            disabled={!hasSelected}
            onClick={() => openSend(selectedRowKeys)}
          >
            批量发送
          </Button>
          <Link disabled={!hasSelected} onClick={handleCancel}>
            取消选择
          </Link>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        rowKey="userId"
        pagination={paginationProps}
        {...tableProps}
        columns={tableColumns}
      />
      <Modal
        title="简历预览"
        open={isPdfModalVisible}
        onCancel={handleClosePdfModal}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
    </Card>
  )
})

export default AdminRecruitDetailListTable
