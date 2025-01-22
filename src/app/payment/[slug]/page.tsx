"use client"
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import { useState,useEffect } from "react";
import PaymentForm from "@/app/components/PaymentForm";

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

export default function Payment({ params }: { params: { slug: string } }) {
  // const car: Car = await getCarById(params.slug);
  const [car, setCar] = useState<Car>();

  useEffect(() => {
      async function fetchData() {
        const result = await getCarById(params.slug);
        setCar(result);
      }
  
      fetchData();
    }, []);

  if (!car) {
    return;
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
        <div className="w-full lg:w-[60%] border-2 bg-white p-2 shadow-md rounded-lg border-gray-300">
          <PaymentForm car={car}/>
        </div>
      </div>
    </div>
  );
}