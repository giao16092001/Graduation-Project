import React, { useEffect, useState } from 'react';
import {
  TextField,
  Grid,
  Button,
  Input,
  Select,
  MenuItem,
  Typography,
  Box,
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableBody,
  IconButton,
  Toolbar,
} from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@mui/styles';
import Sidebar from '../../components/Sidebar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [brand, setBrand] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [dimension, setDimension] = useState('');
  const [weight, setWeight] = useState('');
  const [warranty, setWarranty] = useState('');
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const createProduct = async () => {
    if (!name || !description || !price || !quantity || !categories) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm', {
        autoClose: 2000,
      });
      return;
    }

    if (isNaN(parseInt(price)) || isNaN(parseInt(quantity))) {
      toast.error('Giá và số lượng phải là số', {
        autoClose: 2000,
      });
      return;
    }

    if (!cover || !images.every((image) => image instanceof File)) {
      toast.error('Vui lòng chọn hình ảnh cho sản phẩm', {
        autoClose: 2000,
      });
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('categories_id', selectedCategory);
    formData.append('cover', cover);
    formData.append('brand', brand);
    formData.append('year_of_manufacture', yearOfManufacture);
    formData.append('dimension', dimension);
    formData.append('weight', weight);
    formData.append('warranty', warranty);

    images.forEach((image) => formData.append('images[]', image));
    try {
      console.log(formData.entries());

      const response = await fetch('http://localhost:8000/api/createProduct', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      if (response.ok) {
        toast.success('Tạo sản phẩm thành công', {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate('/product-management');
        }, 2000);
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error creating product:', error.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        console.log(categories);
      } catch (error) {
        console.error('Error fetching categories: ', error.message);
      }
    };
    fetchCategories();
  }, [categories]);
  console.log(categories);
  const [coverURL, setCoverURL] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setCoverURL(url);
    setCover(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(file);
      imageURLs.push(url);
    });

    setImages(newImages);
  };

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
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid align='center'>
          <h1>Thêm sản phẩm mới</h1>
          <TableContainer style={{ width: '90%' }}>
            <Table>
              <TableBody>
                <TableRow className={classes.tableRow}>
                  <TableCell
                    style={{ width: '25%' }}
                    className={classes.tableCell}>
                    <Typography variant='subtitle1'>
                      <b>Tên sản phẩm</b>
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ width: '75%' }}
                    className={classes.tableCell}>
                    <TextField
                      id='product-name'
                      onChange={(e) => setName(e.target.value)}
                      required={true}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
                    <Typography variant='subtitle1'>
                      <b>Mô tả sản phẩm</b>
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <TextField
                      id='description'
                      onChange={(e) => setDescription(e.target.value)}
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
                      onChange={(e) => setPrice(e.target.value)}
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
                      onChange={(e) => setQuantity(e.target.value)}
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
                      id='categories'
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required={true}
                      fullWidth>
                      {categories.map((category) => (
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
                      onChange={(e) => setBrand(e.target.value)}
                      required={true}
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
                      onChange={(e) => setYearOfManufacture(e.target.value)}
                      required={true}
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
                      onChange={(e) => setDimension(e.target.value)}
                      required={true}
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
                      onChange={(e) => setWeight(e.target.value)}
                      required={true}
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
                      onChange={(e) => setWarranty(e.target.value)}
                      required={true}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow className={classes.tableRow}>
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
                              // onClick={() => handleRemoveImage(index)}
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
                </TableRow>
                <TableRow className={classes.tableRow}>
                  <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                    <Button
                      onClick={createProduct}
                      variant='contained'
                      style={{ width: '30%', display: 'inline-block' }}>
                      Tạo sản phẩm
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default CreateProduct;
