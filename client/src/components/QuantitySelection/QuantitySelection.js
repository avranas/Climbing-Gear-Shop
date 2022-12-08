import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

//For use in the ProductPage

//Props are a handleSelection function
//A productOption
//Amount in Stock
const QuantitySelection = forwardRef((props, _ref) => {

  const [options, setOptions] = useState([]);
  const [selection, setSelection] = useState("");

  useEffect(() => {
    //Cap at amountInStock or 99
    const newOptions = [];
    for(let i = 1; i <= props.amountInStock && i <= 30; i++) {
      newOptions.push(i);
    }
    setOptions(newOptions);
    setSelection(newOptions[0]);
  }, [props.amountInStock, props.disabled])

  const handleChange = (e) => {
    setSelection(e.target.value);
  }

  useImperativeHandle(_ref, () => ({
    getSelection: () => {
      return selection;
    },
  }));


  return (
    <div>
      <select className="form-select form-select-sm quantity-select"
        onChange={handleChange}
        name="quantity"
        id="quantity"
        value={selection}
        disabled={props.disabled}
      > 
        {
          !props.disabled ?
          options.map((i, key) => {
            return <option key={key} value={i}>{i}</option>
          })
          :
          null
        }
      </select>
    </div>
  );
});

export default QuantitySelection;











