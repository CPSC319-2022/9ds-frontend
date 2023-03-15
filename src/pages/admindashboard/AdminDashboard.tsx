import { Button, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { useSetRole, useUserRoleDirectory } from '../../hooks/firebase/useUser'
import { theme } from '../../theme'

enum PromoteButtonRoles {
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin',
}

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
      return (
        <PromoteButton
          uid={params.row.uid}
          role={PromoteButtonRoles.CONTRIBUTOR}
        />
      )
    },
  },
  {
    field: 'makeAdmin',
    headerName: 'Make admin',
    flex: 1,
    renderCell: (params) => {
      return (
        <PromoteButton uid={params.row.uid} role={PromoteButtonRoles.ADMIN} />
      )
    },
  },
]

export const AdminDashboard = () => {
  const { users, loading } = useUserRoleDirectory(null, [
    'reader',
    'contributor',
    'admin',
    'banned',
  ])

  return (
    <AppWrapper>
      <Stack direction={'column'} alignSelf={'stretch'} spacing={10}>
        <Typography variant='h6' color='black.main'>
          Admin Dashboard
        </Typography>
        {!loading && (
          <DataGrid
            rows={users.map((v, i) => {
              return {
                id: i + 1,
                user: v.username,
                uid: v.uid,
                status: v.role,
                contribStatusReq:
                  v.promotion_request === undefined ? 'no' : 'yes',
                makeContributor: v.role !== 'contributor',
                makeAdmin: v.role !== 'admin',
              }
            })}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
            columns={columns}
          />
        )}
      </Stack>
    </AppWrapper>
  )
}

interface PromoteButtonProps {
  uid: string
  role: PromoteButtonRoles
}

const PromoteButton = ({ uid, role }: PromoteButtonProps) => {
  const { setRole, error } = useSetRole()

  useEffect(() => {
    if (error) {
      throw new Error('Something wrong happened. Try again later!')
    }
  }, [error])
  return (
    <Button
      onClick={() => {
        setRole(uid, role)
      }}
      variant='contained'
      color={role === PromoteButtonRoles.ADMIN ? 'secondary' : 'primary'}
    >
      Promote
    </Button>
  )
}
