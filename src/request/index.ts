import { InternalAxiosRequestConfig } from 'axios'
import { createRequest } from './axios'
import { token } from '@/utils'
import { message, Modal } from 'antd'
import { IResult } from '@/types'
import { RoutePath } from '@/constant/routes'
import { BASE_URL } from '@/constant/web'

export const ERROR_CODE_MAP: any = {
  401: '认证失败，无法访问系统资源',
  403: '当前操作没有权限',
  404: '访问资源不存在',
  default: '系统未知错误，请联系管理员',
}

export enum ResponseResultCode {
  Success = 20000,
  NotPermission = 401,
  ServerError = 500,
}

export const request = createRequest({
  baseURL: BASE_URL,
  timeout: 30000,
  // 请求前配置
  onRequest(config: InternalAxiosRequestConfig) {
    if (!config) {
      return config
    }
    if (token.getToken()) {
      config.headers.Authorization = `${token.getToken()}`
    }
    return config
  },
  onResponse: async (res) => {
    const { code } = res.data || {}
    const msg = ERROR_CODE_MAP[code] || res.data.msg || ERROR_CODE_MAP.default
    const result: IResult = {
      success: code == ResponseResultCode.Success,
      message: msg,
      ...res.data,
    }
    if (code == ResponseResultCode.NotPermission) {
      Modal.error({
        title: '系统提示',
        content: '登录状态已过期，请重新登录',
        okText: '确认',
        onOk: () => {
          window.location.href = `${RoutePath.Login}`
        },
      })
      return new Promise(() => {})
    }
    return result
  },
  onResponseError(error) {
    console.log(error)
    let msg = '网络异常'
    if (error?.request?.status == 500) {
      msg = '系统错误，请联系管理员'
    }
    if (error?.request?.status == 404) {
      msg = '接口不存在'
    }
    const res: IResult = {
      success: false,
      message: msg,
      _header: {},
    }

    return Promise.resolve(res)
  },
})
