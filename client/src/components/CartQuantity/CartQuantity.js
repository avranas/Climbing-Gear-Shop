import { useEffect, useState } from "react";
import "../Quantity/Quantity.css";

//For use in the Cart page
//Props are a handleSelection function, cartItem, and a default value
const CartQuantity = (props) => {
  const [options, setOptions] = useState([]);
  const [selection, setSelection] = useState(props.defaultValue);

  useEffect(() => {
    const amountInStock =
      props.cartItem.product.productOptions[0].amountInStock;
    //Cap at amountInStock or 99
    const newOptions = [];
    /*
      If another user buys this item which makes this user's cart quantity >
      amountInStock, there won't be an option for defaultValue, so we must set
      the maximum amount of options to whichever value is greatest,
      defaultValue or amountInStock
    */
    let maxOptions = 0;
    if (props.defaultValue > amountInStock) {
      maxOptions = props.defaultValue;
    } else {
      maxOptions = amountInStock;
    }
    for (let i = 1; i <= maxOptions && i <= 30; i++) {
      newOptions.push(i);
    }
    setOptions(newOptions);
  }, [props.cartItem, props.defaultValue]);

  const handleChange = (e) => {
    setSelection(e.target.value);
    props.handleSelection(e, props.cartItem);
  };
  return (
    <div>
      <p className="option-label">Quantity</p>
      <select
        className="form-select form-select-sm quantity-select"
        onChange={handleChange}
        name="quantity"
        id="quantity"
        value={selection}
      >
        {options.map((i, key) => {
          return (
            <option key={key} value={i}>
              {i}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CartQuantity;
