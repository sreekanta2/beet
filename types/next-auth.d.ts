import "next-auth";
import { DefaultSession } from "next-auth";
import { UserRole } from "./common";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    telephone?: string | null;
    image?: string | null;
    role: UserRole | undefined;
    emailVerified?: Date | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole | undefined;
      telephone?: string | null; // ✅ Added this line
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole | undefined;
    telephone?: string; // ✅ already correct
    name?: string;
    picture?: string;
  }
}
