import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.log('Error fetching categories: ', error.message);
    }
  }, []);

  const addCategory = useCallback(async (category) => {
    try {
      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      toast.success(`Tạo danh mục mới thành công`, {
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(`Lỗi khi tạo danh mục`, {
        autoClose: 2000,
      });
    }
  }, []);

  const updateCategory = useCallback(async (id, category) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/categories/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      toast.success(`Sửa danh mục thành công`, {
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(`Lỗi khi sửa danh mục`, {
        autoClose: 2000,
      });
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/categories/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      toast.success(`Xóa danh mục thành công`, {
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error delete category:', error);
      toast.error(`Không thể xóa danh mục ${id}`, {
        autoClose: 2000,
      });
    }
  }, []);
  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
