import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  // PointerSensor,
  MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //cảm biến (yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event)
  //Nếu dùng PointerSensor mặc định phải kết hợp thuộc tính CSS touchaction: none ở phần tử kéo thả - nhưng mà còn bug.
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  //sử dụng mouseSensor và touchSensor để trải nghiệm trên mobile 1 cách tốt nhất
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //nhấn giữ 250ms và dung sai của cảm ứng 500px (dễ hiểu là di chuyển/ chênh lệch 5px) thì mới kich hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  const [orderedColums, setOrderedColums]= useState([])
  //cùng một thời điểm chỉ có 1 phần tử kéo là column hoặc card
  const [ activeDragItemId, setActiveDragItemId]= useState(null)
  const [activeDragItemType, setActiveDragItemType]= useState(null)
  const [activeDragItemData, setActiveDragItemData]= useState(null)

  useEffect ( () => {
    setOrderedColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    //kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lối)
    if (!over) return

    //nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      //lấy vị trí cũ từ thằng active
      const oldIndex = orderedColums.findIndex(c => c._id === active.id)
      //lấy vị trí mới từ thằng over
      const newIndex = orderedColums.findIndex(c => c._id === over.id)

      //dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng columns ban đầu -https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColums, oldIndex, newIndex)
      //2 cái console.log dữ liệu này sau dùng để xử lý gọi API
      // const dndOderedColumsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOderedColumsIds: ', dndOderedColumsIds)

      //cạp nhập lại state columns ban đầu sau khi đã kéo thả
      setOrderedColums(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  const customDropAnimation= {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        // `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        // alignItems: 'center'
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColums} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType) === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {(activeDragItemType) === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card column={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent