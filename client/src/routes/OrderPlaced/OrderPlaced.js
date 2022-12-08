import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadNewestOrder, selectOrder } from "../../slices/orderSlice";
import penniesToUSD from "../../utils/penniesToUSD";
import "./OrderPlaced.css";

const OrderPlaced = (props) => {
  const order = useSelector(selectOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await axios("/authenticated");
      if (!response.data) {
        navigate("/");
      }
    };
    checkAuthentication();

    dispatch(loadNewestOrder());
  }, [dispatch, navigate]);

  return (
    <div className="container" id="order-placed">
      <div id="order-placed-header">
        <div id="green-checkmark"></div>
        <h2>Thank you, your order has been placed.</h2>
      </div>
      <table id="receipt">
        <colgroup>
          <col span="1" style={{ width: "60%" }} />
          <col span="1" style={{ width: "20%" }} />
          <col span="1" style={{ width: "20%", textAlign: "center" }} />
        </colgroup>
        <thead>
          <tr>
            <th id="receipt-col-1">Order summary</th>
            <th className="price-col" id="receipt-col-2">
              Quantity
            </th>
            <th className="price-col" id="receipt-col-3">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {order.data.orderItems.map((i, key) => {
            return (
              <tr key={key}>
                {i.product.optionType === "None" ? (
                  <td>{`${i.product.brandName} ${i.product.productName}`}</td>
                ) : (
                  <td>{`${i.product.brandName} ${i.product.productName} ${i.product.optionType} ${i.optionSelection}`}</td>
                )}
                <td className="price-col">{i.quantity}</td>
                <td className="price-col">{penniesToUSD(i.price)}</td>
              </tr>
            );
          })}
          <tr>
            <td>
              <strong>Subtotal</strong>
            </td>
            <td></td>
            <td className="price-col">
              <strong>{penniesToUSD(order.data.subTotal)}</strong>
            </td>
          </tr>
          <tr>
            <td>Shipping & handling</td>
            <td></td>
            <td className="price-col">{penniesToUSD(order.data.shippingFeeCharged)}</td>
          </tr>
          <tr>
            <td>Sales Tax</td>
            <td></td>
            <td className="price-col">{penniesToUSD(order.data.taxCharged)}</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td></td>
            <td className="price-col">
              <strong>
                {penniesToUSD(
                  order.data.subTotal +
                  order.data.shippingFeeCharged +
                  order.data.taxCharged
                )}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div id="receipt-footer">
        {order.data.deliveryStreetAddress2 ? (
          <p>{`Shipping to ${order.data.deliveryStreetAddress1}, ${order.data.deliveryStreetAddress2}, ${order.data.deliveryCity}, ${order.data.deliveryState} ${order.data.deliveryZipCode} ${order.data.deliveryCountry}`}</p>
        ) : (
          <p>{`Shipping to ${order.data.deliveryStreetAddress1}, ${order.data.deliveryCity}, ${order.data.deliveryState} ${order.data.deliveryZipCode} ${order.data.deliveryCountry}`}</p>
        )}
      </div>
    </div>
  );
};

export default OrderPlaced;
