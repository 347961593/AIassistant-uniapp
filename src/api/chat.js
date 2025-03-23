import { http } from '@/utils/request'

// 发送消息
export const sendMessage = (data) => {
  return http.post('/api/chat/send', data)
}

// 获取历史记录
export const getHistory = (params) => {
  return http.get('/api/chat/history', { params })
}

// 删除历史记录
export const deleteHistory = (id) => {
  return http.delete(`/api/chat/history/${id}`)
}

// 获取可用模型列表
export const getModels = () => {
  return http.get('/api/models')
}