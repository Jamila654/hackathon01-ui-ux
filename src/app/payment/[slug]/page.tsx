import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface Car {
  _id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: string;
  originalPrice: string;
}

async function getCarById(slug: string) {
    const cleanSlug = slug.replace(/['"]+/g, "");
  const query = `*[_type == "car" && slug.current == "${cleanSlug}"][0]{
    _id,
    name,
    type,
    image,
    pricePerDay,
    originalPrice
  }`;

  const car = await client.fetch(query);
  return car;
}

export default async function Payment({ params }: { params: { slug: string } }) {
  const car: Car = await getCarById(params.slug);

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#f6f7f9] p-4 sm:p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[40%]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Rental Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Image
                  src={urlFor(car.image).url()}
                  alt={car.name}
                  width={120}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <p className="text-gray-500">{car.type}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{car.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${(parseFloat(car.pricePerDay.replace('$', '')) * 0.1).toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(parseFloat(car.pricePerDay.replace('$', '')) * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-[60%]">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
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
                    type="email"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
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
                    title="dd"
                      type="date"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                    <input
                    title="dd"
                      type="date"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <input
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
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">CVV</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3563e9] hover:bg-[#264ac6] text-white py-4 rounded-lg mt-4 transition-all"
                >
                  Confirm Payment
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}