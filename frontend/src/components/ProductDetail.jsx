import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProduct } from '../services/useProduct';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function ProductDetail({ id }) {
  const { user } = useUser();

  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [smallImages, setSmallImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const userId = user.user.id;
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/api/products/${id}`
  //       );
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setProduct(data);
  //     } catch (error) {
  //       console.error('Error fetching product:', error);
  //     }
  //   };

  //   fetchProduct();
  // }, [id]);
  const { productData, fetchProduct } = useProduct();
  useEffect(() => {
    fetchProduct(id);
  }, [id]);
  useEffect(() => {
    if (productData) {
      setProduct(productData);
      console.log(productData);
    }
  }, [productData]);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/getProductImage/${id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSmallImages(data);
        if (data.length > 0) {
          setMainImage(data[0]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [id]);
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      console.log({ productId: product.id, userId: userId });
      const response = await fetch('http://localhost:8000/api/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, userId: userId }),
      });
      if (response.ok) {
        console.log(`Sản phẩm ${product.name} đã được thêm vào giỏ hàng`);
        toast.success(`Sản phẩm ${product.name} đã được thêm vào giỏ hàng`, {
          // position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        console.error(
          'Thêm sản phẩm vào giỏ hàng không thành công:',
          response.statusText
        );
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.message);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{
          // width: '90%',
          margin: '0 auto',
          marginBottom: '100px',
          marginTop: '20px',
        }}>
        <Grid item xs={1}>
          <IconButton
            onClick={handleBack}
            aria-label='quay lại'
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'primary.main',
              },
            }}>
            <ArrowBackIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Grid>
        <Grid item xs={5}>
          <img
            src={mainImage || `http://localhost:8000/api/getCoverImage/${id}`}
            alt={product.name}
            style={{
              width: '450px',
              height: '350px',
              // width: '90%',
              // height: 'auto',
              margin: '0 auto',
              display: 'block',
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '0px',
              boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
            }}
          />
          <Grid container spacing={2} justifyContent='center' marginTop='5px'>
            <Grid item>
              {/* <img
                src={`http://localhost:8000/api/getCoverImage/${id}`}
                alt={product.name}
                style={{
                  height: '100px',
                  width: '100px',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                  borderRadius: '0px',
                  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  margin: '5px',
                }}
                onClick={() =>
                  setMainImage(`http://localhost:8000/api/getCoverImage/${id}`)
                }
              /> */}
            </Grid>
            {smallImages.map((image, index) => (
              <Grid item key={index}>
                <img
                  src={image}
                  alt={product.name}
                  style={{
                    height: '100px',
                    width: '100px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '0px',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImageClick(image)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <TableContainer component={Paper}>
            <Table aria-label='product details table'>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant='h4' gutterBottom fontWeight='bold'>
                      {product?.name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ width: '30%' }}>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Thương hiệu:
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: '70%', fontSize: '1.1rem' }}>
                    {product?.brand}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Năm sản xuất:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.year_of_manufacture}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Kích thước:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.dimension}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Trọng lượng:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.weight}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Bảo hành:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.warranty}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Mô tả:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.description}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      style={{
                        fontSize: '1.1rem',
                      }}>
                      Số lượng sản phẩm:
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '1.1rem',
                    }}>
                    {product?.quantity}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography variant='h6' color='primary'>
                      Giá: {product.price} VND
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {user.user.role === 'user' && (
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddToCart}
              sx={{
                mt: 2,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'secondary.main',
                },
              }}>
              Thêm vào giỏ hàng
            </Button>
          )}
        </Grid>
      </Grid>

      <ToastContainer />
    </div>
  );
}

export default ProductDetail;
