import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import ProductService from './ProductService';

const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  similarProducts: [],
  applicableCoupons: [],
  availability: null,
  comparison: null,
  filters: {},
  pagination: {},
  isProductLoading: false,
  isProductSuccess: false,
  isProductError: false,
  message: ''
};

// -------------------------------
// Helper
// -------------------------------
const getErrorMessage = (error) =>
  error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong';

// -------------------------------
// Async Thunks
// -------------------------------

// Public
export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, thunkAPI) => {
  try {
    return await ProductService.getAll(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchFeaturedProducts = createAsyncThunk('product/fetchFeatured', async (_, thunkAPI) => {
  try {
    return await ProductService.getFeatured();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProductsByCategory = createAsyncThunk('product/fetchByCategory', async ({ category, params }, thunkAPI) => {
  try {
    return await ProductService.byCategory(category, params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProductById = createAsyncThunk('product/fetchById', async (id, thunkAPI) => {
  try {
    return await ProductService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const searchProducts = createAsyncThunk('product/search', async ({ query, params }, thunkAPI) => {
  try {
    return await ProductService.search(query, params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const checkProductAvailability = createAsyncThunk('product/checkAvailability', async ({ id, params }, thunkAPI) => {
  try {
    return await ProductService.checkAvailability(id, params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const compareProducts = createAsyncThunk('product/compare', async (data, thunkAPI) => {
  try {
    return await ProductService.compare(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// Admin
export const addProduct = createAsyncThunk('product/add', async (data, thunkAPI) => {
  try {
    return await ProductService.add(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateProduct = createAsyncThunk('product/update', async ({ id, data }, thunkAPI) => {
  try {
    return await ProductService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// -------------------------------
// Slice
// -------------------------------
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    RESET_PRODUCT_STATE: (state) => {
      state.isProductLoading = false;
      state.isProductSuccess = false;
      state.isProductError = false;
      state.message = '';
    },
    CLEAR_PRODUCT_DETAILS: (state) => {
      state.product = null;
      state.similarProducts = [];
      state.applicableCoupons = [];
      state.availability = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fulfilled cases
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.filters = action.payload.filters;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.filters = action.payload.filters;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.similarProducts = action.payload.similarProducts;
        state.applicableCoupons = action.payload.applicableCoupons;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(checkProductAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      })
      .addCase(compareProducts.fulfilled, (state, action) => {
        state.comparison = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.product);
        state.isProductSuccess = true;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload.product._id);
        if (index !== -1) state.products[index] = action.payload.product;
        state.isProductSuccess = true;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })

      // Global Matchers
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isProductLoading = true;
          state.isProductError = false;
          state.message = '';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isProductLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isProductLoading = false;
          state.isProductError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { RESET_PRODUCT_STATE, CLEAR_PRODUCT_DETAILS } = productSlice.actions;
export default productSlice.reducer;
