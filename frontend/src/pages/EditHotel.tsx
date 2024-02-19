import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { data: hotel } = useQuery("loadHotelById",
        () => apiClient.loadHotelById(hotelId || ''), {
        enabled: !!hotelId,
    }
    );

    const { mutate, isLoading } = useMutation(apiClient.updateHotelById,{
        onSuccess: ()=>{},
        onError: ()=>{}
    });

    const handleSave = (hotelFormData: FormData)=>{
        mutate(hotelFormData);
    }

    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
}

export default EditHotel;
