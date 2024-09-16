import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import ProductCard from '../../components/ProductCard';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import NavBar from '../../components/NavBar';
import CategoryList from '../../components/CategoryList';
import { useProduct } from '../../services/useProduct';

const Homepage = () => {
  const { products } = useProduct();
  const { user } = useUser();
  // const [isUserLoaded, setIsUserLoaded] = useState(false);

  // if (!isUserLoaded) return <div>Loading...</div>;

  return (
    <Box>
      <NavBar user={user} />
      <div style={{ backgroundColor: '#f5f5f5' }}>
        <div
          style={{
            width: '90%',
            margin: '0 auto',
            flex: 1,
          }}>
          <Paper elevation={3} style={{ maxWidth: 250 }}>
            <CategoryList />
          </Paper>

          <Grid style={{ margin: '20px 0' }}>
            <Grid container spacing={4}>
              {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                  {user ? (
                    <ProductCard product={product} userId={user.user.id} />
                  ) : (
                    <Typography>Loading...</Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    </Box>
  );
};

export default Homepage;
