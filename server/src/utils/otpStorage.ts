const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

export default otpStorage;
