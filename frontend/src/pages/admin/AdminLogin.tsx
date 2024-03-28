import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../../api-client';
import { useAdminContext } from "../../contexts/AdminContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginFormData } from "../../../../types/types";


const AdminLogin = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAdminContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const mutation = useMutation(apiClient.adminLogin, {
        onSuccess: async () => {
            showToast({ message: "Login Successful!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateAdminToken");
            navigate(location.state?.from?.pathname || "/admin/hotels");
        },
        onError: (error: Error) => { showToast({ message: error.message, type: "ERROR" }) },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Admin Login</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register('email', { required: "This feild is required" })}></input>
                {errors.email && (<span className="text-red-500">{errors.email.message}</span>)}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", { required: "This feild is required", minLength: { value: 6, message: "Min 6 characters required" } })}></input>
                {errors.password && (<span className="text-red-500">{errors.password.message}</span>)}
            </label>
            <span className="flex items-center justify-between">
                <button type="submit"
                    className="bg-black text-blue-300 p-2 font-bold hover:text-white text-xl">
                    Login
                </button>
            </span>
        </form>
    )
}

export default AdminLogin;
