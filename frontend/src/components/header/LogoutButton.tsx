import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

type Props = {
    isAdmin: boolean;
}

const LogoutButton = ({ isAdmin }: Props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const mutationAdmin = useMutation(apiClient.adminLogout, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateAdminToken");
            showToast({ message: "Logged out Successfully!", type: "SUCCESS" });
            navigate("/adminLogin");
        },
        onError: (error: any) => { showToast({ message: error.message, type: "ERROR" }) },

    });

    const mutationUser = useMutation(apiClient.logout, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Loggedout Successfully!", type: "SUCCESS" });
            navigate("/");
        },
        onError: (error: any) => { showToast({ message: error.message, type: "ERROR" }) },

    });

    const handleClick = () => {
        if (isAdmin) { mutationAdmin.mutate(); }
        else { mutationUser.mutate(); }
    };

    return (
        <button onClick={handleClick} className="flex items-center text-blue-500 px-3 font-bold hover:text-blue-800">Logout</button>
    )
}

export default LogoutButton;