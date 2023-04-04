import { Button, IconButton, Stack, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid'
import { DocumentData } from 'firebase/firestore'
import { FC, useEffect, useMemo, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { useSetRole, useUserRoleDirectory } from '../../hooks/firebase/useUser'
import BlockIcon from '@mui/icons-material/Block'
import React from 'react'
import { handleLoading } from '../../components/Spinner/Spinner'
import { SearchInput } from 'components/SearchInput/SearchInput'
import { Button as CustomButton } from '../../components/Button'
import { useNavigate } from 'react-router-dom'


enum PromoteButtonRoles {
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin',
  READER = 'reader',
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
    field: 'makeReader',
    headerName: 'Make reader',
    flex: 1,
    renderCell: (params) => {
      return (
        <PromoteButton
          uid={params.row.uid}
          role={PromoteButtonRoles.READER}
          userCurrentRole={params.row.status}
          setUsersSessionCopy={params.row.setUsersSessionCopy}
          users={params.row.users}
        />
      )
    },
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
          userCurrentRole={params.row.status}
          setUsersSessionCopy={params.row.setUsersSessionCopy}
          users={params.row.users}
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
        <PromoteButton
          uid={params.row.uid}
          role={PromoteButtonRoles.ADMIN}
          userCurrentRole={params.row.status}
          setUsersSessionCopy={params.row.setUsersSessionCopy}
          users={params.row.users}
        />
      )
    },
  },
]

export const AdminDashboard = () => {
  const navigate = useNavigate()
  const apiRef = useGridApiRef()
  const { users, loading } = useUserRoleDirectory(null, [
    'reader',
    'contributor',
    'admin',
    'banned',
  ])
  const { setRole } = useSetRole()
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [usersSessionCopy, setUsersSessionCopy] = useState<Array<DocumentData>>(
    [],
  )
  const [selectedRows, setSelectedRows] = useState<Array<DocumentData>>([])
  const [selectedRowsIds, setSelectedRowsIds] = useState<Array<string>>(
    [],
  )

  useEffect(() => {
    if (users) {
      setUsersSessionCopy(users)
    }
  }, [users])

  const filteredUsers = useMemo(() => {
    return usersSessionCopy.filter(({username}) => 
    (username as string).toLowerCase().includes(userSearchTerm.toLowerCase()))
  }, [usersSessionCopy, userSearchTerm])


  const component = (
    <Stack direction={'column'} alignSelf={'stretch'} spacing={10}>
      <Typography variant='h6' color='black.main'>
        Admin Dashboard
      </Typography>
      {!loading && (
        <DataGrid
          apiRef={apiRef}
          onRowSelectionModelChange={(rowSelectModel) => {
            setSelectedRowsIds(rowSelectModel as string[])
            setSelectedRows(
              usersSessionCopy.filter((v) => {
                return rowSelectModel.includes(v.uid)
              }),
            )
          }}
          rows={filteredUsers.map((v) => {
            return {
              id: v.uid,
              user: v.username,
              uid: v.uid,
              status: v.role,
              contribStatusReq:
                v.promotion_request === undefined ? 'no' : 'yes',
              makeReader: v.role !== 'reader',
              makeContributor: v.role !== 'contributor',
              makeAdmin: v.role !== 'admin',
              setUsersSessionCopy: setUsersSessionCopy,
              users: usersSessionCopy,
            }
          })}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          hideFooterSelectedRowCount={true}
          slots={{
            toolbar: selectedRows.length === 0 ? null : ToolBar,
          }}
          slotProps={{
            toolbar: {
              numSelected: selectedRows.length,
              onBan: () => {
                selectedRows.forEach((v) => {
                  setRole(v.uid, 'banned')
                })
                const newUsersSessionCopy: DocumentData[] =
                  usersSessionCopy.map((v, i) =>
                    selectedRowsIds.includes(v.uid)
                      ? { ...v, role: 'banned' }
                      : v,
                  )
                setUsersSessionCopy(newUsersSessionCopy)
                setSelectedRows([])
                setSelectedRowsIds([])
                apiRef.current.setRowSelectionModel([])
              },
            },
          }}
        />
      )}
    </Stack>
  )

  return (
    <AppWrapper>
      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'flex-begin' }}>
        <Stack spacing={40} direction="row" sx={{alignItems: 'center', justifyContent: "space-between"}}>
        <SearchInput label='Search by user' handleChange={(value) => setUserSearchTerm(value)} />
        <CustomButton text="View Pipeline" onClick={() => navigate('/pipeline/ui')} />
        </Stack>
      </Stack>
      {handleLoading(loading, component)}
    </AppWrapper>
  )
}

interface PromoteButtonProps {
  uid: string
  userCurrentRole: string
  role: PromoteButtonRoles
  users: DocumentData[]
  setUsersSessionCopy: React.Dispatch<React.SetStateAction<DocumentData[]>>
}

const PromoteButton = ({
  uid,
  userCurrentRole,
  role,
  users,
  setUsersSessionCopy,
}: PromoteButtonProps) => {
  const { setRole, error } = useSetRole()

  useEffect(() => {
    if (error) {
      throw new Error('Something wrong happened. Try again later!')
    }
  }, [error])
  return (
    <Button
      disabled={userCurrentRole === role}
      onClick={() => {
        setRole(uid, role)
        let newUsersSessionCopy: DocumentData[] = []
        if (role === PromoteButtonRoles.ADMIN) {
          newUsersSessionCopy = users.map((v, i) =>
            v.uid === uid ? { ...v, role: 'admin' } : v,
          )
        } else if (role === PromoteButtonRoles.CONTRIBUTOR) {
          newUsersSessionCopy = users.map((v, i) =>
            v.uid === uid ? { ...v, role: 'contributor' } : v,
          )
        } else {
          newUsersSessionCopy = users.map((v, i) =>
            v.uid === uid ? { ...v, role: 'reader' } : v,
          )
        }
        setUsersSessionCopy(newUsersSessionCopy)
      }}
      variant='contained'
      color='primary'
    >
      Set
    </Button>
  )
}

interface ToolBarProps {
  numSelected: number
  onBan: () => void
}

const ToolBar = ({ numSelected, onBan }: ToolBarProps) => {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: '#007DFF1A',
        marginBottom: 10,
        marginTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
        paddingBottom: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography color={'#007DFF'}>{numSelected} selected</Typography>
      <IconButton aria-label='ban' onClick={onBan}>
        <BlockIcon />
      </IconButton>
    </GridToolbarContainer>
  )
}
