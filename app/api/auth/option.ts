import { getUserByEmail } from "@/config/user/uer-api.config";
import prisma from "@/lib/db";
import { UserRole } from "@/types/common";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Telephone",
          type: "text",
          placeholder: "your@email.com or 015XXXXXXXX",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email/Telephone and password are required");
          }

          const { email, password } = credentials;

          // Determine if input is email or telephone
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          let foundUser = null;

          foundUser = await getUserByEmail(email);

          if (!foundUser) {
            throw new Error("User not found");
          }

          // Compare hashed password
          const passwordValid = await bcrypt.compare(
            password,
            foundUser.password
          );
          if (!passwordValid) {
            throw new Error("Invalid credentials");
          }

          // Return user object for NextAuth
          return {
            id: foundUser.id,

            name: foundUser.name,
            telephone: foundUser.telephone,
            role: foundUser.role,
            image: foundUser.image,
          } as User;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 6 * 60 * 60, // 6 hours
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as User).role as UserRole;
        token.telephone = (user as any).telephone;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        (session.user as any).telephone = token.telephone as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
};
