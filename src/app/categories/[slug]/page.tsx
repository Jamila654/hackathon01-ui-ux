'use client'
import { client, urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";

interface simplifiedCar {
  _id: string;
  name: string;
  type: string;
  slug: {
    current: string;
  };
  image: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  pricePerDay: string;
}

async function getData() {
  const query = `*[_type == "car"]{
  _id,
  name,
    type,
    slug,
    image{
    asset->{url}
  },
  fuelCapacity,
    transmission,
    seatingCapacity,
    pricePerDay,
    
}`;
  const data = await client.fetch(query);
  return data;
}

interface Car {
  _id: string;
  name: string;
  type: string;
  image: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  pricePerDay: string;
  brand: string;
  originalPrice: string;
  tags: string[];
  slug: {
    current: string;
  };
}

async function getCarBySlug(slug: string) {
  // Remove any quotes from the slug parameter
  const cleanSlug = slug.replace(/['"]+/g, "");

  const query = `*[_type == "car" && slug.current == "${cleanSlug}"][0]{
    _id,
    name,
    type,
    image,
    fuelCapacity,
    transmission,
    seatingCapacity,
    pricePerDay,
    brand,
  originalPrice,
  tags,
  slug


  }`;

  const car = await client.fetch(query);
  return car;
}

export default async function CarDetails({
  params,
}: {
  params: { slug: string };
}) {
  const car: Car = await getCarBySlug(params.slug);
  const data: simplifiedCar[] = await getData();

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="w-full flex">
      {/* <div className="first hidden sm:flex w-[25%]">
        <Image src={"/Nav Bar Side.png"} alt="" width={360} height={1600} />
      </div> */}
      <div className="sec w-full bg-[#f6f7f9] p-4 sm:p-6  flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
        <section className=" w-full flex flex-col md:flex-row gap-5  items-center justify-around">
          <div className="first flex flex-col gap-4 w-full  lg:max-w-[470px]  lg:max-h-[508px]">
            <div>
              <Image
                src={urlFor(car.image).url()}
                alt=""
                width={492}
                height={360}
                className=" w-full h-[360px] rounded-lg"
              />
            </div>
            <div className=" flex items-center justify-between gap-2 xl:gap-0">
              <Image
                src={urlFor(car.image).url()}
                alt=""
                width={148}
                height={124}
                className="xl:w-[148px] w-[100px] md:w-[70px] h-[110px] xl:h-[124px] rounded-lg"
              />
              <Image src={"/View 2.png"} alt="" width={148} height={124} />
              <Image src={"/View 3.png"} alt="" width={148} height={124} />
            </div>
          </div>
          <div className="flex flex-col w-full  lg:max-w-[492px] h-auto lg:max-h-[508px] bg-white justify-between rounded-xl shadow-md">
            <Card className="flex flex-col w-full  lg:max-w-[492px] h-auto lg:h-[508px]">
              <CardHeader>
                <CardTitle className="w-full flex items-center justify-between">
                  {car.name}{" "}
                  <Image src={"/heart.png"} alt="" width={20} height={20} />
                </CardTitle>
                <CardDescription>{car.type}</CardDescription>
                <Image
                  src={"/Reviewsstar.png"}
                  alt=""
                  width={220}
                  height={24}
                />
              </CardHeader>
              <CardContent className="flex flex-col gap-6 mt-8">
                <div className="car-details w-full flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={"/gas-station.png"}
                        alt="Fuel Capacity"
                        width={32}
                        height={32}
                      />
                      <h1 className="text-lg font-medium text-gray-700">
                        {car.fuelCapacity}
                      </h1>
                      <p className="text-sm text-gray-500">Fuel Capacity</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={"/Caricon.png"}
                        alt="Transmission"
                        width={32}
                        height={32}
                      />
                      <h1 className="text-lg font-medium text-gray-700">
                        {car.transmission}
                      </h1>
                      <p className="text-sm text-gray-500">Transmission</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={"/profile-2user.png"}
                        alt="Seating Capacity"
                        width={32}
                        height={32}
                      />
                      <h1 className="text-lg font-medium text-gray-700">
                        {car.seatingCapacity}
                      </h1>
                      <p className="text-sm text-gray-500">Seating Capacity</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-gray-600 mt-4">
                    <p className="text-lg font-medium">
                      Brand:{" "}
                      <span className="text-gray-800">
                        {car.brand || "N/A"}
                      </span>
                    </p>
                    {car.tags && (
                      <p className="text-lg font-medium">
                        Tags:{" "}
                        <span className="text-gray-800">
                          {car.tags.join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 flex  items-center justify-between gap-4">
              <div className="flex flex-col">
                <h1 className="font-bold text-lg sm:text-xl lg:text-2xl">
                  {car.pricePerDay} /{" "}
                  <span className="text-gray-500 text-sm lg:text-base">
                    day
                  </span>
                </h1>
                <h1 className=" text-red-600 line-through">
                  {car.originalPrice}
                </h1>
              </div>
              <Link href={`/payment/${car.slug.current}`}>
                <button className="bg-[#3563e9] hover:bg-[#264ac6] transition-all p-3 sm:p-4 px-6 sm:px-10 text-nowrap  text-white rounded-md w-full max-w-[180px] text-center">
                  Rent Now
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className=" w-full flex items-center justify-center">
          <Image
            src={"/Reviews.png"}
            alt=""
            width={1010}
            height={452}
            className=" hidden md:flex"
          />
          <Image
            src={"/Reviews (1).png"}
            alt=""
            width={492}
            height={384}
            className=" md:hidden"
          />
        </section>
        <section className="popular w-full flex flex-col gap-5">
          <div className="first w-full flex items-center justify-between px-10 xl:px-14">
            <h1 className="text-gray-500 text-lg sm:text-xl">Recent Car</h1>
            <Link href={"/categories"}>
              <h1 className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
                View All
              </h1>
            </Link>
          </div>
          <div className="sec grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:px-5 ">
            {data.slice(0, 3).map((product) => (
              <div key={product._id}>
                <Card className="w-full max-w-[304px] mx-auto h-[388px] flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="w-full flex items-center justify-between">
                      {product.name}{" "}
                      <Image src={"/heart.png"} alt="" width={20} height={20} />
                    </CardTitle>
                    <CardDescription>{product.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                    <Image
                      src={urlFor(product.image).url()}
                      alt=""
                      width={220}
                      height={68}
                    />
                    <div className=" flex items-center justify-between mt-10">
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/gas-station.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.fuelCapacity}</h1>
                      </div>
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/Caricon.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.transmission}</h1>
                      </div>
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/profile-2user.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.seatingCapacity}</h1>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="w-full flex items-center justify-between">
                    <p>
                      {product.pricePerDay}/
                      <span className="text-gray-500">day</span>
                    </p>
                    <Link href={`/categories/${product.slug.current}`}>
                      <button className="bg-[#3563e9] p-2 text-white rounded-md">
                        Rent Now
                      </button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </section>
        <section className="popular w-full flex flex-col gap-5">
          <div className="first w-full flex items-center justify-between px-10 xl:px-14">
            <h1 className="text-gray-500 text-lg sm:text-xl">
              Recomendation Car
            </h1>
            <Link href={"/categories"}>
              <h1 className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
                View All
              </h1>
            </Link>
          </div>
          <div className="sec grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:px-5 ">
            {data.slice(4, 7).map((product) => (
              <div key={product._id}>
                <Card className="w-full max-w-[304px] mx-auto h-[388px] flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="w-full flex items-center justify-between">
                      {product.name}{" "}
                      <Image src={"/heart.png"} alt="" width={20} height={20} />
                    </CardTitle>
                    <CardDescription>{product.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                    <Image
                      src={urlFor(product.image).url()}
                      alt=""
                      width={220}
                      height={68}
                    />
                    <div className=" flex items-center justify-between mt-10">
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/gas-station.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.fuelCapacity}</h1>
                      </div>
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/Caricon.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.transmission}</h1>
                      </div>
                      <div className=" flex items-center gap-2">
                        <Image
                          src={"/profile-2user.png"}
                          alt=""
                          width={26}
                          height={24}
                        />
                        <h1>{product.seatingCapacity}</h1>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="w-full flex items-center justify-between">
                    <p>
                      {product.pricePerDay}/
                      <span className="text-gray-500">day</span>
                    </p>
                    <Link href={`/categories/${product.slug.current}`}>
                      <button className="bg-[#3563e9] p-2 text-white rounded-md">
                        Rent Now
                      </button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
