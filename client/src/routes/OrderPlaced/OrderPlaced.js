import { useSelector } from "react-redux";
import { selectCart } from "../../slices/cartSlice";

const OrderPlaced = (props) => {
  const cart = useSelector(selectCart);

  
  return (
    <div>
      <p>Order placed!</p>
    </div>
  );
};

export default OrderPlaced;











