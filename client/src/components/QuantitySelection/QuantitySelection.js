import { useEffect, useState } from "react";

//For use in the ProductPage

//Props are a handleSelection function
//A productOption
//Amount in Stock
const QuantitySelection = (props, _ref) => {

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    //Cap at amountInStock or 99
    const newOptions = [];
    for(let i = 1; i <= props.amountInStock && i <= 30; i++) {
      newOptions.push(i);
    }
    setOptions(newOptions);
  }, [props.amountInStock, props.disabled])

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    props.handleSelection(e);
  }

  return (
    <div>
      <select
        onChange={handleChange}
        name="quantity"
        id="quantity"
        value={selectedOption}
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
};

export default QuantitySelection;











