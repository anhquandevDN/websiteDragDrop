import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
//request
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

//api support Board
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data

}
//những đoạn ở dưới không cần trycatch hay thencatch gì để bắt lỗi vì dư thừa code
//tận dụng Interceptors trong axios - đánh chặn giữa req va res để xử lý logic chúng ta muốn (lỗi tập trung, jwt.json web tonken, accept tonken, refesh token)