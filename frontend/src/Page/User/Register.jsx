import React, { useState } from 'react';
import { Avatar, Grid, Paper, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from '../../context/UserContext';
const Register = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const registerUser = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered successfully:', data);
        toast.success('Đăng ký tài khoản thành công', {
          autoClose: 2000,
        });

        sessionStorage.setItem('userData', JSON.stringify(data));

        return data;
      } else {
        if (response.status === 422) {
          const errors = data.errors;
          if (errors.email) {
            toast.error(`Email đã được đăng ký: ${errors.email[0]}`, {
              autoClose: 2000,
            });
          }
          if (errors.phoneNumber) {
            toast.error(
              `Số điện thoại đã được đăng ký: ${errors.phoneNumber[0]}`,
              {
                autoClose: 2000,
              }
            );
          }
        } else {
          toast.error(`Lỗi không xác định: ${data.message}`, {
            autoClose: 2000,
          });
        }
        return;
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.', {
        autoClose: 2000,
      });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phoneNumber
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin để đăng ký.', {
        autoClose: 2000,
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự.', {
        autoClose: 2000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp với mật khẩu.', {
        autoClose: 2000,
      });
      return;
    }

    const phoneNumberPattern = /^[0-9]+$/;

    if (!phoneNumberPattern.test(formData.phoneNumber)) {
      toast.error('Số điện thoại không đúng định dạng. Vui lòng nhập lại.', {
        autoClose: 2000,
      });
      return;
    }

    const userData = await registerUser(formData);
    setUser(userData);
    if (userData) {
      navigate('/homepage');
    }
  };
  const paperStyle = { padding: '30px 20px', width: 500, margin: '20px auto' };
  const headerStyle = { margin: 0 };
  const marginTop = { marginTop: 20 };
  const avatarStyle = { backgroundColor: '#1bbd7e' };
  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '100vh' }}>
      <Paper elevation={20} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}></Avatar>
          <h2 style={headerStyle}>Đăng ký</h2>
          {/* <Typography variant="caption">
            
          </Typography> */}
        </Grid>
        <form action=''>
          <TextField
            fullWidth
            name='name'
            label='Tên người dùng'
            style={marginTop}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='email'
            label='Email'
            type='email'
            style={marginTop}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='phoneNumber'
            label='Số điện thoại'
            type='number'
            style={marginTop}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='password'
            type='password'
            label='Mật khẩu'
            style={marginTop}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='confirmPassword'
            type='password'
            label='Xác nhận mật khẩu'
            style={marginTop}
            onChange={handleChange}
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
              style={marginTop}
              onClick={handleSubmit}>
              Đăng ký
            </Button>
          </div>
        </form>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

export default Register;
