import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Grid, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { makeStyles } from '@mui/styles';
import { useCategory } from '../../services/useCategory';
import { useProduct } from '../../services/useProduct';
import { useParams } from 'react-router-dom';
function EditProduct() {
  const { id } = useParams();
  const [listCategories, setListCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    selectedCategory: '',
    brand: '',
    year_of_manufacture: '',
    dimension: '',
    weight: '',
    warranty: '',
    categories_id: '',
    cover: null,
    images: [],
  });
  const { fetchProduct, productData } = useProduct();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProduct(id);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle error if needed
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const updateProduct = async () => {
    // const formData = new FormData();
    // formData.append('name', product.name);
    // formData.append('description', product.description);
    // formData.append('price', product.price);
    // formData.append('quantity', product.quantity);
    // formData.append('categories_id', product.categories_id);
    // formData.append('brand', product.brand);
    // formData.append('year_of_manufacture', product.year_of_manufacture);
    // formData.append('dimension', product.dimension);
    // formData.append('weight', product.weight);
    // formData.append('warranty', product.warranty);
    // // Append images or cover if needed
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    console.log(product.name);
    const requestData = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories_id: product.categories_id,
      brand: product.brand,
      year_of_manufacture: product.year_of_manufacture,
      dimension: product.dimension,
      weight: product.weight,
      warranty: product.warranty,
      // Append images or cover if needed
    };
    console.log(requestData);
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const result = await response.json();
      console.log('Product updated successfully:', result);
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };
  const { fetchCategories, categories } = useCategory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories();
        // setListCategories(categories); // Không cần set ở đây nữa
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);

  // Sử dụng useEffect để cập nhật listCategories khi categories thay đổi
  useEffect(() => {
    if (categories.length > 0) {
      setListCategories(categories);
    }
  }, [categories]);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/categories');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch categories');
  //       }
  //       const data = await response.json();
  //       setCategories(data);
  //       console.log(categories);
  //     } catch (error) {
  //       console.error('Error fetching categories: ', error.message);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  console.log(categories);
  console.log(listCategories);

  const [coverURL, setCoverURL] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);
  // const handleCoverChange = (e) => {
  //   const file = e.target.files[0];
  //   const url = URL.createObjectURL(file);
  //   setCoverURL(url);
  //   setCover(file);
  // };

  // const handleImagesChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   const newImages = [...images];

  //   files.forEach((file) => {
  //     const url = URL.createObjectURL(file);
  //     newImages.push(file);
  //     imageURLs.push(url);
  //   });

  //   setImages(newImages);
  // };

  const squareStyle = {
    width: '100px',
    height: '100px',
    border: '2px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    cursor: 'pointer',
    position: 'relative',
  };
  const inputImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  };

  const useStyles = makeStyles({
    tableRow: {
      '& > td': {
        borderBottom: 'none',
        marginBottom: '5px',
      },
    },
    tableCell: {
      padding: 0,
    },
  });

  const classes = useStyles();
  const handleRemoveImage = (index) => {
    const newImages = [...imageURLs];
    newImages.splice(index, 1);
    setImageURLs(newImages);
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Grid align='center'>
            <h1>Sửa sản phẩm</h1>
            <TableContainer style={{ width: '90%' }}>
              <Table>
                <TableBody>
                  <TableRow className={classes.tableRow}>
                    <TableCell style={{ width: '25%' }}>
                      <Typography variant='subtitle1'>
                        <b>Tên sản phẩm:</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='name'
                        value={product.name}
                        onChange={(e) =>
                          setProduct({ ...product, name: e.target.value })
                        }
                        required={true}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Mô tả sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='description'
                        value={product.description}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            description: e.target.value,
                          })
                        }
                        required={true}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Giá sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='price'
                        value={product.price}
                        onChange={(e) =>
                          setProduct({ ...product, price: e.target.value })
                        }
                        required={true}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Số lượng sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='quantity'
                        value={product.quantity}
                        onChange={(e) => setProduct(e.target.value)}
                        required={true}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Chọn danh mục sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        label='Danh mục'
                        id='categories_id'
                        value={product.categories_id}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            categories_id: e.target.value,
                          })
                        }
                        required={true}
                        fullWidth>
                        {listCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.category_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Hãng sản xuất</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='brand'
                        value={product.brand}
                        onChange={(e) =>
                          setProduct({ ...product, brand: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Năm sản xuất</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='year-of-manufacture'
                        value={product.year_of_manufacture}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            yearOfManufacture: e.target.value,
                          })
                        }
                        required
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Kích thước sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='dimension'
                        value={product.dimension}
                        onChange={(e) =>
                          setProduct({ ...product, dimension: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Khối lượng sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='weight'
                        value={product.weight}
                        onChange={(e) =>
                          setProduct({ ...product, weight: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Thời gian bảo hành</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='warranty'
                        value={product.warranty}
                        onChange={(e) =>
                          setProduct({ ...product, warranty: e.target.value })
                        }
                        required
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {/* <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Thêm ảnh bìa</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={squareStyle}>
                          <AddIcon style={{ fontSize: 40, color: '#ccc' }} />
                          <Input
                            type='file'
                            id='cover'
                            accept='image/*'
                            onChange={handleCoverChange}
                            style={inputImageStyle}
                          />
                        </div>
                        {cover && (
                          <div>
                            <img
                              src={coverURL}
                              alt='Cover'
                              style={{ maxWidth: '30%', marginTop: '10px' }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Thêm ảnh sản phẩm</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={squareStyle}>
                          <AddIcon style={{ fontSize: 40, color: '#ccc' }} />
                          <Input
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                            onChange={handleImagesChange}
                            style={inputImageStyle}
                          />
                        </div>
                        <div>
                          {imageURLs.map((imageURL, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img
                                src={imageURL}
                                alt={`Other ${index}`}
                                style={{
                                  maxWidth: '100px',
                                  margin: '10px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleRemoveImage(index)}
                              />
                              <IconButton
                                onClick={() => handleRemoveImage(index)}>
                                <DeleteOutlineIcon style={{ color: 'red' }} />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>*/}
                  <TableRow className={classes.tableRow}>
                    <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                      {/* {error && (
                        <Typography variant='body2' color='error' gutterBottom>
                          {error}
                        </Typography>
                      )} */}
                      <Button
                        onClick={updateProduct}
                        variant='contained'
                        style={{ width: '30%', display: 'inline-block' }}>
                        Lưu sản phẩm
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default EditProduct;
