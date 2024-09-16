import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useUser } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/user/${user.user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched user data:', data);
        setUserData({
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
        });
        if (data.avatar) {
          setAvatarURL(data.avatar);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [user.user.id]);

  const useStyles = makeStyles({
    tableRow: {
      '& > td': {
        borderBottom: 'none',
        marginBottom: '10px',
      },
    },
    tableCell: {
      padding: 0,
    },
  });
  const classes = useStyles();
  const handleUpdateUser = () => {
    fetch(`http://localhost:8000/api/user/${user.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        gender: userData.gender,
        date_of_birth: userData.date_of_birth,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('User updated successfully');
          toast.success('Cập nhật thông tin thành công', {
            autoClose: 2000,
          });
        } else {
          throw new Error('Failed to update user');
        }
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setAvatarURL(url);
    setAvatar(file);
  };
  return (
    <div>
      <div
        style={{
          backgroundColor: 'white',
          width: '80%',
          margin: '0 auto',
          height: '100%',
        }}>
        <h1>Thông tin cá nhân</h1>

        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TableContainer style={{ width: '100%' }}>
              <Table>
                <TableBody>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Tên đăng nhập</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='username'
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        required={true}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Email</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='email'
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        required={true}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Số điện thoại</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='phone-number'
                        value={userData.phone_number}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            phone_number: e.target.value,
                          })
                        }
                        required={true}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Ngày sinh</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id='date-of-birth'
                        type='date'
                        value={userData.date_of_birth}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            date_of_birth: e.target.value,
                          })
                        }
                        required={true}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell>
                      <Typography variant='subtitle1'>
                        <b>Giới tính</b>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl component='fieldset'>
                        <RadioGroup
                          row
                          aria-label='gender'
                          name='gender'
                          value={userData.gender}
                          onChange={(e) =>
                            setUserData({ ...userData, gender: e.target.value })
                          }>
                          <FormControlLabel
                            value='male'
                            control={<Radio />}
                            label='Nam'
                          />
                          <FormControlLabel
                            value='female'
                            control={<Radio />}
                            label='Nữ'
                          />
                          <FormControlLabel
                            value='other'
                            control={<Radio />}
                            label='Khác'
                          />
                        </RadioGroup>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell colSpan={2}>
                      <Button
                        onClick={handleUpdateUser}
                        variant='contained'
                        width='50%'>
                        Lưu thông tin
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* <Grid item xs={3}>
            <Typography variant='subtitle1'>
              <b>Thêm ảnh đại diện</b>
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {avatar && (
                <div>
                  <img
                    src={avatarURL}
                    alt='Avatar'
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      border: '4px solid #000',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
              <Input
                type='file'
                id='images'
                accept='image/*'
                // multiple
                onChange={handleAvatarChange}
              />
            </div>
          </Grid> */}
        </Grid>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Profile;
