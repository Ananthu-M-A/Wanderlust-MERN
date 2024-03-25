import { useFormContext } from "react-hook-form";
import { WeekDays } from "../../../../types/Enums";
import { RestaurantFormData } from "./ManageRestaurantForm";


const WorkingHours = () => {
    const { register, formState: { errors } } = useFormContext<RestaurantFormData>();
    return (
        <>
            <div className="flex justify-between text-2xl font-bold mb-3">
                <h2>Opening Hours</h2>
            </div>
            <div className="grid grid-cols-3 p-2 gap-2 bg-gray-300 justify-between">
                <label className="text-gray-700 text-sm font-semibold">
                    Day
                </label>
                <label className="text-gray-700 text-sm font-semibold">
                    Opening Time
                </label>
                <label className="text-gray-700 text-sm font-semibold">
                    Closing Time
                </label>
            </div>
            {Object.values(WeekDays).map((week, index) => (
                <div className="grid grid-cols-3 p-2 gap-2 bg-gray-300 justify-between" key={index}>
                    <div>
                        <input type="text" key={index} value={week} readOnly
                            {...register(`openingHours.${index}.day`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.openingHours && (<span className="text-red-500">{errors.openingHours.message}</span>)}
                    </div>
                    <div>
                        <input type="time" key={index}
                            {...register(`openingHours.${index}.startTime`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.openingHours && (<span className="text-red-500">{errors.openingHours.message}</span>)}
                    </div>
                    <div>
                        <input type="time" key={index}
                            {...register(`openingHours.${index}.endTime`, { required: "This feild is required" })}
                            className="border rounded w-full py-2 px-3 font-normal" />
                        {errors.openingHours && (<span className="text-red-500">{errors.openingHours.message}</span>)}
                    </div>
                </div>
            ))}
        </>
    )
}

export default WorkingHours;
