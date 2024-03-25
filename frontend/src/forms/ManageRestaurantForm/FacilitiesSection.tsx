import { useFormContext } from "react-hook-form";
import { RestaurantFacilities } from "../../../../types/Enums";
import { RestaurantFormData } from "./ManageRestaurantForm";


const FacilitiesSection = () => {
    const { register, formState: { errors } } = useFormContext<RestaurantFormData>();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Facilities</h2>
            <div className="grid grid-cols-5 gap-3">
                {Object.values(RestaurantFacilities).map((facility, index) => (
                    <label key={index} className="text-sm flex gap-1 text-gray-700">
                        <input key={index} type='checkbox' value={facility} {...register('facilities', {
                            validate: (facilities) => {
                                if (facilities && facilities.length > 0) {
                                    return true;
                                } else {
                                    return "Atleast one facility is required"
                                }
                            }
                        })} />
                        {facility}
                    </label>
                ))}
            </div>
            {errors.facilities && (
                <span className="text-red-500 text-sm font-bold">{errors.facilities.message}</span>
            )}
        </div>
    )
}

export default FacilitiesSection;
