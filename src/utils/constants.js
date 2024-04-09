let apiRoot = ''
//console.log('import.meta.env: ', import.meta.env)
//console.log('process.env: ', process.env)
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://draganddropapi.onrender.com'
}
//console.log('🚀 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot
//export const API_ROOT = 'https://draganddropapi.onrender.com'
export const path = {
  HOME: '/',
  LOGIN: '/login',
  LOG_OUT: '/logout',
  SYSTEM: '/system',
  BOARD: '/board'
}