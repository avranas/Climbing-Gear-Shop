import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadWheel from "../../components/LoadWheel/LoadWheel";
import NavigationButtons from "../../components/NavigationButtons/NavigationButtons";
import OrderCard from "../../components/OrderCard/OrderCard";
import { selectOrdersList, loadOrders } from "../../slices/ordersListSlice";
import "./OrderListPage.css";

const OrdersList = (props) => {
  const ordersList = useSelector(selectOrdersList);
  const dispatch = useDispatch();
  const { page } = useParams();

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  const ordersPerPage = 3;
  let firstOrder = 0;
  let lastOrder = ordersPerPage;
  let prevDisabled = false;
  let nextDisabled = false;
  if (typeof Number(page) === "number") {
    firstOrder = Number(page) * ordersPerPage;
    lastOrder = (Number(page) + 1) * ordersPerPage;
  }
  if (lastOrder >= ordersList.data.length) {
    nextDisabled = true;
  }
  if (page === "0") {
    prevDisabled = true;
  }
  let nextLink = `/orders/${Number(page) + 1}`;
  let prevLink = `/orders/${Number(page) - 1}`;

  return (
    <main id="orders-list" className="container">
      {ordersList.isLoading ? (
          <LoadWheel />
      ) : ordersList.data.length !== 0 ? (
        <div>
          <h2>Order History</h2>
          <ul>
          {ordersList.data.slice(firstOrder, lastOrder).map((i, key) => {
            return <OrderCard key={key} order={i} />;
          })}
          </ul>
        </div>
      ) : (
        <h2>No orders found</h2>
      )}
      <NavigationButtons
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        prevLink={prevLink}
        nextLink={nextLink}
      />
    </main>
  );
};

export default OrdersList;
