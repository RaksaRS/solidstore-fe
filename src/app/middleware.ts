// middleware.js
import { getSession } from "@auth0/nextjs-auth0";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export default withMiddlewareAuthRequired({});

export const config = {
  matcher: "/(app.*)",
};
