import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("checking...");
  const [backendData, setBackendData] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus("connected");
        setBackendData(data);
      })
      .catch((err) => {
        setBackendStatus("offline (start backend on :5000)");
      });
  }, []);

  return (
    <>
      <Head>
        <title>Studify · MAKAUT Study Platform</title>
        <meta
          name="description"
          content="MAKAUT-focused AI study platform tailored to syllabus and exam patterns."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-[#FCF5F4] text-[#3B3540] px-6 py-12 md:py-20 flex flex-col items-center">
        {/* Header container */}
        <div className="w-full max-w-4xl space-y-6">
          {/* Top pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase bg-[#E7A9B5]/20 text-[#3B3540] border border-[#E7A9B5]/40 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#E7A9B5] animate-pulse"></span>
            Studify Platform · Environment Ready
          </div>

          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#3B3540]">
            Calm, focused study for <span className="font-semibold">MAKAUT</span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-[#3B3540]/80 leading-relaxed max-w-2xl">
            Turn your class notes, PDFs, and scanned pages into marks-aligned study sheets,
            topic-wise gap reports, and authentic examination practice.
          </p>

          {/* Backend Connection Indicator */}
          <div className="p-4 rounded-2xl bg-white/70 border border-[#E7A9B5]/30 backdrop-blur-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-medium">Backend Service:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  backendStatus === "connected"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {backendStatus}
              </span>
            </div>
            {backendData && (
              <span className="text-xs text-[#3B3540]/60 font-mono">
                {backendData.service} · {backendData.version}
              </span>
            )}
          </div>

          {/* Feature pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="p-6 rounded-2xl bg-white/60 border border-[#E7A9B5]/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs tracking-wider uppercase font-semibold text-[#E7A9B5]">Pillar 1</div>
              <h3 className="text-lg font-medium mt-1 mb-2">Universal Ingestion</h3>
              <p className="font-serif text-sm text-[#3B3540]/75">
                Digital PDFs, clean scans, and handwritten camera captures cleaned and organized by topic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/60 border border-[#E7A9B5]/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs tracking-wider uppercase font-semibold text-[#E7A9B5]">Pillar 2</div>
              <h3 className="text-lg font-medium mt-1 mb-2">Session Study</h3>
              <p className="font-serif text-sm text-[#3B3540]/75">
                Map your notes to official MAKAUT syllabus topics with gap reports and 1, 5, and 15-mark answer skeletons.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/60 border border-[#E7A9B5]/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs tracking-wider uppercase font-semibold text-[#E7A9B5]">Pillar 3</div>
              <h3 className="text-lg font-medium mt-1 mb-2">Understanding Checks</h3>
              <p className="font-serif text-sm text-[#3B3540]/75">
                Targeted MCQs, short answers, self-evaluation checklists, and adaptive spaced-repetition loops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/60 border border-[#E7A9B5]/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs tracking-wider uppercase font-semibold text-[#E7A9B5]">Pillar 4</div>
              <h3 className="text-lg font-medium mt-1 mb-2">Chapter Exam Papers</h3>
              <p className="font-serif text-sm text-[#3B3540]/75">
                Authentic question blueprint matching real MAKAUT regulation patterns with countdown timer and printable layouts.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
