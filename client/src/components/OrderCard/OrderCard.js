import { Link } from "react-router-dom";
import getFullUTCDay from "../../utils/getFullDay";
import penniesToUSD from "../../utils/penniesToUSD";
import "./OrderCard.css";

const productListLimit = 3;

const OrderCard = (props) => {
  return (
    <div id="order-card" className="styled-box styled-link-box">
    <Link to={`/order/${props.order.id}`}>
        <table id="order-header">
          <colgroup>
            <col span="3" style={{ width: "33%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Price</th>
              <th style={{ textAlign: "center" }}>Order placed</th>
              <th style={{ textAlign: "right" }}>Order status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{penniesToUSD(props.order.totalPrice)}</td>
              <td style={{ textAlign: "center" }}>
                {getFullUTCDay(new Date(Number(props.order.timeCreated)))}
              </td>
              <td style={{ textAlign: "right" }}>{props.order.orderStatus}</td>
            </tr>
          </tbody>
        </table>
        <ul id="order-content">
          {props.order.orderItems.map((j, key) => {
            return key === productListLimit &&
              props.order.orderItems.length > productListLimit + 1 ? (
              <div key={key}>
                {
                  <li>{`+${
                    props.order.orderItems.length - productListLimit
                  } more`}</li>
                }
              </div>
            ) : key <= productListLimit ? (
              <div key={key}>
                <li>{j.product.productName}</li>
              </div>
            ) : key === productListLimit ? (
              <div key={key}>
                <li>{j.product.productName}</li>
              </div>
            ) : null;
          })}
        </ul>
      </Link>
    </div>
  );
};

export default OrderCard;
