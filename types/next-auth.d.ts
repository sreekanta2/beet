import "next-auth";
import { DefaultSession } from "next-auth";
import { UserRole } from "./common";

declare module "next-auth" {
  /**
   * User type - represents the user model in your database
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole | undefined;
    emailVerified?: Date | null;
  }

  /**
   * Session type - what gets returned when you use useSession() or getServerSession()
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole | undefined;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  /**
   * JWT token type - what gets stored in the JWT
   */
  interface JWT {
    id: string;
    role: UserRole | undefined;
    email?: string;
    name?: string;
    picture?: string;
  }
}
