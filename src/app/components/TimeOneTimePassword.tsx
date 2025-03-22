"use client"
import {useCallback, useEffect, useState} from "react";
import {generateOtp} from "@/app/utils";

export default function TimeOneTimePassword() {
  const [secretKey, setSecretKey] = useState('SES2FPTEAUELZVQA');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const handleGetOTP = useCallback(() => {
    if (secretKey) {
      const {otp: newOtp, remainingTime: newRemainingTime} = generateOtp(secretKey);
      setOtp(newOtp);
      setTimeLeft(newRemainingTime);
      setIsActive(true);
    }
  }, [secretKey])

  const handleReset = () => {
    setSecretKey('');
    setOtp('');
    setTimeLeft(30);
    setIsActive(false);
  };
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const {otp: newOtp, remainingTime: newRemainingTime} = generateOtp(secretKey);
            setOtp(newOtp);
            return newRemainingTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, otp, secretKey]);


  return (
      <div className={'mt-40'}>
        <div className={'flex flex-col items-center justify-center h-screen text-center p-4'}>
          <h1 className="text-2xl font-bold mb-4">2FA OTP Generator</h1>
          <input
              type="text"
              placeholder="Enter Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="border p-2 rounded w-64 mb-4"
          />
          <button
              onClick={handleGetOTP}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Get OTP
          </button>
          {otp && (
              <div className="text-lg font-mono">
                <p className="text-2xl font-bold">OTP: {otp}</p>
                <p>Time remaining: {timeLeft}s</p>
                <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                  Reset
                </button>
              </div>
          )}
        </div>
      </div>
  )
}