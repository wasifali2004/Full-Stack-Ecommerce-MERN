import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../config";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllOrders = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {headers: {token}},
      )
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }, [token])

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        {orderId, status: event.target.value},
        {headers:{token}},
      )
      if(response.data.success) {
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch(error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [fetchAllOrders])

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    if (!normalizedSearch) return true;

    const searchableText = [
      order.user?.name,
      order.user?.customerId,
      order.user?.email,
      order.userId,
      order.address?.firstName,
      order.address?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-xl font-semibold">Orders</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by registered name or ID"
          className="w-full sm:w-80 border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>
      <div>
        {filteredOrders.length === 0 ? (
          <div className="border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            No orders found for this search.
          </div>
        ) : (
          filteredOrders.map((order) => (
          <div key={order._id} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700">
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p key={`${item._id}-${item.variant || item.size}-${index}`} className="py-0.5">
                      {item.name} x {item.quantity} <span>({item.variant || item.size || 'Standard'}{item.color ? ` • ${item.color}` : ''})</span>
                      <span className='ml-2 text-xs text-slate-500'>ID: {item.productCode || item._id}</span>
                      {index < order.items.length - 1 ? ',' : ''}
                  </p>
                ))}
              </div>

              <div className="mt-3 mb-3 rounded bg-slate-50 p-3">
                <p className="font-semibold text-slate-800">Registered user: {order.user?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500">Email: {order.user?.email || 'Not available'}</p>
                <p className="text-xs text-slate-500">Customer ID: {order.user?.customerId || order.userId || 'N/A'}</p>
              </div>

              <p className="mt-3 mb-2 font-medium">{order.address.firstName} {order.address.lastName}</p>
              <div>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">Email: {order.address?.email || order.user?.email || 'Not available'}</p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Paid' : order.paymentMethod === 'COD' ? 'Cash on delivery' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="p-2 font-semibold">
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
