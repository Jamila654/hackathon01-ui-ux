'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { urlFor } from "../lib/sanity";

interface simplifiedCar {
  _id: string;
  name: string;
  type: string;
  slug: { current: string };
  image: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  pricePerDay: string;
}

interface SearchProps {
  data: simplifiedCar[];
}

export default function Search({ data }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<simplifiedCar[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = data.filter((car) => {
        console.log(car.name.toLowerCase());
        return car.name.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredCars(filtered);
    } else {
      setFilteredCars([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative w-full md:w-[492px]">
      <Image
        src="/search-normal.png"
        alt="Search"
        width={24}
        height={24}
        className="absolute top-1/2 left-3 transform -translate-y-1/2"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for a car..."
        className="border-2 border-[#e7eef6] w-full h-[44px] rounded-full p-2 pl-10 pr-12 focus:outline-none focus:border-[#3563e9]"
      />
      {searchQuery && filteredCars.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-[#e7eef6] max-h-[400px] overflow-y-auto">
          <div className="p-4">
            {filteredCars.map((car) => (
              <Card
                key={car._id}
                className="mb-4 shadow-lg border rounded-md p-2 hover:bg-gray-100"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {car.name}
                    <Image
                      src="/heart.png"
                      alt="Favorite"
                      width={20}
                      height={20}
                    />
                  </CardTitle>
                  <CardDescription>{car.type}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <Image
                    src={urlFor(car.image).url()}
                    alt={car.name}
                    width={220}
                    height={68}
                  />
                  <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/gas-station.png"
                        alt="Fuel Capacity"
                        width={26}
                        height={24}
                      />
                      <span>{car.fuelCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/Caricon.png"
                        alt="Transmission"
                        width={26}
                        height={24}
                      />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/profile-2user.png"
                        alt="Seating Capacity"
                        width={26}
                        height={24}
                      />
                      <span>{car.seatingCapacity}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p>
                    {car.pricePerDay}/<span className="text-gray-500">day</span>
                  </p>
                  <Link href={`/categories/${car.slug.current}`}>
                    <button className="bg-[#3563e9] p-2 text-white rounded-md" onClick={()=> setSearchQuery('')}>
                      Rent Now
                    </button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      {searchQuery && filteredCars.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-[#e7eef6] p-4 text-center">
          No cars found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}