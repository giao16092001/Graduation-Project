import { AppBar, CssBaseline, Drawer, Typography } from '@mui/material';
import React from 'react';

function Toolbar() {
  return (
    <div>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Admin
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Toolbar;
