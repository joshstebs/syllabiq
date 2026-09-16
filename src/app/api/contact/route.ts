import { NextResponse } from "next/server";
import { getContactInquiries, addContactInquiry } from "@/lib/storage";

export async function GET() {
  try {
    const inquiries = getContactInquiries();
    return NextResponse.json({
      success: true,
      inquiries,
      total: inquiries.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, organization, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const inquiry = addContactInquiry({
      name: name.trim(),
      email: email.trim(),
      organization: organization ? organization.trim() : undefined,
      category: category || "general",
      message: message.trim()
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received by Harbour and Main.",
      inquiry
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
