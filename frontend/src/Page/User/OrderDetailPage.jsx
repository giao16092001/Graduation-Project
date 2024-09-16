import React from 'react';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';
import OrderDetail from '../../components/OrderDetail';
import { useParams } from 'react-router-dom';
function OrderDetailPage() {
  const { user } = useUser();
  const { id } = useParams();
  return (
    <div>
      <NavBar user={user} />
      <div style={{ width: '90%', margin: '0 auto', paddingTop: '20px' }}>
        <OrderDetail id={id} />
      </div>
    </div>
  );
}

export default OrderDetailPage;
