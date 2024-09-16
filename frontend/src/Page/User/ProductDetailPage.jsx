import React from 'react';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail';
import Footer from '../../components/Footer';

function ProductDetailPage() {
  const { user } = useUser();
  const { id } = useParams();
  return (
    <div>
      <NavBar user={user} />
      <ProductDetail
        id={id}
        style={{ padding: '20px', width: '90%', margin: '0 auto' }}
      />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
