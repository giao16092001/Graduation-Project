import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';
import { formatPrice } from '../../utils/formatPrice';

function UserOrder() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useUser();

  const statusMapping = {
    0: 'Chờ xác nhận',
    1: 'Đơn hàng bị hủy',
    2: 'Chờ giao hàng',
    3: 'Đang giao hàng',
    4: 'Giao hàng thành công',
    5: 'Giao hàng không thành công',
  };

  const statusColorMapping = {
    0: 'orange',
    1: 'red',
    2: 'purple',
    3: 'blue',
    4: 'green',
    5: 'gray',
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/getOrderOfUser/${id}`
        );
        const ordersData = await response.json();
        console.log(ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [id]);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredOrders = orders.filter((order) => order.status === selectedTab);

  return (
    // <div style={{ backgroundColor: "#f5f5f5" }}>
    <div>
      <NavBar user={user} />
      <div style={{ width: '80%', margin: '20px auto' }}>
        <Typography variant='h4' gutterBottom>
          Đơn hàng của tôi
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          variant='fullWidth'>
          {Object.entries(statusMapping).map(([key, value]) => (
            <Tab
              key={key}
              label={value}
              value={parseInt(key)}
              style={{ color: statusColorMapping[key] }}
            />
          ))}
        </Tabs>
        {filteredOrders.map((order) => (
          <Link
            key={order.id}
            to={`/order/${order.id}`}
            style={{
              textDecoration: 'none',
              display: 'block',
              marginBottom: '20px',
            }}>
            <TableContainer
              component={Paper}
              style={{
                backgroundColor: '#ffffff',
                padding: '20px',
              }}>
              <Typography
                variant='h6'
                gutterBottom
                style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'inherit' }}>Ngày đặt: {order.time}</span>
                <span style={{ color: statusColorMapping[order.status] }}>
                  {statusMapping[order.status]}
                </span>
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderitem.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{formatPrice(item.product.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatPrice(item.product.price * item.quantity)}đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div>
                <Typography
                  variant='h6'
                  gutterBottom
                  style={{ textAlign: 'left' }}>
                  Tổng tiền: {formatPrice(order.total)}đ
                </Typography>
              </div>
            </TableContainer>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default UserOrder;
