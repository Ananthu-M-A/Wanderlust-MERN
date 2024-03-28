import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../../../api-client';
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RegisterFormData } from "../../../../../types/types";

const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
    const [showComponent, setShowComponent] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [otp, setOtp] = useState<string>('');
    const [timerRunning, setTimerRunning] = useState<boolean>(false);

    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({ message: "OTP sent, Check your email!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            setShowComponent(true);
            setTimerRunning(true);
        },
        onError: (error: Error) => { showToast({ message: error.message, type: "ERROR" }) },
    });

    const mutationOtp = useMutation(apiClient.verifyRegistration, {
        onSuccess: async () => {
            showToast({ message: "Registration Successfull!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate('/');
        },
        onError: (error: Error) => { showToast({ message: error.message, type: "ERROR" }) },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerRunning) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime === 0) {
                        setTimerRunning(false);
                        clearInterval(interval);
                        setShowComponent(false);
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerRunning]);

    const onSubmit = handleSubmit((data) => {
        setTimeLeft(30);
        mutation.mutate(data);
        setTimerRunning(true);
    });

    const handleOtpVerification = () => {
        mutationOtp.mutate(otp);
    }

    return (
        <>
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <h2 className="text-3xl font-bold">Create an Account</h2>
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
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password"
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
                    Confirm Password
                    <input type="password"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("confirmPassword", {
                            validate: (val) => {
                                if (!val) {
                                    return "This feild is required";
                                } else if (watch("password") !== val) {
                                    return "Your passwords does not match";
                                }
                            }
                        })}></input>
                    {errors.confirmPassword && (<span className="text-red-500">{errors.confirmPassword.message}</span>)}
                </label>
                <span>
                    <button type="submit" className="bg-black text-blue-300 p-2 font-bold hover:text-white text-xl">
                        Send OTP
                    </button>
                </span>
            </form>

            {showComponent && timeLeft > 0 && (
                <div>
                    <span className="mt-4 font-semibold">Timer: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
            )}

            {!showComponent && timeLeft < 0 && (
                <div>
                    <span className="mt-4 font-bold text-red-600">OTP Timeout! Send Again.</span>
                </div>
            )}

            {showComponent && timeLeft > 0 && (
                <>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Enter OTP
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border rounded w-full py-1 px-2 font-normal"
                        />
                    </label>
                    <button
                        onClick={handleOtpVerification}
                        className="bg-black text-blue-300 p-2 font-bold hover:text-white text-xl mt-4"
                    >
                        Create Account
                    </button>
                </>
            )}
        </>
    );
};

export default Register;
