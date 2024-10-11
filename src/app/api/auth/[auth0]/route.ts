import {
  handleAuth,
  handleLogin,
  handleLogout,
  updateSession,
} from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = handleAuth();
