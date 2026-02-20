"use client";

import { useState } from "react";

export default function VideoFeed({ records }: any) {
  const [filterDate, setFilterDate] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const filteredRecords = records.filter((record: any) => {
    if (!filterDate) return true;

    const dateValue = record.fields["Date Added"];
    if (!dateValue) return false;

    const recordDate = new Date(dateValue)
      .toISOString()
      .split("T")[0];

    return recordDate === filterDate;
  });

  return (
    <main className="mt-[60px] h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md px-4 py-2 pt-[env(safe-area-inset-top)] shadow-md">
        <div className="flex items-center justify-between gap-3">
          
          {/* Branding */}
          <h1 className="text-base md:text-xl font-semibold text-white whitespace-nowrap">
            Mojo’s Daily TikTok Dig
          </h1>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs md:text-sm">
              Filter:
            </span>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-600 rounded px-2 py-1 bg-transparent text-white text-xs md:text-sm
                         [&::-webkit-calendar-picker-indicator]:invert"
            />

            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="px-2 py-1 bg-gray-700 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {filteredRecords.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No videos found for this date.
        </p>
      ) : (
        filteredRecords.map((record: any, idx: number) =>
          record.fields["Raw Video URLs"]
            ?.split("\n")
            .filter(Boolean)
            .map((url: string, i: number) => {
              const id = url.split("/video/")[1]?.split("?")[0];
              const uniqueKey = `${idx}-${i}`;
              const isOpen = openIndex === uniqueKey;

              return (
                <div
                  key={uniqueKey}
                  className="snap-start min-h-screen flex flex-col items-center md:justify-center justify-start pt-16 md:pt-28 pb-16 px-4 bg-gray-900"
                >
                  {/* Video */}
                  <iframe
                    src={`https://www.tiktok.com/embed/${id}`}
                    className="w-full max-w-md mx-auto rounded-lg"
                    height="580"
                    allowFullScreen
                  />

                  {/* Title */}
                  <h2 className="text-xl font-bold mt-4 text-white text-center">
                    {record.fields.Title}
                  </h2>

                  {/* Date */}
                  <p className="text-sm text-gray-400">
                    {new Date(record.fields["Date Added"]).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>

                  {/* Toggle Button */}
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : uniqueKey)
                    }
                    className="mt-2 text-blue-400 hover:text-blue-300 hover:underline font-medium transition"
                  >
                    {isOpen ? "Hide Info" : "Show Info"}
                  </button>

                  {/* Expandable Insight */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-40 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-400 mt-4 max-w-lg mx-auto text-center leading-relaxed break-words px-2 text-sm md:text-base">
                      {record.fields.Insight}
                    </p>
                  </div>
                </div>
              );
            })
        )
      )}
    </main>
  );
}