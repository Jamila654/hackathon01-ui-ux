"use client";

import { useState, useEffect } from 'react';
import { client } from "@/app/lib/sanity";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Car {
  _id: string;
  name: string;
  brand: string;
  type: string;
  image: string;
}

interface Order {
  _key: string;
  car: Car | null;
  startDate: string;
  endDate: string;
  trackingId: string;
  status: 'pending' | 'shipped' | 'completed';
}

interface UserOrder {
  _id: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  orders: Order[];
}

export default function AdminPage() {
  const [userOrder, setUserOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      router.push('/');
      return;
    }

    fetchUserOrders(userEmail);
  }, [router]);

  const fetchUserOrders = async (email: string) => {
    try {
      const query = `*[_type == "userOrder" && userEmail == $email][0]{
        _id,
        userName,
        userEmail,
        phoneNumber,
        orders[]{
          _key,
          trackingId,
          startDate,
          endDate,
          status,
          car->{
            _id,
            name,
            brand,
            type,
            image
          }
        }
      }`;

      const result = await client.fetch(query, { email });
      setUserOrder(result);
    } catch (err: any) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!userOrder) return;

    try {
      await client
        .patch(userOrder._id)
        .set({ orders: [] })
        .commit();
      
      fetchUserOrders(userOrder.userEmail);
    } catch (err) {
      setError('Failed to clear history');
      console.error('Error clearing history:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!userOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No orders found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className=' flex flex-col md:flex-row items-center justify-between'>
      <h1 className="text-3xl font-bold mb-8 text-[#3563e9]">Your Order History</h1>
      <Link href={'/'}>
      <button className='bg-[#3563e9] hover:bg-blue-600 text-white px-4 py-2 rounded'>Back To Home</button></Link>
      

      </div>
      
      
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{userOrder.userName}</h2>
            <p className="text-gray-600">{userOrder.userEmail}</p>
            <p className="text-gray-600">{userOrder.phoneNumber}</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {userOrder.orders.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No orders in your history</p>
            </div>
          ) : (
            userOrder.orders.map((order) => (
              <div key={order._key} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {order.car?.name || 'Car information unavailable'}
                    </h3>
                    <p className="text-gray-600">
                      {order.car ? `${order.car.brand} - ${order.car.type}` : 'Details unavailable'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Tracking ID: {order.trackingId}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={`text-sm px-3 py-1 rounded-full text-center
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}