import penniesToUSD from '../../utils/penniesToUSD';
import './OrderSummary.css';

const OrderSummary = (props) => {

  //This also gets
  const shippingFee = 0;
  const estimatedTaxRate = 0.09125;
  const taxes = estimatedTaxRate * props.subTotal;

  return (
    <table id="order-summary" className="styled-box">
      <colgroup>
        <col span="1" style={{width: "70%"}}/>
        <col span="1" style={{width: "15%"}}/>
      </colgroup>
      <thead>
        <tr>
          <th id="order-summary-col-1">Order summary</th>
          <th id="order-summary-col-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Subtotal</td>
          <td>{penniesToUSD(props.subTotal)}</td>
        </tr>
        <tr>
          <td>Shipping & handling</td>
          <td>{penniesToUSD(shippingFee)}</td>
        </tr>
        <tr>
          <td>Estimated taxes</td>
          <td>{penniesToUSD(taxes)}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td><strong> {penniesToUSD(props.subTotal + shippingFee + taxes)}</strong></td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderSummary;











