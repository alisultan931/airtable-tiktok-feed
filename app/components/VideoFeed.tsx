"use client";

import { useState, useRef } from "react";

export default function VideoFeed({ records }: any) {
  const [filterDate, setFilterDate] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

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
    <>
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-2 shadow-md">

        <div className="flex items-center justify-between">

          {/* Branding */}
          <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase">
            Mojo’s Daily TikTok Dig
          </h1>

          {/* Date Filter */}
          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                dateInputRef.current?.showPicker?.() ||
                dateInputRef.current?.click()
              }
              className="px-3 py-1 bg-black text-yellow-400 rounded hover:bg-zinc-900 transition"
            >
              {filterDate
                ? new Date(filterDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "FILTER BY DATE"}
            </button>

            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="px-2 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 transition"
              >
                Clear
              </button>
            )}

            {/* Hidden native date picker */}
            <input
              ref={dateInputRef}
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="absolute opacity-0 pointer-events-none"
            />

          </div>
        </div>
      </div>

      {/* FEED */}
      <main className="mt-[60px] h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-black to-zinc-900">

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

                return (
                  <div
                    key={`${idx}-${i}`}
                    className="snap-start min-h-screen flex flex-col items-center justify-start pt-16 md:pt-28 pb-16 px-4 bg-black border border-yellow-400/30"
                  >
                    <iframe
                      src={`https://www.tiktok.com/embed/${id}`}
                      className="w-full max-w-md mx-auto rounded-lg"
                      height="580"
                      allowFullScreen
                    />

                    <h2 className="border-b-2 border-yellow-400 pb-1 text-xl font-bold mt-4 text-white text-center">
                      {record.fields.Title}
                    </h2>

                    <p className="text-sm text-gray-400">
                      {new Date(
                        record.fields["Date Added"]
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {/* Info Toggle */}
                    <button
                      onClick={() =>
                        setOpenIndex(
                          openIndex === `${idx}-${i}`
                            ? null
                            : `${idx}-${i}`
                        )
                      }
                      className="mt-2 text-yellow-400 hover:text-yellow-300 hover:underline transition"
                    >
                      {openIndex === `${idx}-${i}`
                        ? "Hide Info"
                        : "Show Info"}
                    </button>

                    {/* Animated Description */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === `${idx}-${i}`
                          ? "max-h-40 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-400 max-w-lg mx-auto text-center leading-relaxed break-words px-2 text-sm md:text-base">
                        {record.fields.Insight}
                      </p>
                    </div>
                  </div>
                );
              })
          )
        )}
      </main>
    </>
  );
}