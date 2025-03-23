import { http } from '@/utils/request'

// 用户登录
export const login = (data) => {
  return http.post('/api/user/login', data)
}

// 用户注册
export const register = (data) => {
  return http.post('/api/user/register', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return http.get('/api/user/info')
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return http.put('/api/user/info', data)
} 