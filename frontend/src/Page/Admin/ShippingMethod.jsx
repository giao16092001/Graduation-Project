import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify';

function ShippingMethod() {
  const [listShippingMethod, setListShippingMethod] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newShippingMethod, setNewShippingMethod] = useState({
    name: '',
    description: '',
    shipping_fee: '',
  });
  const [currentShippingMethod, setCurrentShippingMethod] = useState({
    id: null,
    name: '',
    description: '',
    shipping_fee: '',
  });

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/shipping-methods'
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setListShippingMethod(data);
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
    }
  };

  const handleClickOpen = () => {
    setNewShippingMethod({ name: '', description: '', shipping_fee: '' });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClickOpen = (shippingMethod) => {
    setCurrentShippingMethod(shippingMethod);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (editMode) {
      if (
        !currentShippingMethod.name ||
        !currentShippingMethod.description ||
        !currentShippingMethod.shipping_fee
      ) {
        toast.error(
          'Vui lòng nhập đủ thông tin để sửa phương thức vận chuyển',
          {
            autoClose: 2000,
          }
        );
        return;
      }
      if (isNaN(parseInt(currentShippingMethod.shipping_fee))) {
        toast.error('Phí vận chuyển phải là số', {
          autoClose: 2000,
        });
        return;
      }
      await fetch(
        `http://localhost:8000/api/shipping-methods/${currentShippingMethod.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentShippingMethod),
        }
      );
    } else {
      if (
        !newShippingMethod.name ||
        !newShippingMethod.description ||
        !newShippingMethod.shipping_fee
      ) {
        toast.error(
          'Vui lòng nhập đủ thông tin để thêm phương thức vận chuyển',
          {
            autoClose: 2000,
          }
        );
        return;
      }
      if (isNaN(parseInt(newShippingMethod.shipping_fee))) {
        toast.error('Phí vận chuyển phải là số', {
          autoClose: 2000,
        });
        return;
      }
      await fetch('http://localhost:8000/api/shipping-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShippingMethod),
      });
    }
    fetchShippingMethods();
    handleClose();
  };

  const handleDeleteShippingMethod = async (id) => {
    await fetch(`http://localhost:8000/api/shipping-methods/${id}`, {
      method: 'DELETE',
    });
    fetchShippingMethods();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResult = listShippingMethod.filter((shipping) =>
    shipping.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Phương thức vận chuyển', flex: 1 },
    { field: 'description', headerName: 'Mô tả', flex: 1 },
    { field: 'shipping_fee', headerName: 'Giá', flex: 1 },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditClickOpen(params.row)}>
          <EditIcon sx={{ color: '#4caf50' }} />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteShippingMethod(params.row.id)}>
          <DeleteIcon sx={{ color: '#f44336' }} />
        </IconButton>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editMode) {
      setCurrentShippingMethod({ ...currentShippingMethod, [name]: value });
    } else {
      setNewShippingMethod({ ...newShippingMethod, [name]: value });
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography variant='h3' gutterBottom align='center'>
            Quản lý phương thức vận chuyển
          </Typography>
          <div>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddIcon />}
              onClick={handleClickOpen}>
              Thêm đơn vị vận chuyển
            </Button>
          </div>
          <TextField
            label='Tìm kiếm Phương thức vận chuyển'
            variant='outlined'
            value={searchTerm}
            onChange={handleSearch}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>
              {editMode
                ? 'Chỉnh sửa phương thức vận chuyển'
                : 'Thêm phương thức vận chuyển mới'}
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <TextField
                  name='name'
                  value={
                    editMode
                      ? currentShippingMethod.name
                      : newShippingMethod.name
                  }
                  onChange={handleInputChange}
                  label='Tên'
                  margin='normal'
                />
                <TextField
                  name='description'
                  value={
                    editMode
                      ? currentShippingMethod.description
                      : newShippingMethod.description
                  }
                  onChange={handleInputChange}
                  label='Mô tả'
                  margin='normal'
                />
                <TextField
                  name='shipping_fee'
                  value={
                    editMode
                      ? currentShippingMethod.shipping_fee
                      : newShippingMethod.shipping_fee
                  }
                  onChange={handleInputChange}
                  label='Phí vận chuyển'
                  margin='normal'
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Hủy
              </Button>
              <Button onClick={handleSave} color='primary'>
                Lưu
              </Button>
            </DialogActions>
          </Dialog>

          <DataGrid
            rows={searchResult}
            columns={columns}
            autoHeight
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <ToastContainer />
    </div>
  );
}

export default ShippingMethod;
