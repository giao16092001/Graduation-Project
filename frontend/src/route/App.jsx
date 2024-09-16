import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import { useUser } from '../context/UserContext';

import CreateProduct from '../Page/Admin/CreateProduct';
import Homepage from '../Page/User/Homepage';
import Search from '../Page/User/Search';
import Dashboard from '../Page/Admin/Dashboard';
import Login from '../Page/User/Login';
import Register from '../Page/User/Register';
import Cart from '../Page/User/Cart';
import Category from '../Page/User/Category';
import Order from '../Page/User/Order';
import UserOrder from '../Page/User/UserOrder';

import EditProduct from '../Page/Admin/EditProduct';
import CategoryManagement from '../Page/Admin/CategoryManagement';
import Address from '../Page/User/Address';
import ShippingMethod from '../Page/Admin/ShippingMethod';
import OrderManagement from '../Page/Admin/OrderManagement';
import UserTabs from '../Page/User/UserTab';
import UserManagement from '../Page/Admin/UserManagement';
import ProductManagement from '../Page/Admin/ProductManagement';
import ViewOrder from '../Page/Admin/ViewOrder';
import OrderDetailPage from '../Page/User/OrderDetailPage';
import ProductDetailPage from '../Page/User/ProductDetailPage';
import ViewProductDetail from '../Page/Admin/ViewProductDetail';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(user.user.role)) {
    console.log(user);
    console.log(user.user.role);
    return <Navigate to='/not-authorized' replace />;
  }

  return element;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          <Route path='/search/:query' element={<Search />} />
          <Route
            path='/homepage'
            element={
              <ProtectedRoute element={<Homepage />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/cart/:id'
            element={
              <ProtectedRoute element={<Cart />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/shipping-methods'
            element={
              <ProtectedRoute
                element={<ShippingMethod />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/product-management/createProduct'
            element={
              <ProtectedRoute
                element={<CreateProduct />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute
                element={<Dashboard />}
                allowedRoles={['admin']}
              />
            }
          />

          <Route
            path='/order'
            element={
              <ProtectedRoute element={<Order />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/order/:id'
            element={
              <ProtectedRoute
                element={<OrderDetailPage />}
                allowedRoles={['user']}
              />
            }
          />
          <Route
            path='/order-management'
            element={
              <ProtectedRoute
                element={<OrderManagement />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/order-detail/:id'
            element={
              <ProtectedRoute
                element={<ViewOrder />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/product-detail/:id'
            element={
              <ProtectedRoute
                element={<ProductDetailPage />}
                allowedRoles={['user']}
              />
            }
          />
          <Route
            path='/category/:id'
            element={
              <ProtectedRoute element={<Category />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/user-order/:id'
            element={
              <ProtectedRoute element={<UserOrder />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/user-management'
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/product-management'
            element={
              <ProtectedRoute
                element={<ProductManagement />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/editProduct/:id'
            element={
              <ProtectedRoute
                element={<EditProduct />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/profile/:id'
            element={
              <ProtectedRoute element={<UserTabs />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/category'
            element={
              <ProtectedRoute
                element={<CategoryManagement />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/:id/address'
            element={
              <ProtectedRoute element={<Address />} allowedRoles={['user']} />
            }
          />
          <Route
            path='/view-order/:id'
            element={
              <ProtectedRoute
                element={<ViewProductDetail />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path='/view-product/:id'
            element={
              <ProtectedRoute
                element={<ViewProductDetail />}
                allowedRoles={['admin']}
              />
            }
          />

          <Route path='/not-authorized' element={<div>Not Authorized</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
