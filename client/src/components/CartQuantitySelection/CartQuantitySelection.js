import { useEffect, useState } from "react";

//For use in the Cart page

//Props are a handleSelection function
//A cartItem
//A default value
const CartQuantitySelection = (props) => {

  const [ options, setOptions ] = useState([]);
  const [ selection, setSelection ] = useState(props.defaultValue);

  useEffect(() => {
    const amountInStock = props.cartItem.product.productOptions[0].amountInStock;
    //Cap at amountInStock or 99
    const newOptions = [];
    for(let i = 1; i <= amountInStock && i <= 30; i++) {
      newOptions.push(i);
    }
    setOptions(newOptions);
  }, [props.cartItem])

  const handleChange = (e) => {
    setSelection(e.target.value)
    props.handleSelection(e, props.cartItem)
  }
  return (
    <div>
      <p className="option-label">Quantity</p>
      <select
        onChange={handleChange}
        name="quantity"
        id="quantity"
        value={selection}
      >
        {
          options.map((i, key)=> {
            return <option key={key} value={i}>{i}</option>
          })
        }
      </select>
    </div>
  );
};

export default CartQuantitySelection;











