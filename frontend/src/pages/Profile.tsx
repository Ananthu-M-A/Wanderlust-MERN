import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { RegisterFormData } from "./Register";
import { useEffect } from "react";


const Profile = () => {
    const formMethods = useForm<RegisterFormData>();
    const { register, handleSubmit, formState: { errors }, setValue  } = formMethods;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();

    const { data: user } = useQuery("loadAccount", apiClient.loadAccount,
        {
            onError: () => { }
        }
    );

    useEffect(() => {
        if (user) {
            setValue('firstName', user.firstName);
            setValue('lastName', user.lastName);
            setValue('email', user.email);
            setValue('mobile', user.mobile);
            setValue('imageUrl', user.imageUrl);
        }
    }, [user, setValue]);

    const mutation = useMutation(apiClient.updateProfile, {
        onSuccess: async () => {
            showToast({ message: "Updated Profile!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate('/');
        },
        onError: (error: Error) => { showToast({ message: error.message, type: "ERROR" }) },
    });

    const onSubmit = handleSubmit((formDataJson: RegisterFormData) => {
        const formData = new FormData();
        formData.append('email', formDataJson.email);
        formData.append('firstName', formDataJson.firstName);
        formData.append('lastName', formDataJson.lastName);
        formData.append('mobile', formDataJson.mobile);
        formData.append('password', formDataJson.password);
        formData.append('confirmPassword', formDataJson.password);
        formData.append('imageUrl', formDataJson.imageUrl);

        if (formDataJson.imageFile) {
            formData.append('imageFile', formDataJson.imageFile);
        }

        console.log(formData);
        
        mutation.mutate(formData);
    });


    return (
        <>
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <h2 className="text-3xl font-bold">Profile</h2>
                <div className="flex flex-col md:flex-row gap-5">
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        First Name
                        <input className="border rounded w-full py-1 px-2 font-normal"
                            {...register("firstName", {
                                required: "This feild is required",
                                pattern: {
                                    value: /^[A-Za-z]+(?: [A-Za-z]+)*$/, message: 'Only alphabets are allowed, Eg:- Ananthu'
                                }
                            })}></input>
                        {errors.firstName && (<span className="text-red-500">{errors.firstName.message}</span>)}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Last Name
                        <input className="border rounded w-full py-1 px-2 font-normal"
                            {...register("lastName", {
                                required: "This feild is required",
                                pattern: {
                                    value: /^[A-Za-z]+(?: [A-Za-z]+)*$/, message: 'Only alphabets are allowed, Eg:- M A'
                                }
                            })}></input>
                        {errors.lastName && (<span className="text-red-500">{errors.lastName.message}</span>)}
                    </label>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Email
                        <input type="email"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...register('email', {
                                required: "This feild is required",
                                pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, message: "Enter a valid Email, Eg:- user@example.com" },
                            })}></input>
                        {errors.email && (<span className="text-red-500">{errors.email.message}</span>)}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Mobile
                        <input type="tel"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...register("mobile", {
                                required: "This feild is required",
                                pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10 digit mobile number" },
                            })}></input>
                        {errors.mobile && (<span className="text-red-500">{errors.mobile.message}</span>)}
                    </label>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Password
                        <input type="password" placeholder="Confirm password for updation"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...register("password", {
                                required: "This feild is required",
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{6,}$/,
                                    message: "Enter a valid password with uppercase, lowercase, digits & special characters(Minimum length of 6), Eg:- A5dfg$"
                                },
                            })}>
                        </input>
                        {errors.password && (<span className="text-red-500">{errors.password.message}</span>)}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Profile Picture
                        <input
                            type="file"
                            accept="image/*"
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...register("imageFile")}
                        />
                    </label>
                </div>
                <span>
                    <button type="submit" className="bg-black text-blue-300 p-2 font-bold hover:text-white text-xl">
                        Update Profile
                    </button>
                </span>
            </form>
        </>
    );
};

export default Profile;
