import React from 'react';
import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';

const CartContainer = () => {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((state) => state.cart);

  if (amount < 1) {
    return (
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>장바구니</h2>
          <h4 className="empty-cart">항목이 없습니다.</h4>
        </header>
        {/* cart items */}
        {/* cart footer */}
      </section>
    );
  }

  return (
    <section className="cart">
      {/* cart header */}
      <header>
        <h2>장바구니</h2>
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
            총 <span>${total.toFixed(2)}</span>
          </h4>
        </div>
        <button
          className="btn clear-btn"
          onClick={() => dispatch(openModal())}
        >
          비우기
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
