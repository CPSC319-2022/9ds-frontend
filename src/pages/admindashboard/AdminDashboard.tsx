import { Button, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { AppWrapper } from '../../components/AppWrapper'
import { theme } from '../../theme'

const columns: GridColDef[] = [
  { field: 'user', headerName: 'User', flex: 1 },
  { field: 'uid', headerName: 'id', flex: 1 },
  { field: 'status', headerName: 'status', flex: 1 },
  {
    field: 'contribStatusReq',
    headerName: 'Contributor status request',
    flex: 1,
  },
  {
    field: 'makeContributor',
    headerName: 'Make contributor',
    flex: 1,
    renderCell: (params) => {
      return <Button variant='contained'>Promote</Button>
    },
  },
  {
    field: 'makeAdmin',
    headerName: 'Make admin',
    flex: 1,
    renderCell: (params) => {
      return (
        <Button
          onClick={() => {
            console.log(params)
          }}
          variant='contained'
          color='secondary'
        >
          Promote
        </Button>
      )
    },
  },
]

export const AdminDashboard = () => {
  return (
    <AppWrapper>
      <Stack direction={'column'} alignSelf={'stretch'} spacing={10}>
        <Typography variant='h6' color='black.main'>
          Admin Dashboard
        </Typography>
        <DataGrid
          rows={[
            {
              id: 1,
              user: 'das',
              uid: 'dsasd',
              status: 'dsadsa',
              contribStatusReq: 'dsads',
              makeContributor: 'adssd',
              makeAdmin: 'asdsd',
            },
            {
              id: 2,
              user: 'das',
              uid: 'dsasd',
              status: 'dsadsa',
              contribStatusReq: 'dsads',
              makeContributor: 'adssd',
              makeAdmin: 'asdsd',
            },
            {
              id: 3,
              user: 'das',
              uid: 'dsasd',
              status: 'dsadsa',
              contribStatusReq: 'dsads',
              makeContributor: 'adssd',
              makeAdmin: 'asdsd',
            },
          ]}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
        />
      </Stack>
    </AppWrapper>
  )
}
