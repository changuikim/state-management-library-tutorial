import { CartIcon } from '../icons';
import { useSelector } from 'react-redux';

const Navbar = () => {
  // selector는 store에 저장된 각 slice의 상태에 접근할 수 있는 함수이다.
  // 특정 property를 추출하는 방식은 자유이다.
  const { amount } = useSelector((store) => store.cart);

  return (
    <nav>
      <div className="nav-center">
        <h3>Redux Toolkit</h3>
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
