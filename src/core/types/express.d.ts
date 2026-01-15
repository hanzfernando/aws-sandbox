declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: "USER" | "ADMIN" | "SUPERADMIN";
      };
      auth?: {
        type: AuthType;
        credentialId: string | null;
        source: AuthSource;
        scopes: string[];
      };
    }
  }
}

export {};