import { useCallback } from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const useCart = () => {
  const addToCart = useCallback(async (productId, userId, productName) => {
    try {
      const response = await fetch('http://localhost:8000/api/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, userId }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      toast.success(`Sản phẩm ${productName} đã được thêm vào giỏ hàng`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Lỗi khi thêm sản phẩm vào giỏ hàng: ${error.message}`);
    }
  }, []);
  return { addToCart };
};
