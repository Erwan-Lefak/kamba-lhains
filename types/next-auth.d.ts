import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
    };
  }

  interface User {
    firstName?: string;
    lastName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
  }
}
