import React, { useEffect, useState } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  InputAdornment,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useUser } from '../context/UserContext';
const NavBar = ({ user, searchQuery }) => {
  const { logout } = useUser();
  const [query, setQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const [count, setCount] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    setQuery(query);
  }, [query]);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.user.id}`);
    handleMenuClose();
  };

  const handleLogoutClick = async () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigate(`/search/${query}`);
    }
  };

  const handleNavigateToCart = () => {
    const userId = user.user.id;
    if (user.user && userId) {
      navigate(`/cart/${userId}`);
    }
  };
  const handleNavigateUserOrder = () => {
    const userId = user.user.id;
    if (user.user && userId) {
      navigate(`/user-order/${userId}`);
    }
  };
  fetch(`http://localhost:8000/api/getCountItem/${user.user.id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed fetch count item');
      }
      return response.json();
    })
    .then((data) => {
      setCount(data.count);
    })
    .catch((error) => {
      console.error('Error fetching shipping method');
    });

  return (
    <Box
      sx={{
        // position: 'fixed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        bgcolor: '#1976d2',
        color: 'white',
        height: '45px',
      }}>
      <Box
        sx={{
          fontSize: '3rem',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/homepage')}>
        TechShop
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '30%',
        }}>
        <InputBase
          placeholder='Tìm kiếm sản phẩm...'
          value={query}
          onChange={handleInputChange}
          sx={{
            padding: '5px 10px',
            borderRadius: '30px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            marginRight: '5px',
            width: '100%',
            marginLeft: '30px',
          }}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                onClick={handleSearch}
                sx={{ padding: 0, marginRight: 1 }}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 30,
        }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleNavigateUserOrder}
          sx={{
            marginLeft: 2,
            backgroundColor: 'white',
            color: 'primary.main',
            marginRight: '30px',
            '&:hover': {
              backgroundColor: 'white',
            },
            '&:focus': {
              backgroundColor: 'white',
            },
            '&:active': {
              backgroundColor: 'white',
            },
          }}>
          Đơn hàng của tôi
        </Button>

        <IconButton
          aria-label='cart'
          onClick={handleNavigateToCart}
          sx={{
            color: 'white',
          }}>
          <Badge badgeContent={count} color='secondary'>
            <ShoppingCartIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>

        <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
          <Avatar
          // alt={user.user.name}
          // src={`https://example.com/${user.user.avatar}`}
          // sx={{ width: 40, height: 40, marginRight: 1, backgroundColor: 'lightblue' }}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          <MenuItem onClick={handleProfileClick}>
            Xem thông tin cá nhân
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default NavBar;
