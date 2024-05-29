import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';

// API에서 로드할 예정인 feature
const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 리듀서의 이름이 카트 비우기
    clearCart: (state) => {
      // 새 상태를 돌려주지 않고 mutation을 할 수 있는 이유?
      // Immer library는 state를 직접 수정할 수 있게 해준다.
      // return { cartItems: [] };
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      if (cartItem.amount > 1) {
        cartItem.amount = cartItem.amount - 1;
      }
    },
  },
});

// console.log(cartSlice);
// 콘솔에서 확인할 수 있듯이 Immer Library를 쓰면 Action과 Payload를 직접 조작할 필요가 없다.

export const { clearCart, removeItem, increase, decrease } = cartSlice.actions; // Action을 export 한다.

export default cartSlice.reducer; // Object.property 구조로 reducer를 export 한다.
