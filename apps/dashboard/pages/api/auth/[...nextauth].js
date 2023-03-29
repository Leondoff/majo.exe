import clientPromise from "@majoexe/util/src/database/database.js";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { credentials, social } from "../../../config";

// https://next-auth.js.org/configuration/options
export const authOptions = {
 adapter: MongoDBAdapter(clientPromise),
 providers: [
  DiscordProvider({
   clientId: credentials.clientId,
   clientSecret: credentials.clientSecret,
   authorization: { params: { scope: "identify email guilds" } },
   profile(profile) {
    return profile;
   },
  }),
 ],
 pages: {
  signIn: "/auth/login",
  signOut: "/auth/signout",
 },
 secret: credentials.secret,
 session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
 },
 theme: {
  colorScheme: "auto", // "auto" | "dark" | "light"
  brandColor: "#111927",
  logo: social.logo,
  buttonText: "#000000",
 },
 callbacks: {
  async jwt({ token, account, profile }) {
   if (account) {
    token = {
     ...token,
     ...account,
     ...profile,
     role: "user",
    };
    return token;
   } else {
    return token;
   }
  },
  async session({ session, token }) {
   return { ...session, ...token };
  },
 },
};

export default NextAuth(authOptions);