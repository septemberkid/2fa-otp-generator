"use client"
import React, {useCallback, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {generateOtp} from "@/app/utils";

function GeneratorForm() {
  const TIMESPAN = 30;
  const [secretKey, setSecretKey] = useState<string>('SES2FPTEAUELZVQA')
  const [oneTimePassword, setOneTimePassword] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(TIMESPAN);
  const [isActive, setIsActive] = useState(false);

  const handleGetOtp = useCallback(() => {
    if (!secretKey) {
      return
    }
    const {otp, remainingTime} = generateOtp(secretKey);
    setOneTimePassword(otp);
    setTimeLeft(remainingTime);
    setIsActive(true);
  }, [secretKey]);

  const handleReset = () => {
    setSecretKey('');
    setOneTimePassword('');
    setTimeLeft(TIMESPAN);
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive) {
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const {otp, remainingTime} = generateOtp(secretKey);
          setOneTimePassword(otp);
          return remainingTime;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, secretKey]);

  return (
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader className={"text-center"}>
            <CardTitle className="text-xl">2FA Generator</CardTitle>
            <CardDescription>
              Generate your 2FA using secret key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className={"grid gap-6"}>
                <div className="grid gap-2">
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <Input
                      id="secret-key"
                      type="text"
                      placeholder="SES2FPTEAUELZVQA"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      className={'uppercase'}
                      required
                  />
                </div>
                <div className="grid gap-2">
                  <Button type="button" className="w-full hover:cursor-pointer" disabled={!secretKey} onClick={handleGetOtp}>
                    Get OTP
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          {oneTimePassword && (
              <CardFooter className={'grid gap-6'}>
                <div className="w-full grid gap-2">
                  <Label>Your OTP (Remaining: {timeLeft}s)</Label>
                  <Input
                      id="secret-key"
                      type="text"
                      value={oneTimePassword}
                      className={'w-full font-bold text-xl'}
                      readOnly={true}
                  />
                </div>
                <Button type="button" className="bg-red-500 hover:bg-red-600 hover:cursor-pointer" onClick={handleReset}>
                  Reset
                </Button>
              </CardFooter>
          )}
        </Card>
      </div>
  )
}

export default GeneratorForm;