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

import { ShopperProfileInput } from "@/types/common";
export async function createUser(data: unknown) {
  try {
    // 1️⃣ Validate input using Zod
    const {
      firstName,
      lastName,
      country,
      telephone,
      reference, // referral code (string)
      subscribe,
      password,
    } = registerSchema.parse(data);

    // 2️⃣ Use Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 2.1️⃣ Check existing phone
      const existingUser = await tx.user.findUnique({
        where: { telephone },
        select: { id: true },
      });
      if (existingUser) throw new AppError("Telephone already registered.");

      // 2.2️⃣ Handle referral
      let referredById: string | null = null;
      if (reference) {
        const referrer = await tx.user.findUnique({
          where: { referralCode: reference },
          select: { id: true },
        });
        if (!referrer) throw new AppError("Invalid referral code.");
        referredById = referrer.id;
      }

      // 2.3️⃣ Generate referral code and serial number
      const referralCode = `REF${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
      const lastUser = await tx.user.findFirst({
        orderBy: { serialNumber: "desc" },
        select: { serialNumber: true },
      });
      const serialNumber = (lastUser?.serialNumber ?? 0) + 1;

      // 2.4️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 2.5️⃣ Create user
      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          telephone,
          password: hashedPassword,
          referralCode,
          serialNumber,
          role: "user",
          referredById,
        },
        select: { id: true, referredById: true },
      });

      // 2.6️⃣ Optional: handle referral bonus
      // if (referredById) {
      //   const BONUS_POINTS = 50;
      //   await tx.pointTransaction.create({
      //     data: {
      //       userId: referredById,
      //       amount: BONUS_POINTS,
      //       type: "REFERRAL_SIGNUP_BONUS",
      //       meta: { newUserId: user.id },
      //     },
      //   });

      //   await tx.user.update({
      //     where: { id: referredById },
      //     data: {
      //       cachedBalance: { increment: BONUS_POINTS },
      //       totalPointsEarned: { increment: BONUS_POINTS },
      //     },
      //   });
      // }

      return user;
    });

    // ✅ Success
    return serverActionCreatedResponse({
      message: result.referredById
        ? "User created successfully with referral bonus applied."
        : "User created successfully.",
      userId: result.id,
    });
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}

export async function updatePassword(data: {
  userId: string;
  password: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.update({
      where: { id: data.userId },
      data: {
        password: hashedPassword,
      },
      select: { id: true, referredById: true },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}
export async function upsertShopperProfile(data: ShopperProfileInput) {
  // Update basic user info
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      name: `${data.firstName} ${data.lastName}`,
      telephone: data.telephone,
      email: data?.email,
      emailVerified: new Date(), // optional
    },
  });

  // Upsert Additional table
  const additional = await prisma.additional.upsert({
    where: { userId: data.userId },
    update: {
      country: data.country,
      nid: data.nid,
      nomineId: data.nomineId,
      nomineName: data.nomineName,
      nominiRelation: data.nominiRelation,
      division: data.division,
      district: data.district,
      upazila: data.upazila,
      category: data.category,
      location: data.location,
      updatedAt: new Date(),
    },
    create: {
      userId: data.userId,
      country: data.country,
      nid: data.nid,
      nomineId: data.nomineId,
      nomineName: data.nomineName,
      nominiRelation: data.nominiRelation,
      division: data.division,
      district: data.district,
      upazila: data.upazila,
      category: data.category || "",
      location: data.location || "",
    },
  });

  // Optional: Revalidate profile page if using ISR
  revalidatePath("/dashboard/profile");

  return additional;
}

export async function getShopperProfile(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      telephone: true,
      emailVerified: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      additionalInfo: {
        select: {
          country: true,
          nid: true,
          nomineId: true,
          nomineName: true,
          nominiRelation: true,
          division: true,
          district: true,
          upazila: true,
          category: true,
          location: true,
        },
      },
    },
  });

  if (!user) return null;
  return user;
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
