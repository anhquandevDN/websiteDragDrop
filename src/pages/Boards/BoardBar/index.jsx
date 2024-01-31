import Box from '@mui/material/Box'

function BoardBar() {
  <Box sx={{
    backgroundColor: 'primary.dark',
    width: '100%',
    height: (theme) => theme.trello.boardBarHeight,
    display: 'flex',
    alignItems: 'center'
  }}>
    Board Bar
  </Box>
}

export default BoardBar