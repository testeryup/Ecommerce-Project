import React, { useEffect, useState } from "react";
import { getAllOrder } from "../../services/orderService";
import { getAllProduct } from "../../services/productService";
import { getAllUser } from "../../services/userService";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, productRes, userRes] = await Promise.all([
          getAllOrder(),
          getAllProduct(),
          getAllUser(),
        ]);

        if (orderRes && orderRes.data) {
          setOrders(orderRes.data);
        } else {
          setOrders([]);
        }

        if (productRes && productRes.data) {
          const productMap = productRes.data.reduce((acc, product) => {
            acc[product.id] = product.name;
            return acc;
          }, {});
          setProducts(productMap);
        }

        if (userRes && userRes.data) {
          const userMap = userRes.data.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
          }, {});
          setUsers(userMap);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="seller-orders-container">
      <h1 className="orders-title">All Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{users[order.userId] || "Unknown User"}</td>
                <td>{products[order.productId] || "Unknown Product"}</td>
                <td>{order.quantity}</td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SellerOrders;
