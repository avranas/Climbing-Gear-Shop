import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButtons/NavigationButtons";
import OrderCard from "../../components/OrderCard/OrderCard";
import { selectOrdersList, loadOrders } from "../../slices/ordersListSlice";
import "./OrderListPage.css";

const OrdersList = (props) => {
  const ordersList = useSelector(selectOrdersList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { page } = useParams();

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await axios("/authenticated");
      if (!response.data) {
        navigate("/");
      }
    };
    checkAuthentication();
  }, [navigate]);

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
    <main id="orders-list">
      {ordersList.isLoading ? (
        <p>Loading...</p>
      ) : ordersList.data.length !== 0 ? (
        <div>
          <h2>Order History</h2>
          {ordersList.data.slice(firstOrder, lastOrder).map((i, key) => {
            return <OrderCard key={key} order={i} />;
          })}
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
