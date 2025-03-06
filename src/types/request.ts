import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

/** 请求返回结构通用格式 */
export interface IResult<T = any> {
  /** 是否成功 */
  success: boolean
  /** 数据 */
  data?: T
  /** 提示信息 */
  message: string
  /** 其他信息 */
  [key: string]: any
}

export type RequestOption = {
  /** 基础路径 */
  baseURL?: string
  /** 超时时间 */
  timeout?: number
  /** 请求前处理 */
  onRequest?: (
    config: InternalAxiosRequestConfig<any>,
  ) => InternalAxiosRequestConfig<any>
  /** 返回结果处理 */
  onResponse?: (response: AxiosResponse) => Promise<IResult>
  /** 返回结果错误处理 */
  onResponseError?: (error: any) => Promise<IResult>
}

/** 请求实例 */
export interface RequestInstance extends AxiosInstance {
  request<T = any, R = IResult<T>, D = any>(
    config: AxiosRequestConfig<D>,
  ): Promise<R>
  get<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  delete<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  head<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  options<T = any, R = IResult<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  post<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  put<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patch<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  postForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  putForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
  patchForm<T = any, R = IResult<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>
}

/** 通用分页查询结果 */
export type TableResult<T> = {
  total: number
  rows: T[] | null
}

/** 通用分页查询 */
export type SearchQuery<T = any> = {
  page: number
  page_size: number
  query?: T
  sort?: SearchSort
}

export type SearchSort = {
  prop: string
  order: 'desc' | 'asc'
}

/**通用查询状态管理store */
export type CommonSearchState<Q, T> = {
  data: TableResult<T>
  search: Partial<SearchQuery<Partial<Q>>>
  loading: boolean
}

export type CommonSearchMethod<Q, T> = {
  setData: (data: TableResult<T>) => void
  setSearch: (search: Partial<SearchQuery<Partial<Q>>>) => void
  loadData: (
    service: CommonSearchService<Q, T>,
  ) => CommonSearchServiceReturn<Q, T>
}

export type CommonSearchStore<Q, T> = CommonSearchState<Q, T> &
  CommonSearchMethod<Q, T>

export type CommonSearchService<Q, T> = (
  search: SearchQuery<Q>,
) => Promise<IResult<TableResult<T>>>

export type CommonSearchServiceReturn<Q, T> = (
  search?: Partial<SearchQuery<Partial<Q>>>,
) => Promise<TableResult<T>>
