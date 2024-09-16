import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import ProductCard from '../../components/ProductCard';
import { useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';

function Search() {
  const { user } = useUser();
  const { query } = useParams();
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/api/searchProduct?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setError('Không tìm thấy sản phẩm nào');
        } else {
          setError('');
        }
        setSearchResult(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setError('Không tìm thấy sản phẩm nào');
      });

    fetch('http://localhost:8000/api/getBrand')
      .then((response) => response.json())
      .then((data) => setBrand(data))
      .catch((error) => console.error('Error fetching brand:', error));

    fetch('http://localhost:8000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((error) => console.error('Error fetching category:', error));
  }, [query]);

  const handleBrandChange = (event) => {
    const { value } = event.target;
    setSelectedBrands((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value]
    );
  };

  const handleCategoryChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedCategory((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value]
    );
    console.log(selectedCategory);
  };

  const handleFilter = () => {
    let filtered = searchResult;

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategory.includes(product.categories_id)
      );
    }

    if (minPrice) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    setFilteredProducts(filtered);

    if (filtered.length === 0) {
      setError('Không tìm thấy sản phẩm nào');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <NavBar user={user} searchQuery={query} />

      <Grid
        container
        spacing={2}
        sx={{
          width: '90%',
          margin: '0 auto',
          flex: 1,
        }}>
        <Grid
          item
          xs={2}
          // style={{ marginRight: '15px', borderRight: '1px solid #ccc' }}>
          style={{ marginRight: '20px' }}>
          <Typography variant='h6' gutterBottom>
            BỘ LỌC TÌM KIẾM
          </Typography>

          <Typography variant='h6' gutterBottom fontWeight='light'>
            Theo Danh Mục
          </Typography>
          {category.map((category, index) => (
            <div key={index}>
              <FormControlLabel
                control={<Checkbox />}
                label={category.category_name}
                value={category.id}
                onChange={handleCategoryChange}
              />
            </div>
          ))}

          <Typography variant='h6' gutterBottom fontWeight='light'>
            Thương Hiệu
          </Typography>
          {brand.map((brand, index) => (
            <div key={index}>
              <FormControlLabel
                control={<Checkbox />}
                label={brand}
                value={brand}
                onChange={handleBrandChange}
              />
            </div>
          ))}

          <Typography variant='h6' gutterBottom fontWeight='light'>
            Khoảng Giá
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label='Từ'
                type='number'
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                variant='outlined'
                fullWidth
                size='small'
                style={{ marginBottom: '10px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='Đến'
                type='number'
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                variant='outlined'
                fullWidth
                size='small'
                style={{ marginBottom: '10px' }}
              />
            </Grid>
          </Grid>
          <Button variant='contained' onClick={handleFilter}>
            Lọc
          </Button>
        </Grid>

        <Grid item xs={9} style={{ borderLeft: '1px solid #ccc' }}>
          <Grid container spacing={2}>
            {error && (
              <Grid
                container
                justifyContent='center'
                alignItems='center'
                style={{ minHeight: '80vh' }}>
                <Grid item xs={12} alignItems='center'>
                  <Typography variant='h4' fontWeight='light'>
                    {error}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {!error &&
              Array.isArray(filteredProducts) &&
              filteredProducts.map((product, index) => (
                <Grid item xs={4} key={index}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Search;
