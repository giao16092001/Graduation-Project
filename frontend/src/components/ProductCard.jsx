import React from 'react';
import { Grid, Paper, Typography, IconButton, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice } from '../utils/formatPrice';
import { addToCart } from '../utils/addToCart';
function ProductCard({ product, userId }) {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    addToCart(product.id, userId, product.name);
  };

  const handleNavigateToProductDetail = () => {
    navigate(`/product-detail/${product.id}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, height: '315px' }}
      onClick={handleNavigateToProductDetail}>
      <Box
        component='img'
        src={`http://localhost:8000/api/getCoverImage/${product.id}`}
        alt={product.name}
        sx={{
          width: '100%',
          height: '250px',
          // maxHeight: '250px',
          margin: '0 auto',
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant='h5' fontWeight='bold'>
            {product.name}
          </Typography>
          <Typography variant='body2' fontWeight='bold' fontSize='14px'>
            {formatPrice(product.price)}đ
          </Typography>
          <Typography variant='body2'>
            Đã bán: {product.sold_quantity}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <IconButton
            onClick={handleAddToCart}
            sx={{
              color: 'red',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            }}>
            <AddShoppingCartIcon />
          </IconButton>
        </Grid>
      </Grid>
      <ToastContainer />
    </Paper>
  );
}

export default ProductCard;
