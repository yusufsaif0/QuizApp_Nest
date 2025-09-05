"use client";
import { useState } from "react";

const QUESTIONS = [
  { q: "Which language is mainly used with React?", opts: ["Python", "JavaScript", "Ruby", "Go"] },
  { q: "What does HTML stand for?", opts: ["Hyper Text Markup Lang", "Hyperlinks and Text Markup", "Hold The Line", "High Text Markup Language"] },
  { q: "Which is a NoSQL DB?", opts: ["MongoDB", "MySQL", "Postgres", "SQLite"] },
  { q: "Which command installs dependencies with npm?", opts: ["npm remove", "npm init", "npm install", "npm start"] },
  { q: "Which hook manages state in React?", opts: ["useEffect", "useMemo", "useState", "useContext"] }
];

export default function QuizForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function choose(idx) {
    const copy = [...answers];
    copy[step-1] = idx;
    setAnswers(copy);
  }

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, answers })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  if (result) {
    if (!result.ok) return <div>Error: {result.error}</div>;
    return (
      <div>
        <h2>Thanks, {name} — your score: {result.score}/5</h2>
        <p>Recommendation: {result.recommendation}</p>
      </div>
    );
  }

  return (
    <div style={{maxWidth:700, margin:"0 auto"}}>
      {step === 0 && (
        <div>
          <h2>Enter your details</h2>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <br />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <br />
          <button onClick={() => setStep(1)} disabled={!name || !email}>Start Quiz</button>
        </div>
      )}

      {step >= 1 && step <= QUESTIONS.length && (
        <div>
          <h3>Question {step}/{QUESTIONS.length}</h3>
          <p>{QUESTIONS[step-1].q}</p>
          <div>
            {QUESTIONS[step-1].opts.map((opt, i) => (
              <div key={i}>
                <label>
                  <input type="radio"
                         name={`q-${step}`}
                         checked={answers[step-1] === i}
                         onChange={() => choose(i)} />
                  {" "}{opt}
                </label>
              </div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <button onClick={()=> setStep(s => s-1)} disabled={step===1}>Back</button>
            <button onClick={()=> setStep(s => s+1)} disabled={answers[step-1] === null} style={{marginLeft:8}}>
              {step === QUESTIONS.length ? "Review & Submit" : "Next"}
            </button>
          </div>
        </div>
      )}

      {step === QUESTIONS.length + 1 && (
        <div>
          <h3>Review</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Your answers:</strong></p>
          <ol>
            {QUESTIONS.map((q, i) => <li key={i}>{q.q} — <em>{q.opts[answers[i]] ?? "No answer"}</em></li>)}
          </ol>
          <button onClick={()=> setStep(1)}>Edit</button>
          <button onClick={handleSubmit} disabled={loading} style={{marginLeft:8}}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
