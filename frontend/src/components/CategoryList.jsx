import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Divider,
  Box,
  Typography,
  ListItemText,
  MenuList,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useCategory } from "../services/useCategory";

const CategoryList = () => {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const listCategories = categories;
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const displayedCategories = showAll
    ? listCategories
    : listCategories.slice(0, 5);

  const handleToggle = () => {
    setExpanded(!expanded);
    setShowAll(!showAll);
  };
  const handleCategoryPage = (id) => {
    navigate(`/category/${id}`);
  };

  return (
    <Box>
      <MenuList>
        <MenuItem>
          <ListItemText
            primary={
              <Typography style={{ fontWeight: "bold", variant: "h2" }}>
                DANH MỤC SẢN PHẨM
              </Typography>
            }
          />
        </MenuItem>
        <Divider />
        {displayedCategories.map((category) => (
          <div key={category.id}>
            <MenuItem onClick={() => handleCategoryPage(category.id)}>
              <ListItemText
                primary={
                  <Typography style={{ fontWeight: "bold", variant: "h3" }}>
                    {category.category_name}
                  </Typography>
                }
              />
            </MenuItem>
            <Divider />
          </div>
        ))}
      </MenuList>
      {listCategories.length > 5 && (
        <div>
          <MenuItem onClick={handleToggle}>
            <ListItemText primary={expanded ? "Thu gọn" : "Xem thêm"} />
          </MenuItem>
          <Divider />
        </div>
      )}
    </Box>
  );
};

export default CategoryList;
