import { notification } from 'antd'
import type { Axios, AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { history } from 'umi'

// import { MS_LOGIN_TOKEN } from './constant'
const MS_LOGIN_TOKEN = '/api'
type LocalAxiosRequestConfig = AxiosRequestConfig & { customCatch: boolean }

export interface LocalAxiosInstance extends Axios {
  (config: LocalAxiosRequestConfig): AxiosPromise
  (url: string, config?: LocalAxiosRequestConfig): AxiosPromise
}
const getToken = () => localStorage.getItem(MS_LOGIN_TOKEN)

const logoutCallback = () => {
  localStorage.removeItem(MS_LOGIN_TOKEN)
  history.push('/login')
}

const codeMessage:any = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功',
  400: '请求有错误，服务器没有进行新建或修改数据的操作',
  401: '用户没有权限',
  403: '用户得到授权，但是访问是被禁止的',
  404: '请求地址不存在',
  406: '请求的格式不可得',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}

const checkStatus = (error: AxiosError) => {
  const { response } = error
  const { status, statusText } = response ?? {}

  const errorText = codeMessage[status!] || statusText
  if (status === 401) {
    logoutCallback()
  } else {
    if (status !== 410) {
      notification.error({
        message: `请求错误 ${status}`,
        description: errorText
      })
    }
  }
  throw error
}

const axiosInstance: LocalAxiosInstance = axios.create({
  withCredentials: true
})

// /**
//  * 请求拦截器
//  * 需要在拦截器中在请求头中添加token，否则每次会是项目初始化时的token
//  */
axiosInstance.interceptors.request.use(config => {
  config.headers ??= {}
  config.headers.Authorization = `bearer ${getToken()}`

  return config
})

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  res => {
    return res.data
  },
  (err: AxiosError) => {
    const { customCatch } = err.config as LocalAxiosRequestConfig

    if (customCatch) {
      // 响应错误做些什么（此处错误，到达后端后返回）
      return Promise.reject(err)
    }

    return checkStatus(err)
  }
)

/**
 *
 * @param url
 * @param options
 * @param customCatch 自定义错误处理，不会进入统一的错误处理
 * @returns
 */
const request = async <T, U = any>(
  url: string,
  options?: AxiosRequestConfig<U>,
  customCatch = false
) => {
  const { method = 'get', ...rest } = options ?? {}

  return (
    await (axiosInstance({
      method: method as AxiosRequestConfig['method'],
      url,
      ...rest,
      customCatch
    }) as AxiosPromise<T>)
  ).data
}

export default request
