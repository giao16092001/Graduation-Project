import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  TextField,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

function UserManagement() {
  const [listUser, setListUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetch('http://localhost:8000/api/getListUser')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setListUser(data);
      })
      .catch((error) => {
        console.error('Error fetch list user:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      fetch(`http://localhost:8000/api/deleteUser/${userId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setListUser((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }
  };
  const handleRoleChange = (userId, newRole) => {
    fetch(`http://localhost:8000/api/updateUserRole/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setListUser((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => {
        console.error('Error updating user role:', error);
      });
  };
  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: 'avatarWithName',
      headerName: 'Tên người dùng',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={params.row.name}
            src={`https://example.com/${params.row.avatar}`}
            sx={{
              width: 40,
              height: 40,
              marginRight: 1,
              backgroundColor: 'lightblue',
            }}
          />
          <Typography variant='body1'>{params.row.name}</Typography>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    // { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.row.role}
          onChange={(event) =>
            handleRoleChange(params.row.id, event.target.value)
          }>
          <MenuItem value='user'>User</MenuItem>
          <MenuItem value='admin'>Admin</MenuItem>
        </Select>
      ),
    },
    {
      field: 'actions',
      headerName: 'Xóa',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant='contained'
          color='error'
          onClick={() => handleDeleteUser(params.row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const filteredUser = listUser.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant='h3' gutterBottom align='center'>
          Quản lý người dùng
        </Typography>
        <TextField
          label='Tìm kiếm người dùng'
          variant='outlined'
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />
        <DataGrid
          rows={filteredUser}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          rowsPerPageOptions={[10, 15, 20]}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default UserManagement;
