import QuizForm from "./components/QuizForm";
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
     <h1>Simple Next.js Quiz</h1>
      <p>5-question multi-part form. Results saved to MongoDB and an automated email will be sent.</p>
      <QuizForm />
    </div>
  );
}
