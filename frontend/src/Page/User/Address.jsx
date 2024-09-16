import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useUser } from '../../context/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';

function Address() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: '',
    name: '',
    phone_number: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddress, setEditAddress] = useState({
    name: '',
    address: '',
    phone_number: '',
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    fetch(`http://localhost:8000/api/users/${user.user.id}/addresses`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched addresses:', data);
        setAddresses(data);
      })
      .catch((error) => {
        console.error('Error fetching addresses:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    const phoneNumberPattern = /^[0-9]+$/;
    if (!newAddress.address || !newAddress.name || !newAddress.phone_number) {
      toast.error('Vui lòng nhập đầy đủ thông tin để thêm địa chỉ', {
        autoClose: 2000,
      });
      return;
    }
    if (!phoneNumberPattern.test(newAddress.phone_number)) {
      toast.error('Số điện thoại không đúng định dạng. Vui lòng nhập lại.', {
        autoClose: 2000,
      });
      return;
    }
    e.preventDefault();
    fetch(`http://localhost:8000/api/users/${user.user.id}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAddress),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add address');
        }
        console.log('Address added successfully');
        setNewAddress({ address: '', name: '', phone_number: '' });
        setOpenDialog(false);
        fetchAddresses();
      })
      .catch((error) => {
        console.error('Error adding address:', error);
      });
  };

  const deleteAddress = (addressId) => {
    fetch(`http://localhost:8000/api/users/addresses/${addressId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete address');
        }
        console.log('Address deleted successfully');
        fetchAddresses();
      })
      .catch((error) => {
        console.error('Error deleting address:', error);
      });
  };

  const handleEdit = (addressId) => {
    const phoneNumberPattern = /^[0-9]+$/;
    if (
      !editAddress.address ||
      !editAddress.name ||
      !editAddress.phone_number
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin để sửa địa chỉ', {
        autoClose: 2000,
      });
      return;
    }
    if (!phoneNumberPattern.test(editAddress.phone_number)) {
      toast.error('Số điện thoại không đúng định dạng. Vui lòng nhập lại.', {
        autoClose: 2000,
      });
      return;
    }
    fetch(
      `http://localhost:8000/api/users/${user.user.id}/addresses/${addressId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch address for editing');
        }
        return response.json();
      })
      .then((data) => {
        setOpenEditDialog(true);

        setEditingAddressId(addressId);

        setEditAddress({
          name: data.address.name,
          address: data.address.address,
          phone_number: data.address.phone_number,
        });
      })
      .catch((error) => {
        console.error('Error fetching address for editing:', error);
      });
  };

  const handleEditSubmit = () => {
    fetch(`http://localhost:8000/api/users/addresses/${editingAddressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editAddress),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update address');
        }
        console.log('Address updated successfully');
        setOpenEditDialog(false);
        fetchAddresses();
      })
      .catch((error) => {
        console.error('Error updating address:', error);
      });
  };

  return (
    <div>
      <div>
        <h1>Địa chỉ của tôi</h1>

        <Button
          onClick={() => setOpenDialog(true)}
          variant='contained'
          color='primary'>
          Thêm địa chỉ
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <TextField
                name='name'
                value={newAddress.name}
                onChange={handleInputChange}
                label='Tên'
                margin='normal'
              />
              <TextField
                name='address'
                value={newAddress.address}
                onChange={handleInputChange}
                label='Địa chỉ'
                margin='normal'
              />
              <TextField
                name='phone_number'
                value={newAddress.phone_number}
                onChange={handleInputChange}
                label='Số điện thoại'
                margin='normal'
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color='primary'>
              Hủy
            </Button>
            <Button onClick={handleSubmit} color='primary'>
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <TextField
                name='name'
                value={editAddress.name}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, name: e.target.value })
                }
                label='Tên'
                margin='normal'
              />
              <TextField
                name='address'
                value={editAddress.address}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, address: e.target.value })
                }
                label='Địa chỉ'
                margin='normal'
              />
              <TextField
                name='phone_number'
                value={editAddress.phone_number}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    phone_number: e.target.value,
                  })
                }
                label='Số điện thoại'
                margin='normal'
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color='primary'>
              Hủy
            </Button>
            <Button onClick={handleEditSubmit} color='primary'>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  {addresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>
                        <Typography variant='subtitle1'>
                          Họ tên: {address.name}
                        </Typography>
                        <Typography variant='body2'>
                          Số điện thoại: {address.phone_number}
                        </Typography>
                        <Typography variant='body1'>
                          Địa chỉ: {address.address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(address.id)}
                          color='primary'>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteAddress(address.id)}
                          color='secondary'>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Address;
