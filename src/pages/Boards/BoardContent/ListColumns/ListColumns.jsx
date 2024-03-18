import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  //(tạo UI/UX cho column newcolum)false: mở, True: đóng
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Pls enter Column Title!')
      return
    }

    //Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    /*gọi lên props function createNewColumn nằm ỏ component cha cao nhất (boards/_id.jsx)
    còn 1 cách xử lý là đưa dữ liệu Board ra ngoài Redux Global Store= thì lúc này chúng ta có thể gọi luôn API ở đây thay vì gọi ngược lên component cha phía trên*/
    createNewColumn(newColumnData)
    // console.log(newColumnTitle)
    //gọi API
    //đóng trạng thái thêm Column mới & Clear Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  /*
  Thằng SortableContext yêu cầu items là một mảng dạng ['id-1','id-2'] chứ không phải [{id: 'id-1'},id: 'id-2']
  Nếu không đúng thì vẫn dùng được nhưng không có animation
  https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
   */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }

      }}>
        {columns?.map(column => <Column
          key={column._id}
          column={column}
          createNewCard={ createNewCard }
          deleteColumnDetails={deleteColumnDetails}/>)}
        {/* Add new column CTA, sử dụng toán tử 3 ngôi */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'

          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField id="outlined-search"
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseRoundedIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>


        }
      </Box>
    </SortableContext>

  )
}

export default ListColumns