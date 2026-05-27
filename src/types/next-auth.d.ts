import type { DefaultSession } from "next-auth";
import type { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      ruolo: UserRole;
      utente: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    ruolo: UserRole;
    utente: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    ruolo?: UserRole;
    utente?: string;
  }
}
