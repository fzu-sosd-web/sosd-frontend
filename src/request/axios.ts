import Axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  isCancel,
} from 'axios'
import { IResult, RequestInstance, RequestOption } from '@/types'
import { BASE_URL } from '@/constant/web'
const TIME_OUT = 30000

const defaultOnRequest = (config: InternalAxiosRequestConfig) => config

const defaultOnResponse = async (response: AxiosResponse): Promise<any> => {
  const res: IResult = {
    success: response.status === 200,
    _header: response.headers,
    ...response.data,
  }

  return Promise.resolve(res)
}

const defaultOnResponseError = async (error: any): Promise<any> => {
  if (isCancel(error)) {
    return new Promise(() => {})
  }

  const { data } = error?.response || {}

  return {
    success: false,
    data,
    message: data?.message ?? '系统错误',
  } as IResult
}

export const createRequest = (options: RequestOption) => {
  const { baseURL = BASE_URL, timeout = TIME_OUT } = options || {}
  const onRequest = options?.onRequest ?? defaultOnRequest
  const onResponse = options?.onResponse ?? defaultOnResponse
  const onResponseError = options?.onResponseError ?? defaultOnResponseError

  const request = Axios.create({
    baseURL,
    timeout,
  }) as RequestInstance

  request.interceptors.request.use(onRequest, (err: unknown) => {
    console.error('request error', err)
    return new Promise(() => {})
  })

  request.interceptors.response.use(onResponse, onResponseError)
  return request
}
