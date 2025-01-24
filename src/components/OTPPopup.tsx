"use client";

import { useEffect, useState, useRef } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from './ui/button';

import { toast } from "sonner";
import Spinner from './Spinner';
// import { handleCredentialsSignin } from '@/app/actions/authActions';
import { getSession } from 'next-auth/react';

interface OTPPopupProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setIsValidatingNumberScreen: (isValidating: boolean) => void;
    formData: string;
    resendTimer: number;
    setResendTimer: (resendTimer: number) => void;
    sendOTP: () => Promise<void>;
}

const OTPPopup: React.FC<OTPPopupProps> = ({ sendOTP, setResendTimer, isOpen, setIsOpen, setIsValidatingNumberScreen, formData, resendTimer }) => {

    const [resendAttempts, setResendAttempts] = useState(0);
    const [otp, setOtp] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const initialOTPSent = useRef(false);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        initialOTPSent.current = true;
    }, [isOpen, formData]);

    useEffect(() => {
        if (otp.length === 6) {
            handleOTPSubmit();
        }
    }, [otp]);

    const handleResendOTP = async () => {
        if (resendAttempts < 3) {
            setResendAttempts(resendAttempts + 1);
            setResendTimer(30);
            await sendOTP();
        } else {
            toast.error('Maximum resend attempts reached.');
        }
    };
    const handleOTPSubmit = async () => {
        setIsValidating(true); // Start loading state
        try {
            // const result = await handleCredentialsSignin({ mobileNumber: formData, otp });

            // if (result?.message) {
            //     console.log("Sign-in result:", result.message);
            // } else {
            //     const session = await getSession();
            //     console.log("Sign-in successful:", session?.user);
            // }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleChange = (value: string) => {
        setOtp(value);
    };

    return (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center shadow-sm bg-gray-100'>
            <div className="mb-3 text-center">
                <h3 className='fw-bold'>OTP Verification</h3>
                <span className='block text-gray-400 font-thin text-sm'>
                    Please check your mobile for OTP
                </span>
            </div>
            <div className="mb-3">
                <InputOTP maxLength={6} onChange={handleChange} disabled={isValidating}>
                    <InputOTPGroup className='mx-auto gap-2'>
                        {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} className='bg-white ' />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>

            {isValidating && (
                <div className="flex justify-center">
                    <Spinner />
                </div>
            )}

            <Button
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || resendAttempts >= 3 || isValidating}
                className={`p-2 px-4 border border-transparent rounded-md shadow-sm text-white ${resendTimer > 0 || isValidating ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-500'
                    }`}
            >
                {resendTimer > 0 ? `Request OTP in ${resendTimer}s` : 'Request OTP'}
            </Button>
        </div>
    );
};

export default OTPPopup;