import AvaliablePages from "@/components/AvaliableMenu";
import { Badge } from "@/components/ui/badge";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestauranrDetails = () => {
  const params = useParams()
  const {getSingleRestaurant, singleRestaurant} = useRestaurantStore()
  
  useEffect(() => {
    getSingleRestaurant(params.id!)
    console.log(singleRestaurant);
  }, [params.id])

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={
              singleRestaurant?.imageUrl || "Loading..."
            }
            alt="restaurant_image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>

        {/* Restaurant name and details */}
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."}</h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines.map((cuisine: string, index: number) => (
                <Badge key={index} className="rounded-full">
                  {cuisine}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h2 className="flex items-center gap-2 font-medium">
                  Delivery Time: <span className="text-orange">{singleRestaurant?.deliveryTime} mins</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Menus */}
        <AvaliablePages menus={ singleRestaurant?.menus!} />
      </div>
    </div>
  );
};

export default RestauranrDetails;
