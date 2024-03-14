import { useFormContext } from "react-hook-form";
import { restaurantTypes } from "../../config/options-config";
import { RestaurantFormData } from "./ManageRestaurantForm";

const TypesSection = () => {
    const { register, watch, formState: { errors } } = useFormContext<RestaurantFormData>();
    const typeWatch = watch("type");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Restaurant Type</h2>
            <div className="grid grid-cols-5 gap-2">
                {restaurantTypes.map((type, index) => (
                    <label key={index} className={
                        typeWatch === type
                        ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
                        : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
                    }>
                        <input key={index} type="radio" value={type} {...register("type", {
                            required: "This feild is required"
                        })} className="hidden" />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
            {errors.type && (
                <span className="text-red-500 text-sm font-bold">{errors.type.message}</span>
            )}
        </div>
    )
}

export default TypesSection;
