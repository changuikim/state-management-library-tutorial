# John Smilga의 [Redux Toolkit Tutorial](https://github.com/john-smilga/redux-toolkit-tutorial)을 보고 따라해보는 저장소입니다.

## 디렉토리 구조

- cartItems.js : 장바구니에 표시할 상품 데이터
- icons.jsx : 장바구니에 표시할 아이콘 데이터

## 절차

### 1 환경설정

```sh
npm install @reduxjs/toolkit react-redux
```

#### @reduxjs/toolkit

consists of few libraries

- redux (core library, state management)
- immer (allows to mutate state)
- redux-thunk (handles async actions)
- reselect (simplifies reducer functions)

#### Extras

- redux devtools
- combine reducers

#### react-redux

connects our app to redux

### 2 스토어 설정

#### Setup Store

Store는 전역 상태를 관리하는 도구입니다.

- create store.js

```js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {},
});
```

reducer 객체에 각각의 reducer 함수를 추가합니다. feature와 actions을 기반으로 reducer 함수를 작성합니다.

#### Setup Provider

- index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import store and provider
import { store } from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

Context API처럼 전체 애플리케이션을 감쌉니다.

### 3 슬라이스 설정

#### Setup Cart Slice

리덕스에서 슬라이스는 reducer와 action을 포함하는 객체입니다.

- application feature
- create features folder/cart
- create cartSlice.js

```js
import { createSlice } from '@reduxjs/toolkit';

// API에서 로드할 예정인 feature
const initialState = {
  cartItems: [],
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
```

- store.js

```js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice'; // 이 함수가 cartSlice의 상태를 제어한다.

export const store = configureStore({
  reducer: {
    // key를 cart로 설정했고 이건 자기가 원하는 이름을 지정하는것이다.
    cart: cartReducer,
  },
});
```

### 4 스토어, 슬라이스의 상태에 접근하기

#### Redux DevTools

- extension

개발자 도구에서 Redux와 관련된 상태 등을 확인할 수 있다.

#### Access store value

- create components/Navbar.js

```js
import { CartIcon } from '../icons';
import { useSelector } from 'react-redux';

const Navbar = () => {
  // selector는 store에 저장된 전체 state를 받아서 필요한 부분만 추출할 수 있다.
  // 특정 property를 추출하는 방식은 자유이다.
  const { amount } = useSelector((state) => state.cart);

  return (
    <nav>
      <div className="nav-center">
        <h3>redux toolkit</h3>
        <div className="nav-container">
          <CartIcon />
          <div className="amount-container">
            <p className="total-amount">{amount}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

#### Hero Icons

- [Hero Icons](https://heroicons.com/)

```css
nav svg {
  width: 40px;
  color: var(--clr-white);
}
```

#### Setup Cart

- cartSlice.js

```js
import cartItems from '../../cartItems';
const initialState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isLoading: true,
};
```

- create CartContainer.js and CartItem.js
- CartContainer.js

```js
import React from 'react';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

const CartContainer = () => {
  const { cartItems, total, amount } = useSelector((state) => state.cart);

  if (amount < 1) {
    return (
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className="empty-cart">is currently empty</h4>
        </header>
      </section>
    );
  }

  return (
    <section className="cart">
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cartItems.map((item) => {
          return (
            <CartItem
              key={item.id}
              {...item}
            />
          );
        })}
      </div>
      {/* cart footer */}
      <footer>
        <hr />
        <div className="cart-total">
          <h4>
            total <span>${total}</span>
          </h4>
        </div>
        <button className="btn clear-btn">clear cart</button>
      </footer>
    </section>
  );
};

export default CartContainer;
```

- CartItems.js
- CartItem.js

```js
import React from 'react';
import { ChevronDown, ChevronUp } from '../icons';

const CartItem = ({ id, img, title, price, amount }) => {
  return (
    <article className="cart-item">
      <img
        src={img}
        alt={title}
      />
      <div>
        <h4>{title}</h4>
        <h4 className="item-price">${price}</h4>
        {/* remove button */}
        <button className="remove-btn">remove</button>
      </div>
      <div>
        {/* increase amount */}
        <button className="amount-btn">
          <ChevronUp />
        </button>
        {/* amount */}
        <p className="amount">{amount}</p>
        {/* decrease amount */}
        <button className="amount-btn">
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
```
