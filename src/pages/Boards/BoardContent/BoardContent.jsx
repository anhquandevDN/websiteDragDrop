//XỬ LÝ TOÀN BỘ THÂN
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { ganeratePlaceholderCard } from '~/utils/formatters'

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
  const [orderedColums, setOrderedColums] = useState([])
  //cùng một thời điểm chỉ có 1 phần tử kéo là column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColums(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    //Đoạn này cần lưu ý, nên dùng c.cards thay vì dùng c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ
    //làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOderIds mới.
    return orderedColums.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // function chung xử lý việc cập nhập lại state trong trường hợp di chuyển Card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColums(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // console.log('overCardIndex: ', overCardIndex)
      //logic tính toán "cardIndex mới - trên hoặc dưới overCard"
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height //rect: vị trí của phần tử đó so với khung hình
      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      // console.log('newCardIndex: ', newCardIndex)
      // console.log('modifier: ', modifier)
      // console.log('isBelowOverItem: ', isBelowOverItem)
      //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhập lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //column cũ
      if (nextActiveColumn) {
        //xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //thêm Placeholder Card nếu Column rỗng: Bị kéo Card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [ganeratePlaceholderCard(nextActiveColumn)]

        }
        //cập nhập lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //column mới
      if (nextOverColumn) {
        //kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //đối với trường hợp dragEnd thì phải cập nhập lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau.
        // const rebuild_activeDraggingCardData = {
        //   ...activeDraggingCardData,
        //   columnId: nextOverColumn._id
        // }
        //tiếp theo là thêm cái card đang kéo overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          { ...activeDraggingCardData, columnId: nextOverColumn._id })
        //xóa cái Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceHolderCard)
        //cập nhập lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      // console.log('nextColumns: ', nextColumns)
      // return [...prevColumns]
      return nextColumns

    })

  }

  //TRIGGER bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //TRIGGER trong quá trình kéo một phần tử
  const handDragOver = (event) => {
    //Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handDragOver: ', event)
    const { active, over } = event

    //cần đảm bảo ko tồn tại ac và over (khi kéo ra khỏi phạm vi container thì không làm gì cả để tránh crash trang)
    if (!active || !over) return

    //activeDraggingCard: là card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //overCard: là cái card đang tương tác trên hoặc dưới so với card được kéo ở trên.
    const { id: overCardId } = over

    // tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn: ', activeColumn )
    // console.log('overColumn: ', overColumn)

    //nếu k tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return
    //tạo state (tìm vị trí Index của cái overCard trong column đích (nơi là activeCard sắp đc thả))
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //TRIGGER khi kết thúc hành động kéo(drag)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event
    //cần đảm bảo ko tồn tại ac và over (khi kéo ra khỏi phạm vi container thì không làm gì cả để tránh crash trang)
    if (!active || !over) return


    //xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hành động kéo thả Card - Tạm thời không làm gì cả!')
      //activeDraggingCard: là card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //overCard: là cái card đang tương tác trên hoặc dưới so với card được kéo ở trên.
      const { id: overCardId } = over

      // tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColumn: ', activeColumn )
      // console.log('overColumn: ', overColumn)

      //nếu k tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      //Phải dùng tới activeDragItemData.columnId or ... (set vào state từ bước handleDragStart) chứ không phải activeData
      // trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây state của card đã bị cập nhập một lần rồi
      // hành động kéo thả Card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // hành động kéo thả card trong cùng 1 cái column

        //lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //lấy vị trí mới từ thằng over
        const newCardIndex = overColumn.cards?.findIndex(c => c._id === overCardId)
        //dùng arrayMove vì kéo card trong một cái column thì tương tự với logic kéo column trong một cái boardcontent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColums(prevColumns => {
          //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhập lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)

          //tìm tới column mà chúng ta đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          //cập nhập lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          // console.log('targetColumn: ', targetColumn)
          //trả về state mới (chuẩn vị trí)
          return nextColumns
        })

      }
    }

    //xử lý kéo thả Columns trong một cái boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // console.log('hành động kéo thả Column - Tạm thời không làm gì cả!')
      //nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        //lấy vị trí cũ từ thằng active
        const oldColumnIndex = orderedColums.findIndex(c => c._id === active.id)
        //lấy vị trí mới từ thằng over
        const newColumnIndex = orderedColums.findIndex(c => c._id === over.id)

        //dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng columns ban đầu -https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColums, oldColumnIndex, newColumnIndex)
        //2 cái console.log dữ liệu này sau dùng để xử lý gọi API
        // const dndOderedColumsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)
        // console.log('dndOderedColumsIds: ', dndOderedColumsIds)

        //cạp nhập lại state columns ban đầu sau khi đã kéo thả
        setOrderedColums(dndOrderedColumns)
      }
    }

    //những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  //chúng ta sẽ custom lại chiến lược/ thuật toán phát hiện va chạm rồi tối ưu việc kéo thả card giữa nhiều column
  //args = argument = các đối số, tham số
  const collisionDetectionStrategy = useCallback( (args) => {
    //trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    //tìm điểm giao nhau, va chạm  - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)
    //thuật toán phát hiện va chạm sẽ trả về một mảng va chạm ở đây
    //
    const intersections = !!pointerIntersections?.length
      ? pointerIntersections
      : rectIntersection(args)

    //tìm overId đầu tiên trong đám intersections ở trên
    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      //fix flickering-Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào
      //thuật toán phát hiện va chạm closeCorners đều được. Nhưng sau khi check dùng closestCenter sẽ thấy mượt mà hơn tí.

      const checkColumn = orderedColums.find( column => column._id === overId )
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(Container => {
            return (Container.id !== overId) && (checkColumn?.cardOrderIds?.includes(Container.id))
          })
        }) [0]?.id
        // console.log('overId after: ', overId)
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    //nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColums] )

  return (
    <DndContext
      //cảm biến
      sensors={sensors}
      //thuật toán phát hiện va chạm(nếu không có nó thì card với over lớn sẽ không kéo qua Column được vì lúc này nó đang conflict giữa card và column)
      //chúng ta sẽ dùng closestCorners thay vì clossestCenter
      // collisionDetection={closestCorners}
      //nếu chỉ dùng closestCorners sẽ có bug flicking + sai lệch dữ liệu
      //tự custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handDragOver}
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
          {(activeDragItemType) === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent