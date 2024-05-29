import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';

// API에서 로드할 예정인 feature
const initialState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
});

// // { name: "cart", reducer: {…}, actions: {…}, caseReducers: {…}, extraReducers: {…} } from console.log(cartSlice)
// console.log(cartSlice);

export default cartSlice.reducer; // Object.property 구조로 reducer를 export 한다.
