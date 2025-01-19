import { useState } from "react";

interface FilterProps {
  onFilter: (filters: { types: string[]; capacities: string[]; maxPrice: number }) => void;
}

export default function FilterComponent({ onFilter }: FilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);

  const carTypes = ["Sport", "SUV", "MPV", "Sedan", "Coupe", "Hatchback"];
  const seatingCapacities = ["2 Person", "4 Person", "6 Person", "8 or More"];

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCapacityChange = (capacity: string) => {
    setSelectedCapacities((prev) =>
      prev.includes(capacity) ? prev.filter((c) => c !== capacity) : [...prev, capacity]
    );
  };

  const applyFilters = () => {
    onFilter({
      types: selectedTypes,
      capacities: selectedCapacities,
      maxPrice,
    });
  };

  return (
    <div className="w-full max-w-[300px] p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Type</h3>
        {carTypes.map((type) => (
          <div key={type} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={`type-${type}`}
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeChange(type)}
            />
            <label htmlFor={`type-${type}`} className="text-sm">
              {type}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Capacity</h3>
        {seatingCapacities.map((capacity) => (
          <div key={capacity} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={`capacity-${capacity}`}
              checked={selectedCapacities.includes(capacity)}
              onChange={() => handleCapacityChange(capacity)}
            />
            <label htmlFor={`capacity-${capacity}`} className="text-sm">
              {capacity}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Price</h3>
        <input title="hh"
          type="range"
          min="0"
          max="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm mt-2">Max. ${maxPrice}.00</p>
      </div>
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
      >
        Apply Filters
      </button>
    </div>
  );
}
