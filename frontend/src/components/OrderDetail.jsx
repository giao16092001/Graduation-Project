import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from '@mui/material';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import { formatPrice } from '../utils/formatPrice';

const OrderDetail = ({ id }) => {
  // const { id } = useParams();
  const [order, setOrder] = useState(null);
  // const { user } = useUser();
  const steps = [
    { label: 'Chờ xác nhận', icon: <HourglassEmptyIcon /> },
    { label: 'Chờ giao hàng', icon: <ShoppingCartIcon /> },
    { label: 'Đang giao hàng', icon: <LocalShippingIcon /> },
    { label: 'Đã nhận hàng', icon: <CheckCircleIcon /> },
  ];
  const getActiveByStatus = (status) => {
    switch (status) {
      case 0:
        return 0; // Chờ xác nhận
      case 2:
        return 1; // Chờ giao hàng
      case 3:
        return 2; // Đang giao hàng
      case 4:
        return 3; // Đã nhận hàng
      default:
        return null;
    }
  };
  let totalAmount = 0;

  const CustomStepIcon = ({ icon, active }) => {
    const StyledIcon = styled(icon.type)(({ theme }) => ({
      color: active ? theme.palette.warning.main : theme.palette.text.primary,
      fontSize: active ? '40px' : '35px',
    }));
    return <StyledIcon />;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${id}`);
        const orderData = await response.json();
        setOrder(orderData);
        console.log(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  if (order && order.orderitem) {
    order.orderitem.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
  }

  if (!order) {
    return <Typography>Loading...</Typography>;
  }

  const activeStep = getActiveByStatus(order.status);

  return (
    <div>
      {/* <NavBar user={user} /> */}
      <div>
        <Typography variant='h4' gutterBottom>
          Chi tiết đơn hàng
        </Typography>
        <Box sx={{ width: '100%', marginTop: '20px' }}>
          <Typography>
            <span style={{ fontWeight: 'bold' }}>Thời gian đặt hàng:</span>{' '}
            {order.time}
          </Typography>
          {order.status === 1 ? (
            <Typography variant='subtitle1' color='red' fontWeight='bold'>
              Đơn hàng đã bị hủy
            </Typography>
          ) : order.status === 5 ? (
            <Typography variant='subtitle1' color='red' fontWeight='bold'>
              Đơn hàng không thành công
            </Typography>
          ) : (
            <React.Fragment>
              <Typography fontWeight='bold'>Trạng thái đơn hàng:</Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label} completed={index < activeStep}>
                    <StepLabel
                      StepIconComponent={() => (
                        <CustomStepIcon
                          icon={step.icon}
                          active={index === activeStep}
                        />
                      )}>
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </React.Fragment>
          )}
        </Box>
        <Typography variant='subtitle1' gutterBottom fontWeight='bold'>
          Thông tin người nhận:
        </Typography>
        <Typography variant='body1' gutterBottom>
          Tên: {order.name}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Số điện thoại: {order.phone_number}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Địa chỉ giao hàng: {order.address}
        </Typography>
        <Typography variant='body1' gutterBottom marginTop='10px'>
          <span style={{ fontWeight: 'bold' }}> Đơn vị vận chuyển: </span>
          {order.shipping_method}
        </Typography>
        <Typography variant='body1' gutterBottom marginTop='10px'>
          <span style={{ fontWeight: 'bold' }}>Phương thức thanh toán:</span>
          {order.payment_method === 'card' ? (
            <span>Chuyển khoản</span>
          ) : (
            <span>Thanh toán khi nhận hàng</span>
          )}
        </Typography>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant='subtitle1' gutterBottom>
          Chi tiết đơn hàng:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ảnh sản phẩm</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderitem &&
                order.orderitem.map((item, index) => (
                  <TableRow key={index}>
                    {' '}
                    <TableCell>
                      <img
                        src={`http://localhost:8000/api/getCoverImage/${item.product.id}`}
                        alt={item.product.name}
                        style={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider style={{ margin: '20px 0' }} />
        <Typography gutterBottom>
          Tổng tiền hàng: {formatPrice(totalAmount)}đ
        </Typography>
        <Typography gutterBottom>
          Thuế VAT(10%): {formatPrice(order.product_vat)}đ
        </Typography>
        <Typography gutterBottom>
          Phí vận chuyển: {formatPrice(order.shipping_fee)}đ
        </Typography>
        <Typography gutterBottom>
          Thuế VAT phí vận chuyển(10%): {formatPrice(order.shipping_fee * 0.1)}đ
        </Typography>
        <Typography variant='h6'>
          Tổng tiền: {formatPrice(order.total)}đ
        </Typography>
      </div>
    </div>
  );
};

export default OrderDetail;
