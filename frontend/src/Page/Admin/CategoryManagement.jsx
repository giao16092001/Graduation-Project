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
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useCategory } from '../../services/useCategory';
import { ToastContainer } from 'react-toastify';

function CategoryManagement() {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  const listCategory = categories;
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    category_name: '',
    id: null,
  });

  const handleClickOpen = () => {
    setCurrentCategory({ category_name: '', id: null });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (isEditing) {
      try {
        await updateCategory(currentCategory.id, currentCategory);
      } catch (error) {
        console.error('Error update category:', error);
      }
    } else {
      try {
        await addCategory(currentCategory);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
    fetchCategories();
    handleClose();
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setOpen(true);
  };
  console.log(listCategory);
  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResult = listCategory.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'category_name', headerName: 'Category Name', flex: 1 },
    {
      field: 'edit',
      headerName: 'Sửa',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditCategory(params.row)}>
          <EditIcon sx={{ color: '#4caf50' }} />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteCategory(params.row.id)}>
          <DeleteIcon sx={{ color: '#f44336' }} />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography variant='h3' gutterBottom align='center'>
            Quản lý danh mục
          </Typography>
          <div>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddIcon />}
              onClick={handleClickOpen}>
              Thêm danh mục
            </Button>
          </div>
          <TextField
            label='Tìm kiếm danh mục'
            variant='outlined'
            value={searchTerm}
            onChange={handleSearch}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />

          <DataGrid
            rows={searchResult}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Danh mục'
            type='text'
            fullWidth
            value={currentCategory.category_name}
            onChange={(e) =>
              setCurrentCategory({
                ...currentCategory,
                category_name: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default CategoryManagement;
