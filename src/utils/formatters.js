//Capitalize the first letter of a string
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

//làm cho trường hợp column trống FE
export const ganeratePlaceholderCard = (Column) => {
  return {
    _id: `${Column._id}-PlaceHolder-Card`,
    boardId: Column.boardId, columnId: Column._id, FE_PlaceHolderCard: true
  }
}
