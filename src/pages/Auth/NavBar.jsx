import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div>
      <Button variant="contained">
        <Link to='/' > Board </Link></Button>
      <Button variant="contained">
        <Link to='/login' > Login </Link>
      </Button>
      <Button variant="contained">
        <Link to='/register' > Register </Link>
      </Button>
    </div>

  )
}

export default NavBar