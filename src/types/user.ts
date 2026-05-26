export type UserRole = "admin" | "manager" | "user" | "sviluppo";

export interface DbUser {
  id: number;
  utente: string;
  mail: string;
  password: string;
  ruolo: UserRole;
  attivo: 0 | 1;
  last_login?: Date | string | null;
}
