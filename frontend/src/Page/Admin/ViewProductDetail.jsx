import React from 'react';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail';
import Sidebar from '../../components/Sidebar';
import { Box, Toolbar } from '@mui/material';

function ViewProductDetail() {
  const { id } = useParams();
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <Sidebar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <ProductDetail
            id={id}
            style={{ padding: '20px', width: '90%', margin: '0 auto' }}
          />
        </Box>
      </Box>
    </div>
  );
}

export default ViewProductDetail;
