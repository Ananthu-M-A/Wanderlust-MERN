import React from "react";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const mutation = useMutation(apiClient.logout,{
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Loggedout Successfully!", type: "SUCCESS" });
            navigate("/");
        },
        onError: (error) => { showToast({ message: error.message, type: "ERROR" }) },

    });

    const handleClick = () =>{
        mutation.mutate()
    };

    return (
        <button onClick={handleClick} className="text-white px-3 font-bold hover:bg-gray-100 hover:text-blue-800">Logout</button>
    )
}

export default LogoutButton;