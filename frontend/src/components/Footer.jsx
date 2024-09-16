import React from 'react';
import { Box, Grid, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <div style={{ width: '100%' }}>
      <Box
        bgcolor='primary.main'
        color='white'
        py={4} // Padding trên và dưới của footer
      >
        <Container maxWidth='lg'>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='h6'>Liên hệ</Typography>
              <Typography variant='body2'>
                Địa chỉ: 123 Đường ABC, Thành phố XYZ
              </Typography>
              <Typography variant='body2'>Điện thoại: 0123-456-789</Typography>
              <Typography variant='body2'>
                Email: contact@example.com
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='h6'>Liên kết</Typography>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Trang chủ
              </Link>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Giới thiệu
              </Link>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Sản phẩm
              </Link>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Liên hệ
              </Link>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant='h6'>Thông tin</Typography>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Điều khoản sử dụng
              </Link>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Chính sách bảo mật
              </Link>
              <Link href='#' color='inherit' variant='body2' display='block'>
                Câu hỏi thường gặp
              </Link>
            </Grid>
          </Grid>
          <Typography variant='body2' align='center' mt={4}>
            © 2024 Công ty. Bản quyền đã được bảo hộ.
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default Footer;
