import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import NavBar from '../../components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import qrImage from '../../img/qr.jpg';
import {
  Box,
  Button,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Grid,
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  LocalShipping,
  LocationOn,
  Payment,
} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Order() {
  const { user } = useUser();
  // console.log(user.user.id);
  const location = useLocation();
  const { selectedItems } = location.state;
  // console.log(selectedItems);
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const [products, setProducts] = useState([]);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [shippingMethod, setShippingMethod] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRequests = selectedItems.map((item) =>
          fetch(`http://localhost:8000/api/products/${item.productId}`)
        );
        const responses = await Promise.all(productRequests);
        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    const fetchAddresses = () => {
      fetch(`http://localhost:8000/api/users/${user.user.id}/addresses`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch addresses');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched addresses:', data);
          setAddresses(data);
        })
        .catch((error) => {
          console.error('Error fetching addresses:', error);
        });
    };
    const fetchShippingMethod = () => {
      fetch(`http://localhost:8000/api/shipping-methods`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch shipping methods');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setShippingMethod(data);
        })
        .catch((error) => {
          console.error('Error fetching methods:', error);
        });
    };
    fetchShippingMethod();
    fetchAddresses();
    fetchProducts();
  }, [selectedItems]);

  const calculateTotalProductPrice = () => {
    let totalPrice = 0;

    selectedItems.forEach((item) => {
      const product = products.find((prod) => prod.id === item.productId);
      // console.log(item.count);
      if (product && product.price) {
        // console.log(product);
        totalPrice += product.price * item.count;
      }
    });
    return totalPrice;
  };
  const calculateTotalPrice = (calculateTotalProductPrice, shippingFee) => {
    const total =
      calculateTotalProductPrice +
      parseInt(calculateTotalProductPrice * 0.1) +
      shippingFee +
      parseInt(shippingFee * 0.1);
    return total;
  };
  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      console.error('Chưa chọn sản phẩm nào');
      toast.error('Vui lòng chọn ít nhất một sản phẩm để đặt hàng', {
        // position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }
    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng để đặt hàng', {
        autoClose: 2000,
      });
      return;
    }

    if (!selectedShippingMethod) {
      toast.error('Vui lòng chọn phương thức vận chuyển để đặt hàng', {
        autoClose: 2000,
      });
      return;
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán để đặt hàng', {
        autoClose: 2000,
      });
      return;
    }
    const confirmOrder = window.confirm(
      'Bạn có chắc chắn muốn đặt hàng không?'
    );
    if (!confirmOrder) {
      toast.info('Đặt hàng đã bị hủy', {
        autoClose: 2000,
      });
      return;
    }
    try {
      // console.log(selectedAddressId);
      const response = await fetch('http://localhost:8000/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.user.id,
          items: selectedItems,
          note: note,
          address_id: selectedAddressId,
          shipping_id: selectedShippingMethod,
          payment_method: paymentMethod,
        }),
      });

      if (response.ok) {
        console.log('Order created successfully');
        toast.success('Đặt hàng thành công', {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate(`/user-order/${user.user.id}`);
        }, 2000);
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleShippingMethodChange = (event) => {
    const selectedMethodId = parseInt(event.target.value);
    setSelectedShippingMethod(selectedMethodId);

    const selectedMethod = shippingMethod.find(
      (method) => method.id === selectedMethodId
    );
    console.log(selectedMethod);
    if (selectedMethod) {
      setShippingFee(selectedMethod.shipping_fee);
      console.log(selectedMethod);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      <NavBar user={user} />
      <Grid
        container
        spacing={2}
        sx={{
          // width: '90%',
          margin: '0 auto',
        }}>
        <Grid item xs={1}>
          <IconButton
            onClick={handleBack}
            aria-label='quay lại'
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'primary.main',
              },
            }}>
            <ArrowBackIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Grid>
        <Grid xs={10} style={{ backgroundColor: 'white', padding: '20px' }}>
          <Typography variant='h4' marginTop='20px'>
            Đặt Hàng
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Đơn giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={`http://localhost:8000/api/getCoverImage/${product.id}`}
                        alt={product.name}
                        style={{ width: '50px', height: '50px' }}
                      />
                    </TableCell>
                    <TableCell style={{ fontSize: '15px' }}>
                      {product.name}
                    </TableCell>
                    <TableCell style={{ fontSize: '15px' }}>
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell style={{ fontSize: '15px' }}>
                      {selectedItems[index].count}
                    </TableCell>
                    <TableCell style={{ fontSize: '15px' }}>
                      {formatPrice(product.price * selectedItems[index].count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <InputLabel style={{ marginTop: '20px' }} htmlFor='note'>
            Ghi chú cho người bán:{' '}
          </InputLabel>
          <TextField
            id='note'
            multiline
            rows={3}
            onChange={(e) => setNote(e.target.value)}
            required={true}
            variant='outlined'
          />
          <br />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
            }}>
            <IconButton style={{ color: 'red' }}>
              <LocationOn />
            </IconButton>
            <InputLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
              Địa chỉ nhận hàng:
            </InputLabel>
          </div>
          <RadioGroup
            value={selectedAddressId}
            onChange={(e) => {
              setSelectedAddressId(e.target.value);
            }}
            style={{ marginLeft: '20px' }}>
            {addresses.map((addr) => (
              <FormControlLabel
                key={addr.id}
                value={addr.id}
                control={<Radio />}
                label={
                  <div>
                    <Typography variant='subtitle1'>
                      {addr.name} | {addr.phone_number}
                    </Typography>
                    <Typography variant='body1'>{addr.address}</Typography>
                  </div>
                }
              />
            ))}
          </RadioGroup>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
            }}>
            <IconButton style={{ color: 'green' }}>
              <LocalShipping />
            </IconButton>
            <InputLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
              Đơn vị vận chuyển
            </InputLabel>
          </div>
          <RadioGroup
            value={selectedShippingMethod}
            onChange={handleShippingMethodChange}
            style={{ marginLeft: '20px' }}>
            {shippingMethod.map((method) => (
              <FormControlLabel
                key={method.id}
                value={method.id}
                control={<Radio />}
                label={
                  <div>
                    <Typography>{method.name}</Typography>
                    <Typography>{method.description}</Typography>
                    <Typography>{method.shipping_fee}</Typography>
                  </div>
                }
              />
            ))}
          </RadioGroup>

          <Box display='flex' alignItems='center' marginTop='10px'>
            <Payment
              style={{ marginRight: '8px', fontSize: '24px', color: 'blue' }}
            />
            <InputLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
              Phương thức thanh toán:
            </InputLabel>
          </Box>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ flexDirection: 'row', marginLeft: '20px' }}>
            <FormControlLabel
              value='cash'
              control={<Radio />}
              label={
                <Grid container alignItems='center'>
                  <AttachMoney style={{ marginRight: '5px' }} />
                  <Typography variant='body1'>
                    Thanh toán khi nhận hàng
                  </Typography>
                </Grid>
              }
            />

            <FormControlLabel
              value='card'
              control={<Radio />}
              label={
                <Grid container alignItems='center'>
                  <CreditCard style={{ marginRight: '5px' }} />
                  <Typography variant='body1'>Chuyển khoản</Typography>
                </Grid>
              }
            />
          </RadioGroup>

          {paymentMethod === 'card' && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={qrImage}
                alt='QR Code'
                style={{ width: '200px', height: '220px' }}
              />
              <p>Nội dung chuyển khoản: Tên người dùng + Số điện thoại</p>
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Grid container>
              <Grid item xs={6}></Grid>

              <Grid item xs={3}>
                <Typography variant='body1'>Tổng tiền hàng:</Typography>
                <Typography variant='body1'>Thuế VAT(10%):</Typography>
                <Typography variant='body1'>Phí vận chuyển:</Typography>
                <Typography variant='body1'>
                  Thuế VAT phí vận chuyển(10%):
                </Typography>
              </Grid>
              <Grid item xs={3} textAlign='right'>
                <Typography variant='body1'>
                  {formatPrice(calculateTotalProductPrice())}đ
                </Typography>
                <Typography variant='body1'>
                  {formatPrice(parseInt(calculateTotalProductPrice() * 0.1))}đ
                </Typography>
                <Typography variant='body1'>
                  {formatPrice(shippingFee)}đ
                </Typography>
                <Typography variant='body1'>
                  {formatPrice(parseInt(shippingFee * 0.1))}đ
                </Typography>
              </Grid>
            </Grid>
            <Typography variant='h5'>
              Tổng thanh toán:
              {formatPrice(
                calculateTotalPrice(calculateTotalProductPrice(), shippingFee)
              )}
              đ
            </Typography>
          </div>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmitOrder}
            sx={{ marginTop: '20px', float: 'right' }}>
            Đặt hàng
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </div>
  );
}

export default Order;
