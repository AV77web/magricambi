import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "@/src/lib/db";
import type { DbUser, UserRole } from "@/src/types/user";

type DbUserRow = DbUser & RowDataPacket;

function maskIdentifier(identifier: string): string {
  if (identifier.includes("@")) {
    const [name = "", domain = ""] = identifier.split("@");
    const visibleName = name.slice(0, 2);

    return `${visibleName}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
  }

  if (identifier.length <= 2) {
    return "*".repeat(identifier.length);
  }

  return `${identifier.slice(0, 2)}${"*".repeat(identifier.length - 2)}`;
}

function authLog(message: string, details?: Record<string, unknown>): void {
  console.log(`[auth] ${message}`, details ?? "");
}

function authError(message: string, error: unknown, details?: Record<string, unknown>): void {
  console.error(`[auth] ${message}`, {
    ...details,
    error: error instanceof Error ? error.message : String(error),
  });
}

function isUserRole(value: string): value is UserRole {
  return ["admin", "manager", "user", "sviluppo"].includes(value);
}

async function findActiveUser(identifier: string): Promise<DbUser | null> {
  let rows: DbUserRow[];

  try {
    [rows] = await db.execute<DbUserRow[]>(
      `SELECT id, utente, mail, password, ruolo, attivo, last_login
       FROM utenti
       WHERE attivo = 1
         AND (utente = :identifier OR mail = :identifier)
       LIMIT 1`,
      { identifier },
    );
  } catch (error) {
    authError("Errore durante la query utente attivo", error, {
      identifier: maskIdentifier(identifier),
    });
    throw error;
  }

  const user = rows[0];

  if (!user) {
    authLog("Nessun utente attivo trovato", {
      identifier: maskIdentifier(identifier),
    });
    return null;
  }

  if (!isUserRole(user.ruolo)) {
    authLog("Utente trovato con ruolo non valido", {
      userId: user.id,
      ruolo: user.ruolo,
    });
    return null;
  }

  authLog("Utente attivo trovato", {
    userId: user.id,
    utente: user.utente,
    ruolo: user.ruolo,
  });

  return user;
}

async function updateLastLogin(userId: number): Promise<void> {
  try {
    await db.execute<ResultSetHeader>(
      "UPDATE utenti SET last_login = NOW() WHERE id = :userId",
      { userId },
    );
    authLog("last_login aggiornato", { userId });
  } catch (error) {
    authError("Errore durante aggiornamento last_login", error, { userId });
    throw error;
  }
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
        const startedAt = Date.now();
        const identifier = String(credentials?.identifier ?? "").trim();
        const password = String(credentials?.password ?? "");
        const maskedIdentifier = maskIdentifier(identifier);

        authLog("Tentativo login ricevuto", {
          identifier: maskedIdentifier,
          hasIdentifier: Boolean(identifier),
          hasPassword: Boolean(password),
        });

        if (!identifier || !password) {
          authLog("Login respinto: campi mancanti", {
            identifier: maskedIdentifier,
            hasIdentifier: Boolean(identifier),
            hasPassword: Boolean(password),
          });
          return null;
        }

        const user = await findActiveUser(identifier);

        if (!user) {
          authLog("Login respinto: utente non trovato o non valido", {
            identifier: maskedIdentifier,
            durationMs: Date.now() - startedAt,
          });
          return null;
        }

        let passwordMatches = false;

        try {
          passwordMatches = await bcrypt.compare(password, user.password);
        } catch (error) {
          authError("Errore durante confronto password bcrypt", error, {
            userId: user.id,
            durationMs: Date.now() - startedAt,
          });
          throw error;
        }

        if (!passwordMatches) {
          authLog("Login respinto: password non valida", {
            userId: user.id,
            durationMs: Date.now() - startedAt,
          });
          return null;
        }

        await updateLastLogin(user.id);

        authLog("Login riuscito", {
          userId: user.id,
          ruolo: user.ruolo,
          durationMs: Date.now() - startedAt,
        });

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
