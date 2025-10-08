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
import { generateRefCode } from "@/lib/utils";
import { RegisterSchema } from "@/zod-validation/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createUser(data: unknown) {
  try {
    const validatedData = RegisterSchema.parse(data);
    const refCode = generateRefCode();
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new AppError("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // 1️⃣ Create user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        refCode,
        referredBy: validatedData?.refBy,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    // 2️⃣ Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // 3️⃣ Save OTP in DB with expiry (5 min example)
    await prisma.otp.create({
      data: {
        email: newUser.email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // 4️⃣ Send OTP via email
    await sendEmail({
      to: newUser.email,
      subject: "Your verification code",
      text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
    });

    return serverActionCreatedResponse({
      message: "User created successfully. OTP sent to email.",
      userId: newUser.id,
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
      where: { email },
    });

    if (!existingUser) {
      throw new AppError("User not found");
    }

    // Delete the clinic (cascades to related records)
    const user = await prisma.user.delete({
      where: { email },
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
      where: { email },
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
    const existingUser = await prisma.user.findUnique({ where: { email } });
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
      where: { email },
      data: { password: hashedPassword },
    });

    revalidatePath("/login");

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}
