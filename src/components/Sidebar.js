import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Sidebar = ({ categories, onCategoryChange }) => {
  const [openCategories, setOpenCategories] = useState({});

  const handleToggleCategory = (mainCategory) => {
    setOpenCategories((prev) => ({
      ...prev,
      [mainCategory]: !prev[mainCategory],
    }));
  };

  const handleCategoryClick = (categoryPath) => {
    onCategoryChange(categoryPath);
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <div style={{ padding: "20px" }}>
        <Typography variant="h6">Filter by Category</Typography>
        <List>
          {categories.map(({ main_category, subcategories }) => (
            <div key={main_category}>
              <ListItem
                button
                onClick={() => handleToggleCategory(main_category)}
              >
                <ListItemText primary={main_category} />
                {openCategories[main_category] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>
              <Collapse
                in={openCategories[main_category]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {subcategories.map(({ category, sublevelCategories }) => (
                    <div key={category}>
                      <ListItem
                        button
                        sx={{ pl: 4 }}
                        onClick={() =>
                          handleCategoryClick([main_category, category])
                        }
                      >
                        <ListItemText primary={category} />
                      </ListItem>
                      {sublevelCategories.map((subCategory) => (
                        <ListItem
                          button
                          key={subCategory}
                          sx={{ pl: 6 }}
                          onClick={() =>
                            handleCategoryClick([
                              main_category,
                              category,
                              subCategory,
                            ])
                          }
                        >
                          <ListItemText primary={subCategory} />
                        </ListItem>
                      ))}
                    </div>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
