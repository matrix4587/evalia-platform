import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import type { UserRole, AccountStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { env } from "@/server/config/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      console.log("=== 🚀 LOGIN ATTEMPT START ===");
      console.log("Raw credentials:", { email: raw?.email, passwordLength: raw?.password ? String(raw.password).length : 0 });

      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) {
        console.log("❌ Zod validation failed:", parsed.error.errors);
        return null;
      }

      const { email, password } = parsed.data;

      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          console.log(`❌ User not found in database for email: ${email}`);
          return null;
        }

        console.log(`✅ User found. ID: ${user.id}, Status: ${user.status}, Role: ${user.role}`);
        console.log(`Password hash exists: ${!!user.passwordHash}`);

        if (!user.passwordHash) {
          console.log("❌ No password hash in DB");
          return null;
        }

        if (user.status === "BANNED" || user.status === "SUSPENDED") {
          console.log(`❌ User is ${user.status}`);
          return null;
        }

        const valid = await compare(password, user.passwordHash);
        
        if (!valid) {
          console.log("❌ Password comparison failed. Incorrect password.");
          return null;
        }

        console.log("✅ Password valid. Login successful.");
        
        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(err => console.error("Failed to update lastLoginAt:", err));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          status: user.status,
        };

      } catch (error) {
        console.error("❌ DATABASE ERROR DURING AUTHORIZE:", error);
        return null;
      }
    },
  }),
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role;
        token.status = (user as { status?: AccountStatus }).status;
      }
      
      if (token.id) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, status: true },
          });
          if (fresh) {
            token.role = fresh.role;
            token.status = fresh.status;
          }
        } catch (error) {
          console.error("JWT Callback DB Error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as UserRole) ?? "WORKER";
        session.user.status = (token.status as AccountStatus) ?? "ACTIVE";
      }
      return session;
    },
  },
  trustHost: true,
};