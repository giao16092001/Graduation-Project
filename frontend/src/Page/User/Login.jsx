import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useUser } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();
  const loginUser = async (email, password) => {
    console.log(email, password);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.status === 401) {
        toast.error('Email hoặc mật khẩu sai', {
          autoClose: 2000,
        });
        return;
      }
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      // console.log('User data from API:', userData);
      // sessionStorage.setItem('userData', JSON.stringify(userData));
      // console.log(
      //   'Stored userData in sessionStorage:',
      //   sessionStorage.getItem('userData')
      // );
      return userData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser(email, password);
      console.log('Logged in user:', userData);

      if (userData && userData.user && userData.user.role) {
        console.log('Role:', userData.user.role);
        setUser(userData);

        if (userData.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/homepage');
        }
      } else {
        console.error('Invalid user data returned from server:', userData);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  const paperStyle = { padding: '30px 20px', width: '30%' };
  const avatarStyle = { backgroundColor: '#1bbd7e' };
  const headerStyle = { margin: 0 };
  const marginTop = { marginTop: 30 };
  const gridContainerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Grid container style={gridContainerStyle}>
      <Paper elevation={20} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}></Avatar>
          <h2 style={headerStyle}>Đăng nhập</h2>
          <Typography variant='caption' gutterBottom>
            Vui lòng điền vào biểu mẫu để đăng nhập
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Địa chỉ Email'
            style={marginTop}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            type='password'
            label='Mật khẩu'
            style={marginTop}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
            }}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              style={{ justifyContent: 'center' }}>
              Đăng nhập
            </Button>
          </div>
        </form>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

export default Login;
