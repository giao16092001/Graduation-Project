import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, AppBar, Toolbar } from '@mui/material';
import {
  PeopleAlt,
  Store,
  MonetizationOn,
  ShoppingCart,
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { useUser } from '../../context/UserContext';
import { formatPrice } from '../../utils/formatPrice';
import { PieChart } from '@mui/x-charts/PieChart';
export default function Dashboard() {
  const { setUser, user } = useUser();
  const [count, setCount] = useState({
    userCount: 0,
    productCount: 0,
    totalRevenue: 0,
    orderCount: 0,
  });

  const getStatusLabel = (statusId) => {
    const statusLabels = {
      0: 'Chờ xác nhận',
      1: 'Đơn hàng bị hủy',
      2: 'Chờ giao hàng',
      3: 'Đang giao hàng',
      4: 'Giao hàng thành công',
      5: 'Giao hàng không thành công',
    };
    return statusLabels[statusId] || `Unknown Status ${statusId}`;
  };
  const getstatusPaymentLabels = (method) => {
    const statusLabels = {
      cash: 'Thanh toán khi nhận hàng',
      card: 'Chuyển khoản',
    };
    return statusLabels[method] || `Unknown Status ${method}`;
  };
  const getStatusColor = (statusId) => {
    const statusColorMapping = {
      0: 'orange',
      1: 'red',
      2: 'purple',
      3: 'blue',
      4: 'green',
      5: 'gray',
    };

    return statusColorMapping[statusId] || 'black';
  };
  const [pieData, setPieData] = useState([]);
  const [pie2Data, setPie2Data] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/getStatusOrderCount'
        );
        const data = await response.json();
        const transformedData = data.map((item) => ({
          value: item.count,
          label: getStatusLabel(item.id),
          color: getStatusColor(item.id),
          count: item.count,
        }));

        setPieData(transformedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/getPaymentMethodCount'
        );
        const data = await response.json();
        const transformedData = data.map((item) => ({
          value: item.count,
          label: getstatusPaymentLabels(item.payment_method),
          // count: item.count,
        }));

        setPie2Data(transformedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchPaymentData();
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCount = () => {
      fetch('http://localhost:8000/api/getCount')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            setCount(data.data);
            console.log(data.data);
          } else {
            console.error('Error in response data: ', data.message);
          }
        })
        .catch((error) => {
          console.error('Fetch error: ', error);
        });
    };

    fetchCount();
  }, [setUser]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position='fixed'
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant='h6' noWrap component='div'>
              Admin
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Typography variant='h4' gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{ padding: '16px', backgroundColor: '#f3f3f3' }}>
              <PeopleAlt fontSize='large' sx={{ color: '#3f51b5' }} />
              <Typography variant='h6' gutterBottom>
                Người dùng
              </Typography>
              <Typography variant='h4' gutterBottom>
                {count.userCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{ padding: '16px', backgroundColor: '#f3f3f3' }}>
              <Store fontSize='large' sx={{ color: '#9c27b0' }} />
              <Typography variant='h6' gutterBottom>
                Sản phẩm
              </Typography>
              <Typography variant='h4' gutterBottom>
                {count.productCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{ padding: '16px', backgroundColor: '#f3f3f3' }}>
              <MonetizationOn fontSize='large' sx={{ color: '#e91e63' }} />
              <Typography variant='h6' gutterBottom>
                Doanh thu
              </Typography>
              <Typography variant='h4' gutterBottom>
                {formatPrice(count.totalRevenue)}đ
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{ padding: '16px', backgroundColor: '#f3f3f3' }}>
              <ShoppingCart fontSize='large' sx={{ color: '#ff9800' }} />
              <Typography variant='h6' gutterBottom>
                Đơn hàng
              </Typography>
              <Typography variant='h4' gutterBottom>
                {count.orderCount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: '30px' }}>
          <Grid xs={6}>
            <PieChart
              series={[
                {
                  data: pieData,
                  colorAccessor: (datum) => datum.data.color,
                  labelAccessor: (datum) =>
                    `${datum.data.label} (${datum.data.count})`,
                },
              ]}
              width={650}
              height={200}
              style={{ margin: '0' }}
            />
          </Grid>
          <Grid xs={6}>
            <PieChart
              series={[
                {
                  data: pie2Data,
                  colorAccessor: (datum) => datum.data.color,
                  labelAccessor: (datum) =>
                    `${datum.data.label} (${datum.data.count})`,
                },
              ]}
              width={650}
              height={200}
            />
          </Grid>
        </Grid>
        {/* <PieChart
          series={[
            {
              data: pieData,
              colorAccessor: (datum) => datum.data.color,
              labelAccessor: (datum) =>
                `${datum.data.label} (${datum.data.count})`,
            },
          ]}
          width={700}
          height={200}
        /> */}
      </Box>
    </Box>
  );
}
