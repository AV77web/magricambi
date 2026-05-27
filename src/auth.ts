import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/src/lib/db";
import type { DbUser, UserRole } from "@/src/types/user";

type DbUserRow = DbUser & RowDataPacket;

function isUserRole(value: string): value is UserRole {
  return ["admin", "manager", "user", "sviluppo"].includes(value);
}

async function findActiveUser(identifier: string): Promise<DbUser | null> {
  const [rows] = await db.execute<DbUserRow[]>(
    `SELECT id, utente, mail, password, ruolo, attivo, last_login
     FROM utenti
     WHERE attivo = 1
       AND (utente = :identifier OR mail = :identifier)
     LIMIT 1`,
    { identifier },
  );

  const user = rows[0];

  if (!user || !isUserRole(user.ruolo)) {
    return null;
  }

  return user;
}

async function updateLastLogin(userId: number): Promise<void> {
  await db.execute<ResultSetHeader>(
    "UPDATE utenti SET last_login = NOW() WHERE id = :userId",
    { userId },
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credenziali",
      credentials: {
        identifier: { label: "Utente o email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!identifier || !password) {
          return null;
        }

        const user = await findActiveUser(identifier);

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        await updateLastLogin(user.id);

        return {
          id: String(user.id),
          name: user.utente,
          email: user.mail,
          ruolo: user.ruolo,
          utente: user.utente,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.ruolo = user.ruolo;
        token.utente = user.utente;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id ?? "";
      session.user.ruolo = token.ruolo ?? "user";
      session.user.utente = token.utente ?? session.user.name ?? "";

      return session;
    },
  },
});
