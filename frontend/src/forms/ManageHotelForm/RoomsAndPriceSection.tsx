import { useFormContext } from "react-hook-form";
import { roomTypes } from "../../config/options-config";
import { HotelFormData } from "./ManageHotelForm";


const RoomsAndPriceSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();
    return (
        <>
            <div className="flex justify-between text-2xl font-bold mb-3">
                <h2>Rooms and Prices</h2>
            </div>
            <div className="grid grid-cols-3 p-2 gap-2 bg-gray-300 justify-between">
                <label className="text-gray-700 text-sm font-semibold">
                    Room Types
                </label>
                <label className="text-gray-700 text-sm font-semibold">
                    Price per Night
                </label>
                <label className="text-gray-700 text-sm font-semibold">
                    Room Count
                </label>
            </div>
            {roomTypes.map((roomType, index) => (
                <div className="grid grid-cols-3 p-2 gap-2 bg-gray-300 justify-between">
                    <div>
                        <input type="text" key={index} value={roomType} readOnly
                            {...register(`roomTypes.${index}.type`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.roomTypes && (<span className="text-red-500">{errors.roomTypes.message}</span>)}
                    </div>
                    <div>
                        <input type="number" key={index} defaultValue={0}
                            {...register(`roomTypes.${index}.price`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.roomTypes && (<span className="text-red-500">{errors.roomTypes.message}</span>)}
                    </div>
                    <div>
                        <input type="number" key={index} defaultValue={0}
                            {...register(`roomTypes.${index}.quantity`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.roomTypes && (<span className="text-red-500">{errors.roomTypes.message}</span>)}
                    </div>
                </div>
            ))}
        </>
    )
}

export default RoomsAndPriceSection;
