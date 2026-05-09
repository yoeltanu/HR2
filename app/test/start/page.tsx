import Navbar from "@/components/layout/Navbar";
import CandidateForm from "@/components/candidate/CandidateForm";

export default function StartPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="px-4 py-10">
        <CandidateForm />
      </section>
    </main>
  );
}
