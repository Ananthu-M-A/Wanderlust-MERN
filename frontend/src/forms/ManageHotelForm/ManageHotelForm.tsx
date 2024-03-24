import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypesSection from "./TypesSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { HotelType, RoomType } from "../../../../types/types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import RoomsAndPriceSection from "./RoomsAndPriceSection";


export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
    roomTypes: RoomType[];
};

type Props = {
    hotel?: HotelType;
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
}

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;
    const { pathname } = useLocation();

    useEffect(() => {
        reset(hotel);
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        const formData = new FormData();
        if (hotel) {
            formData.append("hotelId", hotel._id);
        }
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formDataJson.roomTypes.forEach((roomType, index) => {
            formData.append(`room[${index}].type`, roomType.type);
            formData.append(`room[${index}].price`, roomType.price.toString());
            formData.append(`room[${index}].quantity`, roomType.quantity.toString());
        });
        formData.append("type", formDataJson.type);
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());

        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility)
        });

        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            })
        }

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile)
        })
        onSave(formData);
    })
    return (
        <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
                <DetailsSection />
                <RoomsAndPriceSection />
                <TypesSection />
                <FacilitiesSection />
                <GuestSection />
                <ImagesSection />
                <span className="flex justify-end">
                    <button className="bg-black text-blue-300 p-2 mt-2 font-bold hover:text-white text-xl disabled:bg-gray-500"
                        disabled={isLoading} type="submit">
                        {((pathname === "/admin/add-hotel") ? (isLoading ? "Please wait..." : "Add Hotel") : (isLoading ? "Please wait..." : "Update Hotel"))}
                    </button>
                </span>
            </form>
        </FormProvider >
    )
}

export default ManageHotelForm;
