import React, { useState, FormEvent } from "react";
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

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dates?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function PaymentForm({ car }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s+/g, "");
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiry = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split("/");
    const now = new Date();
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > now && parseInt(month) >= 1 && parseInt(month) <= 12;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return start >= now && end >= start;
  };
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const checkEmailAndUser = async (email: string, firstName: string, lastName: string) => {
    try {
      const existingUser = await client.fetch(
        `*[_type == "userOrder" && userEmail == $email][0]`,
        { email }
      );

      if (existingUser) {
        const fullName = `${firstName} ${lastName}`;
        if (existingUser.userName !== fullName) {
          return {
            isValid: false,
            error: "This email is associated with a different name. Please use your registered email."
          };
        }
      }
      return { isValid: true };
    } catch (err) {
      console.error('Error checking email:', err);
      return {
        isValid: false,
        error: "Error validating user information. Please try again."
      };
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    const errors: ValidationErrors = {};
    
    if (firstName.length < 2) errors.firstName = "First name is too short";
    if (lastName.length < 2) errors.lastName = "Last name is too short";
    if (!validateEmail(email)) errors.email = "Invalid email address";
    if (!validatePhone(phone)) errors.phone = "Invalid phone number";
    if (!validateDates(startDate, endDate)) errors.dates = "Invalid date range";
    if (!validateCardNumber(cardNumber)) errors.cardNumber = "Invalid card number";
    if (!validateExpiry(expiryDate)) errors.expiryDate = "Invalid expiry date";
    if (!validateCVV(cvv)) errors.cvv = "Invalid CVV";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    setIsCheckingEmail(true);
    const emailValidation:any = await checkEmailAndUser(email, firstName, lastName);
    setIsCheckingEmail(false);

    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      setIsSubmitting(false);
      return;
    }

    try {
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

      const existingUser = await client.fetch(
        `*[_type == "userOrder" && userEmail == $email][0]`,
        { email }
      );

      if (existingUser) {
        await client
          .patch(existingUser._id)
          .setIfMissing({ orders: [] })
          .append('orders', [newOrder])
          .commit();
      } else {
        await client.create({
          _type: 'userOrder',
          userName: `${firstName} ${lastName}`,
          userEmail: email,
          phoneNumber: phone,
          orders: [newOrder]
        });
      }

      localStorage.setItem('userEmail', email);
      window.location.href = '/user';
    } catch (err: any) {
      setError('Failed to process payment. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">First Name</label>
          <input
            name="firstName"
            type="text"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.firstName ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Enter first name"
            required
          />
          {validationErrors.firstName && (
            <span className="text-red-500 text-xs">{validationErrors.firstName}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Last Name</label>
          <input
            name="lastName"
            type="text"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.lastName ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Enter last name"
            required
          />
          {validationErrors.lastName && (
            <span className="text-red-500 text-xs">{validationErrors.lastName}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          name="email"
          type="email"
          className={`w-full p-3 border rounded-lg ${
            validationErrors.email ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="Enter email address"
          required
        />
        {validationErrors.email && (
          <span className="text-red-500 text-xs">{validationErrors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          name="phone"
          type="tel"
          className={`w-full p-3 border rounded-lg ${
            validationErrors.phone ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="Enter phone number"
          required
        />
        {validationErrors.phone && (
          <span className="text-red-500 text-xs">{validationErrors.phone}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Rental Period</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            title="Start Date"
            name="startDate"
            type="date"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.dates ? 'border-red-500' : 'border-gray-200'
            }`}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <input
            title="End Date"
            name="endDate"
            type="date"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.dates ? 'border-red-500' : 'border-gray-200'
            }`}
            required
          />
        </div>
        {validationErrors.dates && (
          <span className="text-red-500 text-xs">{validationErrors.dates}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Card Number</label>
        <input
          name="cardNumber"
          type="text"
          className={`w-full p-3 border rounded-lg ${
            validationErrors.cardNumber ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          required
        />
        {validationErrors.cardNumber && (
          <span className="text-red-500 text-xs">{validationErrors.cardNumber}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Expiry Date</label>
          <input
            name="expiryDate"
            type="text"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.expiryDate ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            maxLength={5}
            required
          />
          {validationErrors.expiryDate && (
            <span className="text-red-500 text-xs">{validationErrors.expiryDate}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">CVV</label>
          <input
            name="cvv"
            type="text"
            className={`w-full p-3 border rounded-lg ${
              validationErrors.cvv ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            required
          />
          {validationErrors.cvv && (
            <span className="text-red-500 text-xs">{validationErrors.cvv}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isCheckingEmail}
        className="w-full bg-[#3563e9] hover:bg-[#264ac6] text-white py-4 rounded-lg mt-4 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : isCheckingEmail ? 'Validating...' : 'Confirm Payment'}
      </button>
    </form>
  );
}