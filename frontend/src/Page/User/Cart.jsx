import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Checkbox,
  CardMedia,
  CardContent,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { red } from '@mui/material/colors';
function Cart() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [listItem, setListItem] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleCheckboxChange = (productId, isChecked) => {
    if (productId === null && isChecked) {
      const allProductIds = listItem.map((item) => item.product.id);
      setSelectedItems(allProductIds);
    } else if (isChecked) {
      setSelectedItems((prevItems) => [...prevItems, productId]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item !== productId)
      );
    }
  };

  const increaseQuantity = async (productId) => {
    const item = listItem.find((item) => item.product.id === productId);
    if (item.product.quantity === item.count) {
      toast.error(
        'Không thể tăng số lượng lên nhiều hơn số lượng sản phẩm hiện có',
        {
          autoClose: 2000,
        }
      );
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/increaseQuantity`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: id,
            productId: productId,
          }),
        },
        [id]
      );

      if (response.ok) {
        setListItem((prevListItem) =>
          prevListItem.map((item) =>
            item.product.id === productId
              ? { ...item, count: item.count + 1 }
              : item
          )
        );
      } else {
        console.error('Failed to increase quantity');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = listItem.find((item) => item.product.id === productId);
    if (item.count === 1) {
      toast.error('Không thể giảm số lượng sản phẩm', {
        autoClose: 2000,
      });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/decreaseQuantity`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: id,
            productId: productId,
          }),
        }
      );

      if (response.ok) {
        setListItem((prevListItem) =>
          prevListItem.map((item) =>
            item.product.id === productId
              ? { ...item, count: item.count - 1 }
              : item
          )
        );
      } else {
        console.error('Failed to decrease quantity');
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/getItemInCart/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API response data:', data);
        setListItem(data);
      })
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  const deleteItem = async (id) => {
    try {
      if (!id) {
        console.error('User information or token missing.');
        return;
      }
      const response = await fetch(
        `http://localhost:8000/api/deleteItemInCart/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   userId: id,
          //   productId: productId,
          // }),
        }
      );
      if (response.ok) {
        setListItem((prevListItem) =>
          prevListItem.filter((item) => item.id !== id)
        );
      } else {
        console.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error delete item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      console.error('Chưa chọn sản phẩm nào');
      toast.error('Vui lòng chọn ít nhất một sản phẩm để đặt hàng', {
        autoClose: 2000,
      });
      return;
    }

    let hasError = false;

    for (const productId of selectedItems) {
      const selectedItem = listItem.find(
        (item) => item.product.id === productId
      );

      if (!selectedItem) {
        console.error(`Không tìm thấy sản phẩm với ID: ${productId}`);
        continue;
      }

      if (selectedItem.count > selectedItem.product.quantity) {
        toast.error(
          `Sản phẩm ${selectedItem.product.name} có số lượng đặt hàng vượt quá số lượng hiện có (${selectedItem.product.quantity}).`,
          {
            autoClose: 2000,
          }
        );
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }
    const updatedSelectedItems = selectedItems.map((productId) => {
      const selectedItem = listItem.find(
        (item) => item.product.id === productId
      );
      return {
        productId: productId,
        count: selectedItem?.count,
        price: selectedItem?.product.price,
      };
    });
    navigate('/order', { state: { selectedItems: updatedSelectedItems } });
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar user={user} />
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          width: '80%',
          margin: '0 auto',
          marginBottom: '70px',
          minHeight: '100vh',
        }}>
        <Typography variant='h4'>Giỏ hàng</Typography>

        <TableContainer style={{ overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedItems.length === listItem.length}
                    onChange={(e) =>
                      handleCheckboxChange(null, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Thành tiền</TableCell>
                <TableCell>Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItem.map((item, index) => (
                <TableRow key={index}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.includes(item.product.id)}
                      onChange={(e) =>
                        handleCheckboxChange(item.product.id, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CardMedia
                        component='img'
                        src={`http://localhost:8000/api/getCoverImage/${item.product.id}`}
                        alt={item.product.product_name}
                        style={{ width: '60px', height: '60px' }}
                      />
                      <CardContent>
                        <Typography variant='h6'>
                          {item.product.name}
                        </Typography>
                      </CardContent>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(item.product.price)}đ</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => decreaseQuantity(item.product.id)}>
                      <RemoveIcon />
                    </IconButton>
                    {item.count}
                    <IconButton
                      onClick={() => increaseQuantity(item.product.id)}>
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {formatPrice(item.product.price * item.count)}đ
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => deleteItem(item.id)}
                      style={{ color: red[500] }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          textAlign: 'right',
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          onClick={handlePlaceOrder}
          style={{ marginLeft: 'auto', marginRight: '90px' }}>
          Đặt hàng
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cart;
