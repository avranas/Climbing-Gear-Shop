import { useEffect, useState } from "react";

//For use in the ProductPage

//Props are a handleSelection function
//A productOption
//Amount in Stock
const QuantitySelection = (props) => {

  const [ options, setOptions ] = useState([]);
  useEffect(() => {
    //Cap at amountInStock
    const newOptions = [];
    for(let i = 1; i <= props.amountInStock; i++) {
      newOptions.push(i);
    }
    setOptions(newOptions);
  }, [props.amountInStock])

  return (
    <div>
      <select
        onChange={props.handleSelection}
        name="quantity"
        id="quantity"
      >
        {
          options.map((i, key) => {
            return <option key={key} value={i}>{i}</option>
          })
        }
      </select>
    </div>
  );
};

export default QuantitySelection;











