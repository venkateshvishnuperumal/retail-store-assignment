import axios from "axios";

const API_BASE =
  "https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products";

export const fetchProducts = async (page) => {
  try {
    const { data } = await axios.get(`${API_BASE}?page=${page}`);
    const products = data.products;
    const categoryMap = {};
    const totalResults = parseInt(data.totalResults, 10);
    products.forEach((product) => {
      const mainCategory = product.main_category || "Others";
      const level1 = product.category_level_1 || "Others";
      const level2 = product.category_level_2 || "Others";

      if (!categoryMap[mainCategory]) {
        categoryMap[mainCategory] = {};
      }

      if (!categoryMap[mainCategory][level1]) {
        categoryMap[mainCategory][level1] = new Set();
      }

      categoryMap[mainCategory][level1].add(level2);
    });

    const parsedCategories = Object.keys(categoryMap).map((mainCategory) => ({
      main_category: mainCategory,
      subcategories: Object.keys(categoryMap[mainCategory]).map((level1) => ({
        category: level1,
        sublevelCategories: Array.from(categoryMap[mainCategory][level1]),
      })),
    }));

    return { products, categories: parsedCategories, totalResults };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], categories: [] };
  }
};
