import { useMutation } from 'react-query';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client';

const AddHotel = () => {
    const { showToast } = useAppContext();

    const { mutate, isLoading } = useMutation(apiClient.addHotel, {
        onSuccess: () => {
            showToast({ message: "Hotel Added!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Error adding hotel", type: "ERROR" });
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    }

    return (<ManageHotelForm onSave={handleSave} isLoading={isLoading} />)
}

export default AddHotel;
