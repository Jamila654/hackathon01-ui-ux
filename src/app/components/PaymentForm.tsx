// "use client";

// import { useState, FormEvent } from "react";
// import { client } from "@/app/lib/sanity";
// import { v4 as uuidv4 } from 'uuid';

// interface PaymentFormProps {
//   car: {
//     _id: string;
//     name: string;
//     type: string;
//     image: string;
//     pricePerDay: string;
//     originalPrice: string;
//   };
// }

// export default function PaymentForm({ car }: PaymentFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
  
//     const formData = new FormData(e.currentTarget);
//     const firstName = formData.get('firstName') as string;
//     const lastName = formData.get('lastName') as string;
//     const email = formData.get('email') as string;
//     const phone = formData.get('phone') as string;
//     const startDate = formData.get('startDate') as string;
//     const endDate = formData.get('endDate') as string;
  
//     try {
//       console.log('Checking for existing user...');
//       const existingUser = await client.fetch(
//         `*[_type == "userOrder" && userEmail == $email][0]`,
//         { email }
//       );
  
//       if (existingUser) {
//         console.log('Updating existing user...');
//         const result = await client
//           .patch(existingUser._id)
//           .setIfMissing({ orders: [] })
//           .append('orders', [{
//             _type: 'object',
//             car: {
//               _type: 'reference',
//               _ref: car._id
//             },
//             startDate: new Date(startDate).toISOString(),
//             endDate: new Date(endDate).toISOString(),
//             trackingId: uuidv4(),
//             status: 'pending'
//           }])
//           .commit();
//         console.log('Update result:', result);
//       } else {
//         console.log('Creating new user...');
//         const result = await client.create({
//           _type: 'userOrder',
//           userName: `${firstName} ${lastName}`,
//           userEmail: email,
//           phoneNumber: phone,
//           orders: [{
//             _key: uuidv4(),
//             _type: 'object',
//             car: {
//               _type: 'reference',
//               _ref: car._id
//             },
//             startDate: new Date(startDate).toISOString(),
//             endDate: new Date(endDate).toISOString(),
//             trackingId: uuidv4(),
//             status: 'pending'
//           }]
//         });
//         console.log('Create result:', result);
//       }
  
//       window.location.href = '/admin';
//     } catch (err:any) {
//       console.error('Detailed error:', err);
//       setError(err.message || 'Something went wrong. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">First Name</label>
//           <input
//             name="firstName"
//             type="text"
//             className="w-full p-3 border rounded-lg"
//             placeholder="Enter first name"
//             required
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">Last Name</label>
//           <input
//             name="lastName"
//             type="text"
//             className="w-full p-3 border rounded-lg"
//             placeholder="Enter last name"
//             required
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Email Address</label>
//         <input
//           name="email"
//           type="email"
//           className="w-full p-3 border rounded-lg"
//           placeholder="Enter email address"
//           required
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Phone Number</label>
//         <input
//           name="phone"
//           type="tel"
//           className="w-full p-3 border rounded-lg"
//           placeholder="Enter phone number"
//           required
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Rental Period</label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input title="hh"
//             name="startDate"
//             type="date"
//             className="w-full p-3 border rounded-lg"
//             required
//           />
//           <input title="hh"
//             name="endDate"
//             type="date"
//             className="w-full p-3 border rounded-lg"
//             required
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Card Number</label>
//         <input
//           name="cardNumber"
//           type="text"
//           className="w-full p-3 border rounded-lg"
//           placeholder="1234 5678 9012 3456"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">Expiry Date</label>
//           <input
//             name="expiryDate"
//             type="text"
//             className="w-full p-3 border rounded-lg"
//             placeholder="MM/YY"
//             required
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">CVV</label>
//           <input
//             name="cvv"
//             type="text"
//             className="w-full p-3 border rounded-lg"
//             placeholder="123"
//             required
//           />
//         </div>
//       </div>

//       {error && (
//         <div className="text-red-500 text-sm">{error}</div>
//       )}

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-[#3563e9] hover:bg-[#264ac6] text-white py-4 rounded-lg mt-4 transition-all disabled:opacity-50"
//       >
//         {isSubmitting ? 'Processing...' : 'Confirm Payment'}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState, FormEvent } from "react";
import { client } from "@/app/lib/sanity";
import { v4 as uuidv4 } from 'uuid';

interface PaymentFormProps {
  car: {
    _id: string;
    name: string;
    type: string;
    image: string;
    pricePerDay: string;
    originalPrice: string;
  };
}

export default function PaymentForm({ car }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // Create the order object with _key
    const newOrder = {
      _key: uuidv4(),
      _type: 'object',
      car: {
        _type: 'reference',
        _ref: car._id
      },
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      trackingId: uuidv4(),
      status: 'pending'
    };

    try {
      console.log('Checking for existing user...');
      const existingUser = await client.fetch(
        `*[_type == "userOrder" && userEmail == $email][0]`,
        { email }
      );

      if (existingUser) {
        console.log('Updating existing user...');
        const result = await client
          .patch(existingUser._id)
          .setIfMissing({ orders: [] })
          .append('orders', [newOrder]) // Using the newOrder object with _key
          .commit();
        console.log('Update result:', result);
      } else {
        console.log('Creating new user...');
        const result = await client.create({
          _type: 'userOrder',
          userName: `${firstName} ${lastName}`,
          userEmail: email,
          phoneNumber: phone,
          orders: [newOrder] // Using the newOrder object with _key
        });
        console.log('Create result:', result);
      }

      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Detailed error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">First Name</label>
          <input
            name="firstName"
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Last Name</label>
          <input
            name="lastName"
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          name="email"
          type="email"
          className="w-full p-3 border rounded-lg"
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          name="phone"
          type="tel"
          className="w-full p-3 border rounded-lg"
          placeholder="Enter phone number"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Rental Period</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            title="hh"
            name="startDate"
            type="date"
            className="w-full p-3 border rounded-lg"
            required
          />
          <input 
            title="hh"
            name="endDate"
            type="date"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Card Number</label>
        <input
          name="cardNumber"
          type="text"
          className="w-full p-3 border rounded-lg"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Expiry Date</label>
          <input
            name="expiryDate"
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">CVV</label>
          <input
            name="cvv"
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="123"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#3563e9] hover:bg-[#264ac6] text-white py-4 rounded-lg mt-4 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
}