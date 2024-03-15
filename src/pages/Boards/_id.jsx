import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
//import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  //Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi chúng ta sd react-router-dom để lấy chuẩn board Id từ URL VỀ
  const [board, setBoard] = useState(null)
  useEffect ( () => {
    const boardId = '65f1aa4e59668c0a60cfe87b'
    //call API
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)

    })
  }, [] )
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={ board }/>
      <BoardContent board={ board }/>
    </Container>

  )
}

export default Board