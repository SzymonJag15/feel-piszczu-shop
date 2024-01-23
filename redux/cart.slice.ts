import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { API_STORE_URL_WC } from '../services/woocommerceApi';
import { getCookie } from "cookies-next";

interface IAddToCartProps {
  id: number;
  quantity?: number;
}

export const getCart: any = createAsyncThunk('cart/getCart', async () => {
  const cartToken = getCookie('cart-token') as string;

  const response = await fetch(`${API_STORE_URL_WC}/cart`, {
    method: 'GET',
    headers: {
      "Cart-Token": cartToken,
    },
  }).then((respond) => respond.json());
  
  return response;
})

export const addToCart: any = createAsyncThunk('cart/addToCart', async (items: IAddToCartProps[]) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;
  let response;

  if (items.length > 1) {
    const { responses } = await fetch(`${API_STORE_URL_WC}/batch`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
        'Nonce': nonce
      },
      body: JSON.stringify({
        requests: items.map((id: IAddToCartProps) => ({
          "path": "/wc/store/v1/cart/add-item",
          "method": "POST",
          "body": {
            "id": id,
            "quantity": 1
          },
          "headers": {
            "Content-Type": "application/json",
            "Cart-Token": cartToken,
            'Nonce': nonce
          }
        }))
      }),
    }).then((respond) => respond.json());

    response = responses[responses.length - 1].body
  } else {
    response = await fetch(`${API_STORE_URL_WC}/cart/add-item`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
        'Nonce': nonce
      },
      body: JSON.stringify({
        id: items[0],
        quantity: 1,
      }),
    }).then((respond) => respond.json());
  }

  return response;
})

export const removeFromCart: any = createAsyncThunk('cart/removeFromCart', async (key: any) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;

  const formData = new FormData();
  Object.entries({key: key}).forEach(([dataKey, dataValue]) => {
    formData.append(dataKey, dataValue.toString());
  });

  const response = await fetch(`${API_STORE_URL_WC}/cart/remove-item`, {
    method: 'POST',
    headers: {
      "Cart-Token": cartToken,
      'Nonce': nonce
    },
    body: formData,
  }).then((respond) => respond.json()
  );
  
  return response;
})

export const updateCart: any = createAsyncThunk('cart/updateCart', async (item: any) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;

  const formData = new FormData();
  Object.entries({key: item.toDelete, quantity: item.quantity - 1}).forEach(([dataKey, dataValue]) => {
    formData.append(dataKey, dataValue.toString());
  });

  const response = await fetch(`${API_STORE_URL_WC}/cart/update-item`, {
    method: 'POST',
    headers: {
      "Cart-Token": cartToken,
      'Nonce': nonce
    },
    body: formData,
  }).then((respond) => respond.json()
  );
  
  return response;
})

export const clearCart: any = createAsyncThunk('cart/clearCart', async (key: string) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;

  const response = await fetch(`${API_STORE_URL_WC}/cart/items`, {
    method: 'DELETE',
    headers: {
      "Cart-Token": cartToken,
      'Nonce': nonce
    },
  }).then((respond) => respond.json()
  );
  
  return response;
})

export const addCoupon: any = createAsyncThunk('cart/addCoupon', async (data: any) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;

  const response = await fetch(`${API_STORE_URL_WC}/cart/apply-coupon`, {
    method: 'POST',
    headers: {
      "Cart-Token": cartToken,
      'Nonce': nonce
    },
    body: data,
  }).then((respond) => respond.json());
  
  return response;
})

export const removeCoupon: any = createAsyncThunk('cart/removeCoupon', async (data: any) => {
  const cartToken = getCookie('cart-token') as string;
  const nonce = getCookie('nonce') as string;

  const response = await fetch(`${API_STORE_URL_WC}/cart/remove-coupon`, {
    method: 'POST',
    headers: {
      "Cart-Token": cartToken,
      'Nonce': nonce
    },
    body: data,
  }).then((respond) => respond.json());
  
  return response;
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: {},
    currentProductTitle: null,
    productVariantSelected: [],
    cartModalVisible: false,
    deleteProductLoading: false,
    addToCartLoading: 'idle',
    cartLoading: 'idle',
    loading: 'idle',
    error: null,
    couponError: null
  } as any,
  reducers: {
    showModalVisible: (state) => {
      state.cartModalVisible = true
    },
    hideModalVisible: (state) => {
      state.cartModalVisible = false
    },
    selectProductVariant: (state, action) => {
      if (state.productVariantSelected.includes(action.payload)) {
        state.productVariantSelected = state.productVariantSelected.filter((id: number) => id !== action.payload)
        return
      }

      state.productVariantSelected.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      if (state.loading === 'idle') {
        state.cartLoading = 'pending'
      }
    }),
    builder.addCase(getCart.fulfilled, (state, action) => {
      if (state.cartLoading === 'pending') {
        state.cart = action.payload
        state.cartLoading = 'idle'
      }
    }),
    builder.addCase(getCart.rejected, (state) => {
      if (state.cartLoading === 'pending') {
        state.cartLoading = 'idle'
        state.error = 'Error occured'
      }
    }),
      
    
    builder.addCase(clearCart.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    }),
    builder.addCase(clearCart.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        state.cart.items = []
        state.cart.coupons = []
        state.loading = 'idle'
      }
    }),
    builder.addCase(clearCart.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    }),
      
      
    builder.addCase(addToCart.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
        state.addToCartLoading = 'pending'
      }
    }),
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        if (action.payload?.data?.status === 400) {
          state.addToCartLoading = 'idle'
          state.error = action.payload.message;
          return;
        }

        state.cart = action.payload
        state.productVariantSelected = []
        state.cartModalVisible = true
        state.error = null
        state.loading = 'idle'
        state.addToCartLoading = 'idle'
      }
    }),
    builder.addCase(addToCart.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.addToCartLoading = 'idle'
        state.error = 'Error occured'
      }
    })


    builder.addCase(removeFromCart.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.deleteProductLoading = true;
      }
    }),
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        if (action.payload?.data?.status === 409) {
          state.error = action.payload.message;
          return;
        }

        state.cart = action.payload
        state.error = null;
        state.deleteProductLoading = false
        state.loading = 'idle'
      }
    }),
    builder.addCase(removeFromCart.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    }),
      
      
    builder.addCase(updateCart.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.deleteProductLoading = true;
      }
    }),
    builder.addCase(updateCart.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        if (action.payload?.data?.status === 409) {
          state.error = action.payload.message;
          return;
        }
        
        state.cart = action.payload;
        state.error = null;
        state.deleteProductLoading = false
        state.loading = 'idle'
      }
    }),
    builder.addCase(updateCart.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    }),

      
    builder.addCase(addCoupon.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    }),
    builder.addCase(addCoupon.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        if (action.payload?.data?.status === 400) {
          state.couponError = action.payload.message;
          return;
        }

        state.cart = action.payload
        state.couponError = null;
        state.loading = 'idle'
      }
    }),
    builder.addCase(addCoupon.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    })

    
    builder.addCase(removeCoupon.pending, (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    }),
    builder.addCase(removeCoupon.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        if (action.payload?.data?.status === 400) {
          state.couponError = action.payload.message;
          return;
        }

        state.cart = action.payload
        state.loading = 'idle'
      }
    }),
    builder.addCase(removeCoupon.rejected, (state) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    })
  },
});

export const cartReducer = cartSlice.reducer;

export const { showModalVisible, hideModalVisible, selectProductVariant} = cartSlice.actions;