import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; // 이 함수가 cartSlice의 상태를 제어한다.
import modalReducer from './features/modal/modalSlice'; // 이 함수가 modalSlice의 상태를 제어한다.

export const store = configureStore({
  reducer: {
    // key를 cart로 설정했고 이건 자기가 원하는 이름을 지정하는것이다.
    cart: cartReducer,
    modal: modalReducer,
  },
});
