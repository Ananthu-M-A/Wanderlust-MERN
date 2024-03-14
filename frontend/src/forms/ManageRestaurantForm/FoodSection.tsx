import { useFormContext } from "react-hook-form";
import { RestaurantFormData } from "./ManageRestaurantForm";
import { foodList } from "../../config/options-config";

const FoodSection = () => {
    const { register, formState: { errors } } = useFormContext<RestaurantFormData>();
    return (
        <>
            <div className="flex justify-between text-2xl font-bold mb-3">
                <h2>Food Availability</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-2 gap-2 bg-gray-300">
                <div className="text-gray-700 text-sm font-semibold">
                    Food Item
                </div>
                <div className="text-gray-700 text-sm font-semibold">
                    Price
                </div>
                <div className="text-gray-700 text-sm font-semibold">
                    Current Status
                </div>
            </div>
            {foodList.map((food, index) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-2 gap-2 bg-gray-300" key={index}>
                    <div>
                        <input type="text" value={food}
                            {...register(`foodItems.${index}.item`, { required: "This field is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                    <div>
                        <input type="number"
                            {...register(`foodItems.${index}.price`, { required: "This field is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                        <input type="radio" value={"Available"}
                            {...register(`foodItems.${index}.availability`, { required: "This field is required" })}/>
                        <h6 className="p-2">Available</h6>
                        <input type="radio" value={"Not Available"}
                            {...register(`foodItems.${index}.availability`, { required: "This field is required" })}/>
                        <h6 className="p-2">Not Available</h6>
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                </div>
            ))}
        </>
    )
}

export default FoodSection;
