import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      type: "error",
      code: "ENDPOINT_REMOVED",
      message: "This endpoint has been retired. Use /api/human-verify instead.",
    },
    { status: 410 },
  );
}
