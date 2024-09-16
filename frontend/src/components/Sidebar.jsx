import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const drawerWidth = 240;
const theme = createTheme();
export default function Sidebar({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
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
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              {
                text: 'Dashboard',
                link: '/dashboard',
                icon: <DashboardIcon />,
              },
              {
                text: 'Người dùng',
                link: '/user-management',
                icon: <PersonIcon />,
              },
              { text: 'Danh mục', link: '/category', icon: <CategoryIcon /> },
              {
                text: 'Sản phẩm',
                link: '/product-management',
                icon: <ShoppingCartIcon />,
              },
              {
                text: 'Đơn hàng',
                link: '/order-management',
                icon: <AssignmentIcon />,
              },
              {
                text: 'Đơn vị vận chuyển',
                link: '/shipping-methods',
                icon: <LocalShippingIcon />,
              },
            ].map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  backgroundColor:
                    location.pathname === item.link ? '#f0f0f0' : 'inherit',
                  color:
                    location.pathname === item.link
                      ? theme.palette.primary.main
                      : 'inherit',
                }}>
                <ListItemButton component={Link} to={item.link}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
