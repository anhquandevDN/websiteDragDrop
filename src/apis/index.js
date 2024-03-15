import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
//request
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios sẽ trả kết quả về qua property của nó là data
  return response.data

}
//những đoạn ở dưới không cần trycatch hay thencatch gì để bắt lỗi vì dư thừa code
//tận dụng Interceptors trong axios - đánh chặn giữa req va res để xử lý logic chúng ta muốn (lỗi tập trung, jwt.json web tonken, accept tonken, refesh token)