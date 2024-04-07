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
        <button onClick={handleClick}
            className={ `px-4 py-2 cursor-pointer text-blue-300 font-bold hover:text-white`}>Logout</button>
    );
}

export default LogoutButton;