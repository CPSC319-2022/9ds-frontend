import { Button, IconButton, Stack, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid'
import { DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { AppWrapper } from '../../components/AppWrapper'
import { useSetRole, useUserRoleDirectory } from '../../hooks/firebase/useUser'
import BlockIcon from '@mui/icons-material/Block'
import React from 'react'
import { handleLoading } from '../../components/Spinner/Spinner'

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
          index={params.row.id - 1}
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
          index={params.row.id - 1}
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
          index={params.row.id - 1}
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
  const apiRef = useGridApiRef()
  const { users, loading } = useUserRoleDirectory(null, [
    'reader',
    'contributor',
    'admin',
    'banned',
  ])
  const { setRole } = useSetRole()
  const [usersSessionCopy, setUsersSessionCopy] = useState<Array<DocumentData>>(
    [],
  )
  const [selectedRows, setSelectedRows] = useState<Array<DocumentData>>([])
  const [selectedRowsIndexes, setSelectedRowsIndexes] = useState<Array<number>>(
    [],
  )

  useEffect(() => {
    if (users) {
      setUsersSessionCopy(users)
    }
  }, [users])
  const component = (
    <Stack direction={'column'} alignSelf={'stretch'} spacing={10}>
      <Typography variant='h6' color='black.main'>
        Admin Dashboard
      </Typography>
      {!loading && (
        <DataGrid
          apiRef={apiRef}
          onRowSelectionModelChange={(rowSelectModel) => {
            setSelectedRowsIndexes(
              rowSelectModel.map((v) => parseInt(v as string)),
            )
            setSelectedRows(
              usersSessionCopy.filter((_, i) => {
                return rowSelectModel.includes(i + 1)
              }),
            )
          }}
          rows={usersSessionCopy.map((v, i) => {
            console.log(v)
            return {
              id: i + 1,
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
                    selectedRowsIndexes.includes(i + 1)
                      ? { ...v, role: 'banned' }
                      : v,
                  )
                setUsersSessionCopy(newUsersSessionCopy)
                setSelectedRows([])
                setSelectedRowsIndexes([])
                apiRef.current.setRowSelectionModel([])
              },
            },
          }}
        />
      )}
    </Stack>
  )
  return <AppWrapper>{handleLoading(loading, component)}</AppWrapper>
}

interface PromoteButtonProps {
  index: number
  uid: string
  userCurrentRole: string
  role: PromoteButtonRoles
  users: DocumentData[]
  setUsersSessionCopy: React.Dispatch<React.SetStateAction<DocumentData[]>>
}

const PromoteButton = ({
  index,
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
            i === index ? { ...v, role: 'admin' } : v,
          )
        } else if (role === PromoteButtonRoles.CONTRIBUTOR) {
          newUsersSessionCopy = users.map((v, i) =>
            i === index ? { ...v, role: 'contributor' } : v,
          )
        } else {
          newUsersSessionCopy = users.map((v, i) =>
            i === index ? { ...v, role: 'reader' } : v,
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
