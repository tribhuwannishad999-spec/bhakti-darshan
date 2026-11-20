import { NextResponse } from "next/server";

// चरण 5 में प्रदाता के आधिकारिक डॉक्स के अनुसार signature verification और डुप्लिकेट सुरक्षा जोड़ी जाएगी।
// अभी यह किसी भी अनुरोध को स्वीकार नहीं करता, ताकि कोई नकली "भुगतान सफल" दर्ज न हो सके।
export async function POST() {
  return NextResponse.json({ error: "Webhook not enabled" }, { status: 501 });
}
