import {
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
function ProductManagement() {
  const [listProduct, setListProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setListProduct(data);
      })
      .catch((error) => {
        console.error('Error fetch list user:', error);
      });
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/view-product/${productId}`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/editProduct/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/deleteProduct/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        setListProduct((prevListProduct) =>
          prevListProduct.filter((product) => product.id !== productId)
        );
      } else {
        console.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error delete item:', error);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchResult = listProduct.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      flex: 1,
    },
    { field: 'price', headerName: 'Giá', flex: 1 },
    {
      field: 'view',
      headerName: 'Xem',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewProduct(params.row.id)}>
          <VisibilityIcon sx={{ color: '#00bcd4' }} />
        </IconButton>
      ),
    },
    {
      field: 'edit',
      headerName: 'Sửa',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditProduct(params.row.id)}>
          <EditIcon sx={{ color: '#4caf50' }} />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Xóa',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteProduct(params.row.id)}>
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
            Quản lý sản phẩm
          </Typography>
          <div>
            <Button
              component={Link}
              to='createProduct'
              variant='contained'
              color='secondary'
              startIcon={<AddIcon />}>
              Thêm sản phẩm
            </Button>
          </div>
          <TextField
            label='Tìm kiếm sản phẩm'
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
          {/* <Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Xem</TableCell>
                    <TableCell>Sửa</TableCell>
                    <TableCell>Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProduct
                    .filter((product) =>
                      product.product_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              component="img"
                              alt={product.product_name}
                              src={`http://localhost:8000/api/getCoverImage/${product.id}`}
                              sx={{
                                width: "100px",
                                height: "150px",
                                marginBottom: 2,
                                marginRight: "10px",
                              }}
                            />
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: "bold" }}
                            >
                              {product.product_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{product.count}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <VisibilityIcon sx={{ color: "#00bcd4" }} />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <EditIcon sx={{ color: "#4caf50" }} />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <DeleteIcon sx={{ color: "#f44336" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              count={listProduct.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid> */}
        </Box>
      </Box>
    </div>
  );
}

export default ProductManagement;
