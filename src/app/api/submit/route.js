// app/api/submit/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { SendMailClient } from "zeptomail";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, answers } = body; // answers: [0,2,1, ...] indexes

    if (!name || !email || !answers) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // — server-side correct answers (keep secret here)
    const correct = [1, 1, 0, 2, 3]; // example: indexes for 5 questions
    let score = 0;
    for (let i = 0; i < correct.length; i++) {
      if (answers[i] === correct[i]) score++;
    }

    // personalize recommendation
    let recommendation = "Keep practicing!";
    if (score >= 4) recommendation = "Excellent — you're advanced. Try our advanced course.";
    else if (score >= 2) recommendation = "Good — review the intermediate topics.";
    else recommendation = "Beginner — start with fundamentals and basic tutorials.";

    // save to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "quizdb");
    const col = db.collection("results");
    const doc = { name, email, answers, score, recommendation, createdAt: new Date() };
    await col.insertOne(doc);

    // send confirmation email via ZeptoMail
    const zm = new SendMailClient({ url: "api.zeptomail.com/", token: process.env.ZEPTOMAIL_TOKEN });

    const fromAddr = process.env.ZEPTOMAIL_FROM || "no-reply@example.com";
    await zm.sendMail({
      from: { address: fromAddr, name: "Quiz App" },
      to: [{ email_address: { address: email, name } }],
      subject: `Your quiz result — ${score}/5`,
      textbody: `Hi ${name},\n\nYou scored ${score}/5.\nRecommendation: ${recommendation}\n\nThanks!`,
      htmlbody: `<p>Hi ${name},</p><p>You scored <strong>${score}/5</strong>.</p><p><strong>Recommendation:</strong> ${recommendation}</p>`
    });

    return NextResponse.json({ ok: true, score, recommendation });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
