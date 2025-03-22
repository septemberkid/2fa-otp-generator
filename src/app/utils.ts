import crypto from "crypto";
import { base32Decode } from '@ctrl/ts-base32';

const generateOtp = (secret: string, timeStep = 30, digits = 6): {
  otp: string,
  remainingTime: number
} => {
  const key = Buffer.from(base32Decode(secret));
  const epoch = Math.floor(Date.now() / 1000);
  let counter = Math.floor(epoch / timeStep);
  const remainingTime: number = timeStep - (epoch % timeStep);
  const counterBuffer = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    counterBuffer[i] = counter & 0xff;
    counter >>= 8;
  }
  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();
  const offset: number = hmac[hmac.length - 1] & 0x0f;
  const binaryCode: number =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);
  const otp: number = binaryCode % 10 ** digits;
  return {
    otp: otp.toString().padStart(digits, "0"),
    remainingTime,
  }
}

export { generateOtp };