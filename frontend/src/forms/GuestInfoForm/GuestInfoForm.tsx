import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
    hotelId: string;
    pricePerNight: number;
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
}

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount
        }
    });

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const nightsPerStay = Math.floor((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));

    const totalCost = pricePerNight * nightsPerStay;

    const onLoginClick = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate("/login", { state: { from: location } });
    }

    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount);
        navigate(`/home/${hotelId}/booking`);
    }

    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">₹{(nightsPerStay < 1) ? pricePerNight : totalCost}</h3>
            <form onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onLoginClick)}>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker
                            selected={checkIn} selectsStart startDate={checkIn} endDate={checkOut}
                            minDate={minDate} maxDate={maxDate} placeholderText="Check-in Date"
                            onChange={(date) => { setValue("checkIn", date as Date); setValue("checkOut", date as Date); }}
                            wrapperClassName="min-w-full" className="min-w-full bg-white p-2 focus:outline-none" required
                        />
                    </div>
                    <div>
                        <DatePicker
                            selected={checkOut} startDate={checkIn} endDate={checkOut}
                            minDate={checkIn} maxDate={maxDate} placeholderText="Check-out Date"
                            onChange={(date) => setValue("checkOut", date as Date)}
                            wrapperClassName="min-w-full" className="min-w-full bg-white p-2 focus:outline-none" required
                        />
                    </div>
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Adults:
                            <input type="number" min={1} max={20} {...register("adultCount", {
                                required: "This feild is required", min: { value: 1, message: "There must be atleast one adult" }, valueAsNumber: true
                            })}
                                className="w-full p-1 focus:outline-none font-bold" />
                        </label>
                        <label className="items-center flex">
                            Children:
                            <input type="number" min={0} max={20} {...register("childCount", {
                                valueAsNumber: true,
                            })}
                                className="w-full p-1 focus:outline-none font-bold" />
                        </label>
                        {errors.adultCount && (
                            <span className="text-red-500 font-semibold text-sm">{errors.adultCount.message}</span>
                        )}
                    </div>
                    {isLoggedIn ? (
                        <button className="text-blue-300 bg-black h-full p-2 font-bold hover:text-white text-xl">Book Now</button>
                    ) : (
                        <button className="text-blue-300 bg-black h-full p-2 font-bold hover:text-white text-xl">Log in to Book</button>
                    )}
                </div>
            </form>
        </div>
    )
};

export default GuestInfoForm
