import { MouseSensor as DndKitMouseSensor,
  TouchSensor as DndKitTouchSensor
} from '@dnd-kit/core'


// Block DnD event propagation if element have data-no-dnd="true" attribute
const handler = ({ nativeEvent: event }) => {
  let cur = event.target

  while (cur) {
    //giá trị true trong Box hiển trị là (có dữ liệu là đúng) và nếu có cùng dữ liệu với dataset.noDnd là có dữ liệu => trùng nên trả về False
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement
  }

  return true
}

export class MouseSensor extends DndKitMouseSensor {
  static activators = [{ eventName: 'onMouseDown', handler }]
}

export class TouchSensor extends DndKitTouchSensor {
  static activators = [{ eventName: 'onTouchStart', handler }]
}