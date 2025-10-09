// actions/user.ts
"use server";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { registerSchema } from "@/zod-validation/auth";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUser(data: unknown) {
  try {
    const validatedData = registerSchema.parse(data);
    const {
      firstName,
      lastName,
      country,
      telephone,
      reference,
      subscribe,
      password,
    } = validatedData;

    // Validate if email or phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { telephone },
    });

    if (existingUser) {
      throw new AppError("Telephone already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create referral code (example)
    const refCode = `REF${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Create user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        telephone,
        country,
        refCode,
        referredBy: reference || null,
        password: hashedPassword,
        role: "user",
        subscribe,
      },
    });

    return serverActionCreatedResponse({
      message: "User created successfully.  ",
      userId: user.id,
    });
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}
export async function deleteUserByEmail(email: string, path: string) {
  try {
    if (!email) {
      throw new AppError("Email  is required for deletion");
    }
    const existingUser = await prisma.user.findUnique({
      where: { telephone: email },
    });

    if (!existingUser) {
      throw new AppError("User not found");
    }

    // Delete the clinic (cascades to related records)
    const user = await prisma.user.delete({
      where: { telephone: email },
    });

    revalidatePath(path || "/");

    return serverActionSuccessResponse({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ deleteUserByEmail error:", error);
    return serverActionErrorResponse(error || "Failed to delete user");
  }
}

export async function verifyOtp(email: string, code: string) {
  try {
    const otpEntry = await prisma.otp.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!otpEntry) {
      throw new AppError("Invalid OTP");
    }

    if (otpEntry.expiresAt < new Date()) {
      throw new AppError("OTP has expired");
    }
    await prisma.user.update({
      where: { telephone: email },
      data: { emailVerified: new Date() },
    });

    // Delete OTP after successful verification
    await prisma.otp.deleteMany({ where: { email, code } });

    return serverActionCreatedResponse({
      message: "Verify otp successfully.",
    });
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function sendOtp(email: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { telephone: email },
    });
    if (!existingUser) {
      throw new AppError("Email is not found !");
    }

    const otp = generateOtp();

    // Delete old OTPs (optional) or just create a new one
    await prisma.otp.deleteMany({ where: { email } });

    // Save new OTP with expiry
    await prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
    });

    return serverActionCreatedResponse({ message: "OTP sent successfully" });
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}

// Reset password action
export async function resetPasswordAction({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { telephone: email },
      data: { password: hashedPassword },
    });

    revalidatePath("/login");

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}
