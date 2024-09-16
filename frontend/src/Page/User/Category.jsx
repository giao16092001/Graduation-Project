import { Box, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useUser } from '../../context/UserContext';
import NavBar from '../../components/NavBar';
import CategoryList from '../../components/CategoryList';

function Category() {
  const [listProduct, setListProduct] = useState([]);
  const { user } = useUser();
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/getProductByCategory/${id}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setListProduct(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProduct();
  }, [id]);
  console.log(listProduct);
  return (
    // <div>
    //   <Grid container spacing={2}>
    //     {listProduct.map((product, index) => (
    //       <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
    //         <ProductCard product={product} userId={user.user.id} />
    //       </Grid>
    //     ))}
    //   </Grid>
    // </div>
    //  return (
    <Box>
      <NavBar user={user} />
      <div style={{ backgroundColor: '#f5f5f5' }}>
        <div
          style={{
            width: '90%',
            margin: '0 auto',
            flex: 1,
          }}>
          <Grid style={{ margin: '20px 0' }}>
            <Grid container spacing={4}>
              {listProduct.map((product, index) => (
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
        {/* <Footer /> */}
      </div>
    </Box>
    // );
  );
}

export default Category;
