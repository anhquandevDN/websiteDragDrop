import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
//import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { ganeratePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
function Board() {
  //Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi chúng ta sd react-router-dom để lấy chuẩn board Id từ URL VỀ
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '65f1aa4e59668c0a60cfe87b'
    //call API
    fetchBoardDetailsAPI(boardId).then(board => {
      //sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.column = mapOrder(board.columns, board.columnOrderIds, '_id')
      //cần xử lý 1 lần nữa vấn đề kéo thả không được khi f5
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [ganeratePlaceholderCard(column)]
          column.cardOrderIds = [ganeratePlaceholderCard(column)._id]

        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)

    })
  }, [])
  //Func này có nhiệm vụ gọi API tạo mới column và làm dữ liệu trong State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    //khi tạo 1 column mới thì nó chưa có card, cần xử lý kéo thả vào 1 column rỗng
    createdColumn.cards = [ganeratePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [ganeratePlaceholderCard(createdColumn)._id]

    //cập nhập lại State data board thay vì phải gọi api fetchBoardDetaisAPI
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  //Func này có nhiệm vụ gọi API tạo mới column và làm dữ liệu trong State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //cập nhập lại State board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      //nếu column rỗng: bản chất là đang chứa một cái placehoder card ở phía FE
      if (columnToUpdate.cards.some(card => card.FE_PlaceHolderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        //NGƯỢC LẠI Column đã data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)

  }
  //Func này có nhiệm vụ gọi API để cập nhập mảng columnOrderIds của Board chứa nó và xử lý khi kéo thả Column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state Board
    const dndOderedColumsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOderedColumsIds
    setBoard(board)
    //Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  //Khi di chuyển card trong Column: chỉ cần gọi API để cập nhập mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }
  /*khi di chuyển card sang Column khác:
  b1: cập nhập mảng cardOrderIds của Column ban đầu chứa nó (hành động xóa)
  b2: cập nhập mảng cardOrderIds của Column tiếp theo (hành động thêm)
  b3: cập nhập lại trường ColumnId mới của Card đã kéo
  => làm một API support riêng*/
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state Board
    const dndOderedColumsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOderedColumsIds
    setBoard(board)
    //Gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //xử lý vấn đề khi kéo Card cuối cùng ra khỏi Column. Column rỗng sẽ có placehoder card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE.
    if (prevCardOrderIds[0].includes('-PlaceHolder-Card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds })
  }
  //xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    //Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)
    //Gọi API xử lý phía BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteMessage)

    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100vw', height: '100vh' }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>

  )
}

export default Board