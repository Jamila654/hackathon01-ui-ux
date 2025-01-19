import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: [],
    seatingCapacity: [],
    fuelCapacity: [],
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const updatedFilters: any = { ...filters };

    if (checked) {
      updatedFilters[name] = [...updatedFilters[name], value];
    } else {
      updatedFilters[name] = updatedFilters[name].filter((item: string) => item !== value);
    }

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-component flex flex-col gap-10 p-10">
      <h3 className="text-4xl text-[#3563e9] font-bold">Filter by</h3>

      <div className="flex flex-col gap-5">
        <h4 className="text-2xl text-gray-500">Type</h4>
        <div className="flex flex-col gap-4">
          <label>
            <input
              type="checkbox"
              name="type"
              value="SUV"
              onChange={handleFilterChange}
            />{" "}
            SUV
          </label>
          <label>
            <input
              type="checkbox"
              name="type"
              value="Sedan"
              onChange={handleFilterChange}
            />{" "}
            Sedan
          </label>
          <label>
            <input
              type="checkbox"
              name="type"
              value="Sport"
              onChange={handleFilterChange}
            />{" "}
            Sport
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h4 className="text-2xl text-gray-500">Capacity</h4>
        <div className="flex flex-col gap-4">
          <label>
            <input
              type="checkbox"
              name="seatingCapacity"
              value="2 People"
              onChange={handleFilterChange}
            />{" "}
            2 People
          </label>
          <label>
            <input
              type="checkbox"
              name="seatingCapacity"
              value="4 People"
              onChange={handleFilterChange}
            />{" "}
            4 People
          </label>
          <label>
            <input
              type="checkbox"
              name="seatingCapacity"
              value="5 People"
              onChange={handleFilterChange}
            />{" "}
            5 People
          </label>
        </div>
        <div className="flex flex-col gap-5">
  <h4 className="text-2xl text-gray-500">Fuel Capacity</h4>
  <div className="flex flex-col gap-4">
    <label>
      <input
        type="checkbox"
        name="fuelCapacity"
        value="50L"
        onChange={handleFilterChange}
      />{" "}
      50L
    </label>
    <label>
      <input
        type="checkbox"
        name="fuelCapacity"
        value="70L"
        onChange={handleFilterChange}
      />{" "}
      70L
    </label>
    <label>
      <input
        type="checkbox"
        name="fuelCapacity"
        value="60L"
        onChange={handleFilterChange}
      />{" "}
      90L
    </label>
  </div>
  </div>
      </div>
    </div>
  );
};

export default FilterComponent;

