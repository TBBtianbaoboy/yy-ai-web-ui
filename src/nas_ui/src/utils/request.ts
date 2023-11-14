import { message as messageInstance, notification } from 'antd'
import type { IconType } from 'antd/lib/notification'
import fetch from 'isomorphic-fetch'
import type { Key } from 'path-to-regexp'
import pathToRegexp from 'path-to-regexp'
import { stringify } from 'qs'
import { history } from 'umi'

import { isEmptyObject } from '@/utils/common'
import { ILLEGAL_RES, LOGIN_TOKEN } from '@/utils/constant'
interface IApiResponse {
  code: number
  message: string
  data?: any
  error?: string
}

const codeMessage: { [v: string]: any } = {
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

// const logout = () => {
//   localStorage.removeItem(MS_LOGIN_TOKEN)
//   history.push('/login')
// }

export const logoutCallback = () => {
  localStorage.removeItem(LOGIN_TOKEN)
  history.push('/login')
}

const checkStatus = (response: Response) => {
  
  const { status, statusText } = response
  if (status >= 200 && status < 300) {
    return response
  }

  const errorText = codeMessage[status] || statusText
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
  const error = new Error(errorText)
  error.name = `${status} \n ${response}`
  throw error
}

/**
 * 检查 api 接口的返回结果。
 * 若返回成功（ok: true），根据 data 的值，包装一层后返回 data；
 * 若不成功（ok: false），根据请求里的 errorType 字段，给出对应的错误类型提示，并返回 null；
 * 若 data 值为 “未登录”，直接退出登录。
 * @param errorType 错误类型
 * @param response api返回的数据
 */
const checkCode = (errorType: IconType = 'error', response: IApiResponse) => {
  const { code, message, data, error } = response
  if (typeof response === 'string') {
    return response
  }
  // 401 token过期
  // 403 权限不足
  // 405 其他错误
  if (code === 100) {
    notification.error({
      message: `请求错误`,
      description: error
    })

    const err = new Error(error)
    err.name = `${errorType} \n ${response}`
    throw err
  }

  // 独立处理license过期的问题
  if (code === 101) {
    // 过期跳转到license编辑页面
    history.push('/setting/info/license')

    // 多个接口都报错需要key来唯一化错误提示
    messageInstance.warn({ content: `license已经失效，请填写新的license`, key: 'xiesi' })

    // return MS_ILLEGAL_RES
    throw new Error(error)
  }

  if (code === 302) {
    logoutCallback()
    return ILLEGAL_RES
  }
  if (code === 200) {
    return data
  }

  if (code === 401 || message === '未登录') {
    logoutCallback()
    return ILLEGAL_RES
  }

  notification[errorType]({
    message: '提示',
    description: error || data || message
  })
  // throw new Error(message)
  // return MS_ILLEGAL_RES
  // throw new Error(message)
}

/** 处理列表接口没数据时返回null的情况 */
const handleListNull = (res: any) => {
  const tempData = res.data ?? {}
  const tempRes = { ...res }

  if ('results' in tempData && 'count' in tempData && tempData.results === null) {
    return {
      ...tempRes,
      data: {
        ...tempData,
        results: []
      }
    }
  }
  return res
}

/**
 * 请求信息
 * @param  {string} 请求接口地址
 * @param  {RequestInit} options 请求体
 * @param  {string} 处理错误的类型 error warning info
 * @return Promise<any> 包括 data 或者 err 的对象
 */
const request: <T>(
  url: string,
  options: RequestInit | { params: { [key: string]: any } },
  errorType?: IconType
) => Promise<T> = (url, options, errorType = 'error') => {
  const realUrl =  '/api' + url 
  
  const newOptions: any = {
    credentials: 'include',
    ...options
  }
  const { method = 'GET' } = options
  let compileUrl = ''

  const token = localStorage.getItem(LOGIN_TOKEN)

  newOptions.headers = {
    Authorization: `nas ${token}`,
    ...newOptions.headers
  }

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    const match = pathToRegexp.parse(realUrl)

    if (newOptions.body instanceof FormData) {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      }
      for (const item of match) {
        if (typeof item === 'object' && (<Key>item).name) {
          const val = newOptions.body.get((<Key>item).name)
          compileUrl += `/${val}`
        } else {
          compileUrl += item
        }
      }
    } else {
      compileUrl = pathToRegexp.compile(realUrl)(newOptions.body)
      for (const item of match) {
        if (typeof item === 'object' && (<Key>item).name) {
          delete newOptions.body[(<Key>item).name]
        }
      }
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      }
      newOptions.body = options.headers ? newOptions.body : JSON.stringify(newOptions.body)
    }
  } else if (method === 'GET') {
    const { params = {} } = newOptions
    const shallowData = { ...params }
    const match = pathToRegexp.parse(realUrl)
    // query参数中 : 导致解析失败
    const [host, ...query] = realUrl.split('?')
    compileUrl =
      pathToRegexp.compile(host)(params) + (query.length !== 0 ? `?${query.join('?')}` : '')
    for (const item of match) {
      if (typeof item === 'object' && (<Key>item).name) {
        delete shallowData[(<Key>item).name]
      }
    }
    // shallowData.timestamp = new Date().getTime()

    compileUrl = isEmptyObject(shallowData)
      ? compileUrl
      : `${compileUrl}?${stringify(shallowData, { arrayFormat: 'comma' })}`
  }

  return fetch(compileUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (response!.status === 204) {
        return response!.text()
      }
      return response!.json()
    })
    .then(handleListNull)
    .then(checkCode.bind(null, errorType))
    .catch(e => {
      if (e.name === 'TypeError') {
        notification.error({
          message: '出错了',
          description: '接口出现未知错误，请联系管理员！'
        })
      }
      return Promise.reject(e)
    })
}

export default request
