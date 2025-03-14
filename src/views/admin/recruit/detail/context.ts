import useRefCallback from '@/hooks/useRefCallback'
import { createSearchSlice } from '@/slice/search'
import { fetchAdminRecruitDetailList } from '@/apis'
import { useRequest } from 'ahooks'
import { create } from 'zustand'
import { useEventBus } from '@/hooks/useEventBus'
import { AdminRecruitDetailEvent } from '@/constant/event/recruit'

/**纳新活动详情列表store */
export const useRecruitDetailListStore = create<any>((set, get) => {
  const store = createSearchSlice<any, any>(set, get)
  return { ...store }
})

export const useRecruitDetailInfoList = () => {
  const loadData: any = useRecruitDetailListStore((state) => state.loadData)

  const { runAsync } = useRequest(fetchAdminRecruitDetailList, {
    manual: true,
  })

  return useRefCallback(loadData(runAsync))
}

export const useRecruitDetailListSearch = () => {
  const loading = useRecruitDetailListStore((state) => state.loading)
  const search = useRecruitDetailListStore((state) => state.search)
  const loadList = useRecruitDetailInfoList()
  return {
    loading,
    search,
    loadList,
  }
}

export const useRecruitDetailListEvent = () => {
  const { trigger } = useEventBus(AdminRecruitDetailEvent.Detail)

  /**打开学生详情弹窗 */
  const openDetail = useRefCallback((item: any) => {
    trigger(item)
  })

  const { trigger: openSendTrigger } = useEventBus(AdminRecruitDetailEvent.Send)
  /**打开发送邮件弹窗 */
  const openSend = useRefCallback((id: any) => {
    openSendTrigger(id)
  })

  const { trigger: openFirstInterviewTrigger } = useEventBus(
    AdminRecruitDetailEvent.FirstInterviewDetail,
  )
  /**打开一面详情弹窗 */
  const openFirstInterview = useRefCallback((id: string) => {
    openFirstInterviewTrigger(id)
  })

  const { trigger: openSecondInterviewTrigger } = useEventBus(
    AdminRecruitDetailEvent.SecondInterviewDetail,
  )
  /**打开二面详情弹窗 */
  const openSecondInterview = useRefCallback((id: string) => {
    openSecondInterviewTrigger(id)
  })

  return { openDetail, openFirstInterview, openSecondInterview, openSend }
}
