declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
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