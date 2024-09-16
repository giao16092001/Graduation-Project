import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Box } from '@material-ui/core';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5Q.ttf', // Regular
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxM.ttf', // Bold
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v29/KFOkCnqEu92Fr1Mu51xIIzc.ttf', // Italic
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Roboto',
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    backgroundColor: '#f2f2f2',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    padding: 5,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
  productSection: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});
function calculateTotalAmount(order) {
  let totalAmount = 0;
  if (order.orderitem) {
    order.orderitem.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
  }
  return totalAmount;
}
const InvoicePDF = ({ order }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Đơn hàng #{order.id}</Text>
        <Text style={styles.subtitle}>Thông tin người nhận:</Text>
        <Text style={styles.text}>Tên: {order.name}</Text>
        <Text style={styles.text}>Số điện thoại: {order.phone_number}</Text>
        <Text style={styles.text}>Địa chỉ giao hàng: {order.address}</Text>
        <Text style={styles.text}>Ghi chú: {order.note}</Text>

        <Text style={styles.subtitle}>Chi tiết đơn hàng:</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Tên sản phẩm</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Đơn giá (đ)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Số lượng</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Thành tiền (đ)</Text>
            </View>
          </View>
          {order.orderitem && order.orderitem.length > 0 ? (
            order.orderitem.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.text}>{item.product.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.text}>{item.price.toLocaleString()}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.text}>{item.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.text}>
                    {(item.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.text}>
              Không có sản phẩm nào trong đơn hàng này.
            </Text>
          )}
        </View>

        <Text style={styles.text}>
          Tổng tiền hàng: {calculateTotalAmount(order).toLocaleString()}đ
        </Text>
        <Text style={styles.text}>
          Phí vận chuyển: {order.shipping_fee.toLocaleString()}đ
        </Text>
        <Text style={styles.text}>
          Thuế tiền hàng: {order.product_vat.toLocaleString()}đ
        </Text>
        <Text style={styles.text}>
          Thuế phí vận chuyển: {order.shipping_vat.toLocaleString()}đ
        </Text>

        <Text style={styles.subtitle}>
          Tổng tiền: {order.total.toLocaleString()}đ
        </Text>
      </View>
    </Page>
  </Document>
);
function OrderManagement() {
  const [listOrder, setListOrder] = useState([]);
  const navigate = useNavigate();

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

  const allowedTransitions = {
    0: [1, 2],
    1: [],
    2: [3, 4, 5],
    3: [4, 5],
    4: [],
    5: [],
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/orders`)
      .then((response) => response.json())
      .then((data) => setListOrder(data))
      .catch((error) => console.error('Error fetching list orders:', error));
  }, []);

  const handleChangeStatus = (orderId, newStatus) => {
    fetch(`http://localhost:8000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to update status');
        setListOrder((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleViewOrder = (id) => {
    navigate(`/order-detail/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'time', headerName: 'Thời gian đặt hàng', flex: 1 },
    { field: 'shipping_method', headerName: 'Phương thức giao hàng', flex: 1 },
    { field: 'total', headerName: 'Tổng', flex: 1 },
    {
      field: 'view',
      headerName: 'Xem',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewOrder(params.row.id)}>
          <VisibilityIcon sx={{ color: '#00bcd4' }} />
        </IconButton>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái đơn hàng',
      flex: 1,
      renderCell: (params) => {
        const statusText = statusMapping[params.value] || 'Không xác định';
        const color = statusColorMapping[params.value] || 'black';
        return <span style={{ color }}>{statusText}</span>;
      },
    },
    {
      field: 'print',
      headerName: 'In đơn hàng',
      flex: 1,
      renderCell: (params) => (
        <PDFDownloadLink
          document={<InvoicePDF order={params.row} />}
          fileName={`Invoice_${params.row.id}.pdf`}>
          {({ loading }) => (loading ? 'Đang tạo PDF...' : 'Tải PDF')}
        </PDFDownloadLink>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thay đổi trạng thái',
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(event) =>
            handleChangeStatus(params.row.id, event.target.value)
          }
          sx={{ width: '100%' }}>
          {allowedTransitions[params.row.status].map((status) => (
            <MenuItem key={status} value={status}>
              {statusMapping[status]}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Box display='flex'>
      <Box width={240} flexShrink={0}>
        <Sidebar />
      </Box>
      <Box flexGrow={1} p={3}>
        <Toolbar />
        <Typography variant='h3' gutterBottom align='center'>
          Quản lý đơn hàng
        </Typography>
        <DataGrid
          rows={listOrder}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 15, 20]}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}
export default OrderManagement;
