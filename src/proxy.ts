import { NextResponse, type NextRequest } from "next/server";
import { config } from "@/lib/config";
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (
    !config().indexable ||
    request.nextUrl.search ||
    request.nextUrl.pathname === "/el-sello"
  )
    response.headers.set("X-Robots-Tag", "noindex, follow");
  return response;
}
