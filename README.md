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

### 5 리듀서 설정

#### First Reducer

- cartSlice.js
- Immer library

```js
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 리듀서의 이름이 카트 비우기
    clearCart: (state) => {
      // 새 상태를 돌려주지 않고 mutation을 할 수 있는 이유?
      // Immer library는 state를 직접 수정할 수 있게 해준다.
      state.cartItems = [];
    },
  },
});

export const { clearCart } = cartSlice.actions;
```

- create action

```js
// Immer library를 사용한다면 액션과 페이로드를 굳이 설정하지 않아도 된다.
const ACTION_TYPE = 'ACTION_TYPE';
const actionCreator = (payload) => {
  return { type: ACTION_TYPE, payload: payload };
};
```

- CartContainer.js

```js
import React from 'react';
import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';

const CartContainer = () => {
  const dispatch = useDispatch();

  return (
    <button
      className="btn clear-btn"
      onClick={() => {
        dispatch(clearCart());
      }}
    >
      clear cart
    </button>
  );
};

export default CartContainer;
```

#### Remove, Increase, Decrease

- cartSlice.js

```js
import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
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
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
```

- CartItem.js

```js
import React from 'react';
import { ChevronDown, ChevronUp } from '../icons';
import { useDispatch } from 'react-redux';
import { removeItem, increase, decrease } from '../features/cart/cartSlice';

const CartItem = ({ id, img, title, price, amount }) => {
  const dispatch = useDispatch();

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
        <button
          className="remove-btn"
          onClick={() => {
            dispatch(removeItem(id));
          }}
        >
          remove
        </button>
      </div>
      <div>
        {/* increase amount */}
        <button
          className="amount-btn"
          onClick={() => {
            dispatch(increase({ id }));
          }}
        >
          <ChevronUp />
        </button>
        {/* amount */}
        <p className="amount">{amount}</p>
        {/* decrease amount */}
        <button
          className="amount-btn"
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(id));
              return;
            }
            dispatch(decrease({ id }));
          }}
        >
          <ChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
```

- App.js

```js
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import { useSelector, useDispatch } from 'react-redux';
import { calculateTotals } from './features/cart/cartSlice';

function App() {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  return (
    <main>
      <Navbar />
      <CartContainer />
    </main>
  );
}

export default App;
```

### 6 모달 생성

#### Modal

- create components/Modal.js

```js
const Modal = () => {
  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>장바구니의 모든 항목을 삭제하시겠습니까?</h4>
        <div className="btn-container">
          <button
            type="button"
            className="btn confirm-btn"
          >
            확인
          </button>
          <button
            type="button"
            className="btn clear-btn"
          >
            취소
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;
```

- App.js

```js
return (
  <main>
    <Modal />
    <Navbar />
    <CartContainer />
  </main>
);
```

#### modal slice

- create features/modal/modalSlice.js

```js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
    },
    closeModal: (state, action) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
```

- App.js

```js
const { isOpen } = useSelector((state) => state.modal);

return (
  <main>
    {isOpen && <Modal />}
    <Navbar />
    <CartContainer />
  </main>
);
```

#### toggle modal

- CartContainer.js

```js
import { openModal } from '../features/modal/modalSlice';

return (
  <button
    className="btn clear-btn"
    onClick={() => {
      dispatch(openModal());
    }}
  >
    clear cart
  </button>
);
```

- Modal.js

```js
import { closeModal } from '../features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';

const Modal = () => {
  const dispatch = useDispatch();

  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>장바구니의 모든 항목을 삭제하시겠습니까?</h4>
        <div className="btn-container">
          <button
            type="button"
            className="btn confirm-btn"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            확인
          </button>
          <button
            type="button"
            className="btn clear-btn"
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            취소
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Modal;
```

### 7 Redux-Thunk를 사용한 비동기 처리

#### async functionality with createAsyncThunk

Fetch를 테스트하기 위해 해당 API를 사용한다.

- [Course API](https://course-api.com/)
- https://course-api.com/react-useReducer-cart-project

- cartSlice.js
- action type
- callback function
- lifecycle actions

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const url = 'https://course-api.com/react-useReducer-cart-project';

// 액션 타입과 콜백 함수를 전달한다.
// 콜백 함수는 프로미스를 반환한다.
export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(error));
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  extraReducers: {
    // 생명주기 액션이 들어있다.
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state) => {
      // 네트워크 통신 장애가 발생할 경우
      state.isLoading = false;
    },
  },
});
```

- App.js

```js
import { calculateTotals, getCartItems } from './features/cart/cartSlice';

function App() {
  const { cartItems, isLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    // 통신이 성공적이라면 state에 값을 설정할 수 있다.
    dispatch(getCartItems());
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <main>
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </main>
  );
}
export default App;
```

#### Options

```sh
npm install axios
```

- cartSlice.js

```js
export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (name, thunkAPI) => {
    try {
      // console.log(name);
      // console.log(thunkAPI);
      // console.log(thunkAPI.getState());
      // thunkAPI.dispatch(openModal());
      const resp = await axios(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong');
    }
  }
);
```

#### The extraReducers "builder callback" notation

cart/cartSlice

```js
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});
```
