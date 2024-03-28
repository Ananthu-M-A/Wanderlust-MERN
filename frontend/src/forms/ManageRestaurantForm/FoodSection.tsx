import { useFormContext } from "react-hook-form";
import { FoodItems } from "../../../../types/Enums";
import { RestaurantFormData } from "../../../../types/types";

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
                    Quantity
                </div>
            </div>
            {Object.values(FoodItems).map((food, index) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-2 gap-2 bg-gray-300" key={index}>
                    <div>
                        <input type="text" value={food}
                            {...register(`foodItems.${index}.item`, { required: "This field is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                    <div>
                        <input type="number" defaultValue={0}
                            {...register(`foodItems.${index}.price`, { required: "This field is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                        <input type="number" defaultValue={0}
                            {...register(`foodItems.${index}.quantity`, { required: "This field is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.foodItems && (<span className="text-red-500">{errors.foodItems.message}</span>)}
                    </div>
                </div>
            ))}
        </>
    )
}

export default FoodSection;
