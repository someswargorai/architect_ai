import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface CustomToken {
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CustomSession extends DefaultSession {
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface UserType {
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  accessToken?: string;
  refreshToken?: string;
}

const BASE_API = process.env.NEXT_PUBLIC_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        try {
          const res = await axios.post(
            `${BASE_API}/auth/google-login`,
            {
              email: profile.email,
              provider: "google",
            },
            { headers: { "Content-Type": "application/json" } },
          );

          if (res.data.success) {
            return {
              id: res?.data?.data?.user?.id,
              email: res?.data?.data?.user?.email,
              firstName: res?.data?.data?.user?.firstName,
              lastName: res?.data?.data?.user?.lastName,
              role: res?.data?.data?.user?.role,
              profilePic: res?.data?.data?.user?.profilePic || "",
              designation: res?.data?.data?.user?.designation || "",
              accessToken: res?.data?.data?.accessToken,
              refreshToken: res?.data?.data?.refreshToken,
            };
          }
          return res.data;
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const message = err?.response?.data?.message;
            return null;
          }
        }
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        rememberMe: { label: "RememberMe", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await axios.post(
            `https://architect-ai-seven.vercel.app/api/auth`,
            {
              email: credentials.email.trim(),
              password: credentials.password.trim(),
              name: credentials.name?.trim() || undefined,
              rememberMe: credentials.rememberMe,
            },
            { headers: { "Content-Type": "application/json" } },
          );

          if (res.data.success) {
            return {
              id: res?.data?.data?.user?.id,
              email: res?.data?.data?.user?.email,
              firstName: res?.data?.data?.user?.firstName,
              lastName: res?.data?.data?.user?.lastName,
              accessToken: res?.data?.data?.accessToken,
              refreshToken: res?.data?.data?.refreshToken,
            };
          }

          throw new Error(res.data.message || "Authentication failed");
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const message =
              err?.response?.data?.message || "Invalid credentials";
            throw new Error(message);
          }
          throw err;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as UserType;
        token.id = customUser.id;
        token.email = customUser.email;
        token.accessToken = customUser.accessToken;
        token.refreshToken = customUser.refreshToken;
        token.firstName = customUser.firstName;
        token.lastName = customUser.lastName;
        token.profilePic = customUser.profilePic;
      }
      return token;
    },

    async session({ session, token }) {
      const customSession = session as CustomSession;
      const customToken = token as CustomToken;
      customSession.refreshToken = customToken.refreshToken;
      customSession.accessToken = customToken.accessToken;
      customSession.email = customToken.email;
      customSession.id = customToken.id;
      customSession.firstName = customToken.firstName;
      customSession.lastName = customToken.lastName;
      customSession.profilePic = customToken.profilePic;

      return customSession;
    },
  },

  pages: {
    signIn: "/login",
  },
};