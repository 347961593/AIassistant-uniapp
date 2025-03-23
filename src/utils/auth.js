const TOKEN_KEY = 'access_token'

export const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY)
}

export const setToken = (token) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

export const isAuthenticated = () => {
  return !!getToken()
} 