import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loadOrder, selectOrder } from "../../slices/orderSlice";
import getFullUTCDay from "../../utils/getFullDay";
import penniesToUSD from "../../utils/penniesToUSD";
import "./OrderDetailsPage.css";

const OrderDetailsPage = (props) => {
  const { id } = useParams();
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
    dispatch(loadOrder(id));
  }, [dispatch, navigate, id]);

  return (
    <div className="container col-8" id="order-details-page">
      <h2>Order Details</h2>
      {order.isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div id="order-details" className="styled-box">
          <div id="order-details-head" className="container">
            <table id="order-address" className="col-4">
              <tr><strong>Shipping Address</strong></tr>
                <tr>{order.data.deliveryStreetAddress1}</tr>
                {order.data.deliveryStreetAddress2 && (
                  <tr>{order.data.deliveryStreetAddress2}</tr>
                )}
                <tr>{`${order.data.deliveryCity}, ${order.data.deliveryState} ${order.data.deliveryZipCode}`}</tr>
                <tr>{order.data.deliveryCountry}</tr>
            </table>
            <table id="order-additional-info" className="col-4">
                <tr><strong>Date placed</strong></tr>
                <tr>{getFullUTCDay(new Date(Number(order.data.timeCreated)))}</tr>
                <tr><strong>Order status</strong></tr>
                <tr>{`${order.data.orderStatus}`}</tr>
            </table>
            <table id="order-totals" className="col-4">
              <tbody>
                <tr>
                  <td>
                    <strong>Subtotal</strong>
                  </td>
                  <td className="price-col">
                    <strong>{penniesToUSD(order.data.subTotal)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Shipping & handling</td>
                  <td className="price-col">
                    {penniesToUSD(order.data.shippingFeeCharged)}
                  </td>
                </tr>
                <tr>
                  <td>Sales Tax</td>
                  <td className="price-col">
                    {penniesToUSD(order.data.taxCharged)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
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
          </div>
          <div id="order-details-items">
            {order.data.orderItems.map((i, key) => {
              return (
                <div className="order-item" key={key}>
                  <Link to={`/product/${i.product.id}`}>
                    <div className="order-item-image">
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}/images/${i.product.smallImageFile1}`}
                        alt="order item"
                      />
                    </div>
                  </Link>
                  <div className="order-item-content">
                    <p>
                      {i.product.optionType}: {i.optionSelection}
                    </p>
                    <p>{i.product.brandName}</p>
                    <p>{i.product.productName}</p>
                    <strong>
                      <p>{penniesToUSD(i.price)}</p>
                    </strong>
                    <div className="order-item-options">{`Quantity: ${i.quantity}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
