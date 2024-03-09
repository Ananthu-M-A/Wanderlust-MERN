import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { RoomType } from "../../../../backend/src/shared/types";
import { useEffect, useState } from "react";

type Props = {
    hotelId: string;
    roomTypes: RoomType[];
}

type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    roomType: string;
    roomCount: number;
    roomPrice: number;
}

const GuestInfoForm = ({ hotelId, roomTypes }: Props) => {
    const [roomPrice, setRoomPrice] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { watch, register, handleSubmit, setValue, formState: { errors } } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            childCount: search.childCount,
            roomType: search.roomType,
            roomCount: search.roomCount,
            roomPrice: search.roomPrice
        }
    });

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const roomCount = watch("roomCount");
    const nightsPerStay = Math.floor((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));

    useEffect(() => {
        if (checkIn && checkOut) {
            const newTotalCost = roomPrice * nightsPerStay * roomCount;
            setTotalCost(newTotalCost);
        }
    }, [roomPrice, nightsPerStay, roomCount]);

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onLoginClick = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount, data.roomType, data.roomCount, roomPrice);
        navigate("/login", { state: { from: location } });
    }

    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues("", data.checkIn, data.checkOut, data.adultCount, data.childCount, data.roomType, data.roomCount, roomPrice);
        navigate(`/home/${hotelId}/booking`);
    }

    return (
        <div className="flex flex-col p-4 bg-blue-200 gap-4">
            <h3 className="text-md font-bold">₹{(nightsPerStay < 1) ? (roomPrice*roomCount) : totalCost}</h3>
            <form onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onLoginClick)}>
                <div className="grid grid-cols-1 gap-4 items-center">
                    <div>
                        <DatePicker
                            selected={checkIn} selectsStart startDate={checkIn} endDate={checkOut}
                            minDate={minDate} maxDate={maxDate} placeholderText="Check-in Date"
                            onChange={(date: Date) => {
                                setValue("checkIn", date);
                                const newDate = new Date(date.getTime());
                                newDate.setDate(newDate.getDate() + 1);
                                setValue("checkOut", newDate);
                            }}
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
                    <div className="flex bg-white px-2 py-1 gap-2">
                        <label className="items-center flex">
                            Room:
                            <select className="p-2 focus:outline-none font-bold"  {...register("roomType")} onChange={(e) => {
                                const selectedRoomType = e.target.value;
                                const selectedRoom = roomTypes.find(roomType => roomType.type === selectedRoomType);
                                if (selectedRoom) {
                                    setRoomPrice(selectedRoom.price || 0);
                                }
                            }}>
                                <option value="">Select Type</option>
                                {roomTypes.map((roomType, index) => (
                                    <option key={index} value={roomType.type}>{roomType.type}</option>
                                ))}
                            </select>

                        </label>
                        <label className="items-center flex">
                            Count:
                            <input type="number" min={1} max={20} {...register("roomCount", {
                                valueAsNumber: true
                            })}
                                className="w-full p-1 focus:outline-none font-bold" />
                        </label>
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
