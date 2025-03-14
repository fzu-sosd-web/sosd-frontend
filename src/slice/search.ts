import { produce } from 'immer'
import { cloneDeep } from 'lodash-es'
import { message } from 'antd'
import {
  CommonSearchMethod,
  CommonSearchService,
  CommonSearchState,
  CommonSearchStore,
  SearchQuery,
} from '../types'

const DEFAULT_RESULT = { rows: [], total: 0 }
const DEFAULT_SEARCH = { page: 1, page_size: 20, query: {} }

export const createSearchSlice = <Q, T>(
  set: (partial: any, replace?: false | undefined) => void,
  get: () => any,
): CommonSearchStore<Q, T> => {
  const store: CommonSearchState<Q, T> = {
    loading: false,
    data: { rows: null, total: 0 },
    search: DEFAULT_SEARCH,
  }

  const setSearch: CommonSearchMethod<Q, T>['setSearch'] = (_search) => {
    set(
      produce((state: CommonSearchState<Q, T>) => {
        state.search = _search
      }),
    )
  }

  const setData: CommonSearchMethod<Q, T>['setData'] = (_data) => {
    set(
      produce((state: CommonSearchState<Q, T>) => {
        state.data = _data
      }),
    )
  }

  const loadData: CommonSearchMethod<Q, T>['loadData'] =
    (service: CommonSearchService<Q, T>) => async (_search) => {
      const search: SearchQuery<Q> = cloneDeep(get().search)
      Object.assign(search, _search)
      set(
        produce((state: CommonSearchState<Q, T>) => {
          state.loading = true
        }),
      )

      const res = await service(search)

      if (!res?.success) {
        message.error(res?.message || '获取数据失败')
      }
      set(
        produce((state: CommonSearchState<Q, T>) => {
          state.data = res?.data || DEFAULT_RESULT
          state.loading = false
          state.search = search
        }),
      )

      return res?.data || DEFAULT_RESULT
    }

  return {
    ...store,
    loadData,
    setSearch,
    setData,
  }
}
