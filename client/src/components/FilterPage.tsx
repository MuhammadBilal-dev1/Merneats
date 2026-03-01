import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRestaurantStore } from "@/store/useRestaurantStore";

export type filterOptionState = {
  id: string;
  label: string;
};

const filterOptions: filterOptionState[] = [
  {
    id: "burger",
    label: "Burger",
  },
  {
    id: "biryani",
    label: "Biryani",
  },
  {
    id: "momos",
    label: "Momos",
  },
  {
    id: "gulabjamun",
    label: "Gulab jamun",
  },
];

const FilterPage = () => {
  const {setAppliedFilter, appliedFilter, resetAppliedFilter} = useRestaurantStore()
  const appliedFilterHandler = (value: string) => {
    setAppliedFilter(value)
  };
  return (
    <div className="md:w-60">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button>
      </div>
      {filterOptions.map((options) => (
        <div key={options.id} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={options.id}
            checked={appliedFilter.includes(options.label)}
            onClick={() => appliedFilterHandler(options.label)}
          />
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {options.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilterPage;
