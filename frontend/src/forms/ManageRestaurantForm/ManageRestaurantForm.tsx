import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "../ManageRestaurantForm/DetailsSection";
import TypesSection from "../ManageRestaurantForm/TypesSection";
import FacilitiesSection from "../ManageRestaurantForm/FacilitiesSection";
import ImagesSection from "../ManageRestaurantForm/ImagesSection";
import WorkingHours from "./WorkingHours";
import { RestaurantFormData, RestaurantType } from "../../../../types/types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FoodSection from "./FoodSection";


type Props = {
    restaurant?: RestaurantType;
    onSave: (RestaurantFormData: FormData) => void;
    isLoading: boolean;
}

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
    const formMethods = useForm<RestaurantFormData>();
    const { handleSubmit, reset } = formMethods;
    const { pathname } = useLocation();

    useEffect(() => {
        reset(restaurant);
    }, [restaurant, reset]);

    const onSubmit = handleSubmit((formDataJson: RestaurantFormData) => {
        const formData = new FormData();
        if (restaurant) {
            formData.append("restaurantId", restaurant._id);
        }
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formDataJson.foodItems.forEach((foodItem, index) => {
            formData.append(`food[${index}].item`, foodItem.item);
            formData.append(`food[${index}].price`, foodItem.price.toString());
            formData.append(`food[${index}].quantity`, foodItem.quantity.toString());
        });
        formData.append("type", formDataJson.type);
        formData.append("starRating", formDataJson.starRating.toString());
        formDataJson.openingHours.forEach((working, index) => {
            formData.append(`opening[${index}].day`, working.day);
            formData.append(`opening[${index}].startTime`, working.startTime);
            formData.append(`opening[${index}].endTime`, working.endTime);
        });
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
            <form onSubmit={onSubmit} className="bg-gray-200 p-5 border border-slate-300 rounded">
                <DetailsSection />
                <WorkingHours />
                <TypesSection />
                <FoodSection />
                <FacilitiesSection />
                <ImagesSection />
                <span className="flex justify-end">
                    <button className="mx-auto rounded-md bg-blue-400 text-md font-semibold text-white flex items-center p-2 mt-2 mr-0 hover:bg-blue-500"
                        disabled={isLoading} type="submit">
                        {((pathname === "/admin/add-restaurant") ? (isLoading ? "Please wait..." : "Add Restaurant") : (isLoading ? "Please wait..." : "Update Restaurant"))}
                    </button>
                </span>
            </form>
        </FormProvider >
    )
}

export default ManageRestaurantForm;
