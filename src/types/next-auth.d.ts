import type { DefaultSession } from "next-auth";
import type { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      ruolo: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    ruolo: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    ruolo?: UserRole;
  }
}
