import { NextResponse } from "next/server";

// भुगतान प्रदाता तय/कॉन्फ़िगर होने तक कोई भुगतान सक्रिय नहीं होता और कोई सफलता नहीं दिखाई जाती।
export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ message: "अमान्य अनुरोध।" }, { status: 400 }); }
  const amount = Number(body?.amount);
  if (!Number.isInteger(amount) || amount < 1 || amount > 100000) {
    return NextResponse.json({ message: "अमान्य राशि।" }, { status: 400 });
  }
  if (!process.env.PAYMENT_PROVIDER || !process.env.PAYMENT_KEY_SECRET) {
    return NextResponse.json({ status: "not_configured", message: "भुगतान व्यवस्था जल्द उपलब्ध होगी।" }, { status: 503 });
  }
  // चरण 5: प्रदाता का आधिकारिक API देखकर यहाँ 'pending' दान रिकॉर्ड और भुगतान आदेश बनेगा।
  return NextResponse.json({ status: "not_implemented", message: "भुगतान व्यवस्था जल्द उपलब्ध होगी।" }, { status: 501 });
}
