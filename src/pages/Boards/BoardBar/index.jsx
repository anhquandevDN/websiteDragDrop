import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{

      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: 2, //px={2}
      gap: 2,
      overflow: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid white' //borderTop: hiện thanh xanh nhỏ

    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="AnhQuanDev MERN Stack Board"
          clickable
          // {onClick={() => {}}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
          // {onClick={() => {}}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Driver"
          clickable
          // {onClick={() => {}}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
          // {onClick={() => {}}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          // {onClick={() => {}}}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: 'a4b0be' }
            }
          }}
        >
          <Tooltip title="anhquandev">
            <Avatar
              alt="anhquandev"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t39.30808-6/375450456_3583115078682024_1919034679322933723_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEMJXOdh2kIb9sC88pcyn6rJRCWJa8rBcUlEJYlrysFxbirxgtQ59cdmOerb66X6MDTw2EYnZdeCV3rE6_tA6ix&_nc_ohc=YY8HzJPH7GoAX9maasn&_nc_ht=scontent.fdad5-1.fna&oh=00_AfDWsnfeT4qo8hfADEJbn6CvHZTsXfoW6ZJP20e8sAsl_g&oe=65D58597" />
          </Tooltip>
          <Tooltip title="lép khóc nhè">
            <Avatar
              alt="anhquandev"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.15752-9/428473309_1095394688328368_4714488073722905046_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=A5dkfNWCj8sAX9YexEM&_nc_ht=scontent.fdad5-1.fna&oh=03_AdTwwyanxlOn4EEqElxagq7GKKVPtbtARzs2o70KXbLeMQ&oe=65FE7C1E" />
          </Tooltip>
          <Tooltip title="tuấn & anh Đạt">
            <Avatar
              alt="anhquandev"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.15752-9/423221224_925155585499451_2192999519311528668_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=xEbEo5so46MAX_yF4nl&_nc_ht=scontent.fdad5-1.fna&oh=03_AdQDG2xuhAit0anV-QJr89nrk0c2m3JcXF0F89qYDii1ZQ&oe=65FE911D" />
          </Tooltip>
          <Tooltip title="c nguyên">
            <Avatar
              alt="chị nguyên"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.15752-9/412030485_6710318065743830_8340793440058215954_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=8G01cHP6Dx4AX_4M8fM&_nc_ht=scontent.fdad5-1.fna&oh=03_AdQYuTgC3NUeBwtruMbjthFAkuStNuEW3iRTNto1pPpDhg&oe=65FE6392" />
          </Tooltip>
          <Tooltip title="nhung đù">
            <Avatar
              alt="nhung đù"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.15752-9/373036094_297648009865795_1918963403770314063_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=Rg1yaYJLE4IAX8JqpDt&_nc_ht=scontent.fdad5-1.fna&oh=03_AdSdjzkXwFx9--veH1zPmH6veJyFYkE18ymFm3eGWz2gbQ&oe=65FE884C" />
          </Tooltip>
          <Tooltip title="đội trưởng Tam Hải">
            <Avatar
              alt="nhung đù"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.15752-9/365332787_1209723886360672_4369286047175994678_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=awFrgPhdwpEAX8FFNLq&_nc_oc=AQkU_vBL0LqCR7izRPhTkAgFCjEGhW5d3lBM_CA_O1wWwiSP4WmwNQoRZ2E2lskubX8&_nc_ht=scontent.fdad5-1.fna&oh=03_AdQXosPscj6_gCekjtgCvh2AotCrFLpismMmqcRcr8tbng&oe=65FE7674" />
          </Tooltip>
          <Tooltip title="bạn Ghi">
            <Avatar
              alt="nhung đù"
              src="https://scontent.fdad5-1.fna.fbcdn.net/v/t1.6435-9/53429792_509066742833312_5572108527641559040_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7a1959&_nc_ohc=oVtskiFE9SYAX_NsP_d&_nc_ht=scontent.fdad5-1.fna&oh=00_AfB45Cx_XwQCbXxLKz_R5I78EkH6elivls5bPUNU6YDnFg&oe=65FE9049" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar