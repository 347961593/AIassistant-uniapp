import { getToken } from './auth'

// 基础配置
const baseConfig = {
  baseUrl: '',
  timeout: 10000,
  header: {
    "Authorization": "Bearer pat_9L4xAQuWvK5TCQdETBgYrfDeY0GB6lDSPXlE9nssfKkjSHwUya95qlv3soPgmuVT",
    'Content-Type': 'application/json'
  }
}

// 请求拦截器
const requestInterceptor = (config) => {
  const token = getToken()
  if (token) {
    config.header['Authorization'] = `Bearer ${token}`
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response

  // 请求成功
  if (statusCode === 200) {
    return data
  }

  // 处理错误
  const error = new Error(data.message || '请求失败')
  error.response = response
  return Promise.reject(error)
}

// 统一请求方法
const request = (options) => {
  const config = {
    ...baseConfig,
    ...options,
    header: {
      ...baseConfig.header,
      ...options.header
    }
  }

  // 应用请求拦截器
  const interceptedConfig = requestInterceptor(config)

  return new Promise((resolve, reject) => {
    uni.request({
      ...interceptedConfig,
      success: (response) => {
        try {
          const result = responseInterceptor(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

// 封装常用请求方法
export const http = {
  get: (url, params = {}, options = {}) => {
    return request({
      url,
      method: 'GET',
      data: params,
      ...options
    })
  },

  post: (url, data = {}, options = {}) => {
    return request({
      url,
      method: 'POST',
      data,
      ...options
    })
  },

  put: (url, data = {}, options = {}) => {
    return request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  },

  delete: (url, data = {}, options = {}) => {
    return request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
} 