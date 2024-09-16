import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import OrderDetail from '../../components/OrderDetail';
import { Box, Toolbar } from '@mui/material';

function ViewOrder() {
  const { id } = useParams();
  return (
    <div>
      <div>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <Sidebar />
          </Box>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <OrderDetail id={id} />
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default ViewOrder;
