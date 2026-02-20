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
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Date Filter + Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md px-4 py-3 shadow-lg">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

    {/* Branding */}
    <h1 className="text-lg md:text-2xl font-bold text-white">
      Mojo’s Daily TikTok Dig
    </h1>

    {/* Filters */}
    <div className="flex items-center gap-2 flex-wrap">

      <span className="text-gray-300 text-sm">
        Filter:
      </span>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="border border-gray-600 rounded px-2 py-1 bg-transparent text-white text-sm
                   [&::-webkit-calendar-picker-indicator]:invert"
      />

      {filterDate && (
        <button
          onClick={() => setFilterDate("")}
          className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition"
        >
          Clear
        </button>
      )}

    </div>

  </div>
</div>

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
                  className="snap-start min-h-screen flex flex-col items-center md:justify-center justify-start pt-24 md:pt-28 pb-16 px-4 bg-gray-900"
                >
                  <iframe
                    src={`https://www.tiktok.com/embed/${id}`}
                    className="w-full max-w-md mx-auto rounded-lg"
                    height="580"
                    allowFullScreen
                  />

                  <h2 className="text-xl font-bold mt-4">
                    {record.fields.Title}
                  </h2>

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

                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : uniqueKey)
                    }
                    className="mt-2 text-blue-400 hover:text-blue-300 hover:underline font-medium transition"
                  >
                    {isOpen ? "Hide Info" : "Show Info"}
                  </button>

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