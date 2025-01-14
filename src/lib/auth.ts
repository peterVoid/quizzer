import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { generateFromEmail } from "unique-username-generator";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      profile(profile) {
        const username = generateFromEmail(profile.email, 10);

        return {
          id: profile.sub,
          username,
          name: profile.given_name ?? profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      profile(profile) {
        const username = generateFromEmail(profile.email, 10);

        return {
          id: profile.id,
          image: profile.avatar_url,
          name: profile.name,
          email: profile.email,
          username,
        };
      },
    }),
    Credentials({
      credentials: {
        identifier: {
          label: "Identifier",
          type: "text",
          placeholder: "Identifier",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email or Username and password are required");
        }

        const isEmail = credentials.identifier.includes("@");

        const user = await prisma.user.findUnique({
          where: isEmail
            ? { email: credentials.identifier }
            : { username: credentials.identifier },
        });

        if (!user || !user.hashedPassword) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid Password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.name = token.name;
        session.user.username = token.username;
      }

      const findUser = await prisma.user.findUnique({
        where: { id: token.id },
      });

      if (findUser) {
        session.user.onboarded = findUser.onboarded;
        session.user.image = findUser.image;
        session.user.isAdmin = findUser.isAdmin;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      const findUser = await prisma.user.findUnique({
        where: { id: token.id },
      });

      if (findUser) {
        token.username = findUser.username;
        token.isAdmin = findUser.isAdmin;
      }

      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
