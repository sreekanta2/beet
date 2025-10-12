import {
  addService,
  deleteService,
  getServices,
  updateService,
} from "@/action/action.banking-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "UserId required" }, { status: 400 });

  const services = await getServices(userId);
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await addService(body);
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "Id required" }, { status: 400 });

  const result = await updateService(body.id, body);
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "Id required" }, { status: 400 });

  const result = await deleteService(body.id);
  return NextResponse.json(result);
}
