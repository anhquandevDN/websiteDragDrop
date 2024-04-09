import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import LockIcon from '@mui/icons-material/Lock'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
//import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { InputAdornment } from '@mui/material'
import { Link } from 'react-router-dom'

// import { handleLoginApi } from '~/apis/useService'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // const [errMessage, setErrMessage] = useState('')

  const handleOnChangeUserName = (e) => {
    setUsername(e.target.value)
  }

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    // setErrMessage('') // Xóa thông báo lỗi cũ
    // try {
    //   let data = await handleLoginApi(username, password)
    //   if (data && data.errCode !== 0) {
    //     setErrMessage(data.message) // Cập nhật thông báo lỗi mới
    //   }
    //   if (data && data.errCode === 0) {
    //     props.userLoginSuccess(data.user)
    //     console.log('loging success')
    //   }
    // } catch (e) {
    //   if (e.response && e.response.data) {
    //     setErrMessage(e.response.data.message) // Xử lý lỗi từ phản hồi của API
    //   }
    //   console.log('error message', e.response)
    // }
    // this.setState({
    //   errMessage: ''
    // })
    // try {

    //   let data = await handleLoginApi(this.state.username, this.state.password)
    //   if (data && data.errCode !== 0) {
    //     this.setState({
    //       errMessage: data.message
    //     })
    //   }
    //   if (data && data.errCode === 0) {
    //     //this.props.userLoginSuccess(data.user)
    //     console.log('loging success')
    //   }

    // } catch (e) {
    //   if (e.response) {
    //     if (e.response.data) {
    //       this.setState({
    //         errMessage: e.response.data.message
    //       })
    //     }
    //   }
    //   console.log('error message', e.response)
    // }
  }

  // const handleShowHidePassword = () => {
  //   setShowPassword(!showPassword)
  // }
  // <Typography variant="body1" color="error">
  //             {this.state.errMessage}
  //           </Typography>
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <Box sx={{
      height: '100vh',
      backgroundImage: 'url(https://toigingiuvedep.vn/wp-content/uploads/2022/05/anh-vu-tru.jpg)',
      //background: (theme) => theme.palette.primary.dark
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>
      <Box
        sx={{
          maxWidth: '500px',
          minWidth: '300px',
          height: '350px',
          width: '350px',
          backgroundColor: '#fff',
          borderRadius: '3px',
          margin: '0 auto',
          position: 'absolute',
          top: '90px',
          bottom: '0px',
          left: '0',
          right: '0'
        }}
      >
        <Typography variant="h1"
          sx={{
            paddingBottom: '10px',
            borderBottom: '1px solid rgb(79, 98, 148)',
            fontWeight: '400',
            fontSize: '20px',
            //lineHeight: '44px',
            textAlign: 'center',
            color: 'black',
            marginBottom: '35px'
          }}
        >
          <Box display="flex" justifyContent="center" margin="15px">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="36px"
              height="36px"
              borderRadius="50%"
              bgcolor={(theme) => theme.palette.primary.dark}
            >
              <LockIcon sx={{ color: 'white' }} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="36px"
              height="36px"
              borderRadius="50%"
              bgcolor={(theme) => theme.palette.primary.dark}
              marginLeft="10px"
            >
              <SvgIcon component={trelloIcon} fontSize="small" sx={{ color: 'white' }} />
            </Box>
          </Box>
          Login
        </Typography>
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <Box
            sx={{

            }}
          >
            <TextField
              {...register('firstName')}
              value={username}
              onChange={handleOnChangeUserName}
              label="Enter Username..."
              variant="outlined"
              fullWidth
              sx={{
                height: '25px',
                padding: '8px 12px',
                '& .MuiOutlinedInput-root': {
                  height: '45px'
                },
                '& .MuiFormLabel-root': {
                  px: '10px',
                  fontSize: '0.875rem',
                  alignContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  top: 5
                }
              }}
            />
            <TextField
              {...register('lastName...', { required: true })}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleOnChangePassword}
              label="Enter Password..."
              variant="outlined"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName ? 'Enter Password is required.' : ''}
              sx={{
                marginTop: '35px',
                height: '40px',
                padding: '8px 12px',
                '& .MuiOutlinedInput-root': {
                  height: '45px'
                },
                '& .MuiFormLabel-root': {
                  px: '10px',
                  fontSize: '0.875rem',
                  alignContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  top: 5
                }
              }}
              InputProps
              endAdornment={
                <InputAdornment position="end">
                  <VisibilityOffIcon />
                </InputAdornment>
              }
            />

            <Button
              onClick={handleLogin}
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                marginTop: '29px',
                mx: '10px',
                minWidth: '329px',
                display: 'flex',
                justifyContent: 'center', // Căn giữa theo chiều dọc
                alignItems: 'center'
              }}
            >
              Login
            </Button>
            <Link
              to='/register'
              style={{
                color: '#1976d2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.875rem',
                textDecoration: 'none',
                paddingTop: '10px'
              }} >
              Create account! </Link>
          </Box>
        </form>
      </Box >
    </Box>

  )
}

export default App
