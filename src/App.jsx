import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Board from './pages/Boards/_id'
import Login from '~/pages/Auth/Login'
import Register from './pages/Auth/Register'
import { userIsNotAuthenticated } from '~/hoc/authentication'
import { path } from '~/utils/constants'
import NavBar from './pages/Auth/navBar'
function App() {
  return (
    <Router>
      <NavBar />
      <div className='page-container'>
        <Routes>
          <Route path='/' element={<Board />}/>
          <Route path='/login' element={<Login/> }/>
          <Route path='/register' element={<Register/> }/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
