import useRefCallback from '@/hooks/useRefCallback'
import { createSearchSlice } from '@/slice/search'
import { fetchAdminRecruitList } from '@/apis'
import { useRequest } from 'ahooks'
import { create } from 'zustand'
import { useEventBus } from '@/hooks/useEventBus'
import { AdminRecruitEvent } from '@/constant/event/recruit'

/**纳新活动列表store */
export const useRecruitListStore = create<any>((set, get) => {
  const store = createSearchSlice<any, any>(set, get)
  return { ...store }
})

export const useRecruitInfoList = () => {
  const loadData: any = useRecruitListStore((state) => state.loadData)

  const { runAsync } = useRequest(fetchAdminRecruitList, {
    manual: true,
  })

  return useRefCallback(loadData(runAsync))
}

export const useRecruitListSearch = () => {
  const loading = useRecruitListStore((state) => state.loading)
  const search = useRecruitListStore((state) => state.search)
  const loadList = useRecruitInfoList()
  return {
    loading,
    search,
    loadList,
  }
}

export const useRecruitListEvent = () => {
  const { trigger } = useEventBus(AdminRecruitEvent.Detail)

  /**打开活动详情弹窗 */
  const openDetail = useRefCallback((Recruit_id: string) => {
    trigger(Recruit_id)
  })

  const { trigger: openChangeTrigger } = useEventBus(AdminRecruitEvent.Change)

  /**打开修改活动信息弹窗 */
  const openChange = useRefCallback((item: any) => {
    openChangeTrigger(item)
  })

  const { trigger: openCreateTrigger } = useEventBus(AdminRecruitEvent.Create)

  /**打开创建活动弹窗 */
  const openCreate = useRefCallback(() => {
    openCreateTrigger()
  })

  const { trigger: openInterviewTrigger } = useEventBus(
    AdminRecruitEvent.InterviewDetail,
  )
  /**打开面试官详情弹窗 */
  const openInterview = useRefCallback((id: string) => {
    openInterviewTrigger(id)
  })

  return { openDetail, openChange, openInterview, openCreate }
}
