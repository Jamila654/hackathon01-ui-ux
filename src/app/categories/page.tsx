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

import { client } from "../lib/sanity";
import { urlFor } from "../lib/sanity";

interface simplifiedCar {
  _id: string;
  name: string;
  type: string;
  slug:{
    current:string
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

export default async function Page() {
  const data: simplifiedCar[] = await getData();

  return (
    <div className="w-full flex">
      <div className="first hidden sm:flex w-[20%]">
        <Image src={"/Nav Bar Side.png"} alt="" width={360} height={1600} />
      </div>
      <div className="sec w-full sm:w-[80%] bg-[#f6f7f9] p-4 sm:p-6  flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
        <section className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between ">
          <Image
            src={"/Pick - Up.png"}
            alt=""
            width={582}
            height={132}
            className="w-[200px] md:w-[270px] lg:w-[582px]"
          />
          <Image
            src={"/Switch.png"}
            alt=""
            width={60}
            height={60}
            className="w-[80px]"
          />
          <Image
            src={"/Drop - Off.png"}
            alt=""
            width={582}
            height={132}
            className=" w-[200px] md:w-[270px] lg:w-[582px]"
          />
        </section>
        <section className="popular w-full flex flex-col gap-4">
          <div className="sec grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((product) => (
              <div key={product._id}>
                <Card className="w-full max-w-[304px] mx-auto h-[388px] flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="w-full flex items-center justify-between">
                      {product.name}{" "}
                      <Image src={"/heart.png"} alt="" width={20} height={20} />
                    </CardTitle>
                    <CardDescription>{product.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col items-center justify-center gap-4 text-nowrap">
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
