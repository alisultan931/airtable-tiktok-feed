"use client";

import { useState, useRef, useMemo } from "react";

export default function VideoFeed({ records }: any) {
  const [filterDate, setFilterDate] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  /* -----------------------------
     FILTER RECORDS BY DATE
  ------------------------------ */
  const filteredRecords = useMemo(() => {
    return records.filter((record: any) => {
      if (!filterDate) return true;

      const dateValue = record.fields["Date Added"];
      if (!dateValue) return false;

      const recordDate = new Date(dateValue).toLocaleDateString("en-CA");
      return recordDate === filterDate;
    });
  }, [records, filterDate]);

  /* -----------------------------
     FLATTEN ALL VIDEOS
  ------------------------------ */
  const videos = useMemo(() => {
    return filteredRecords.flatMap((record: any, recordIndex: number) => {
      const urls =
        record.fields["Raw Video URLs"]?.split("\n").filter(Boolean) || [];

      return urls
        .map((url: string, urlIndex: number) => {
          const match = url.match(/video\/(\d+)/);
          const id = match ? match[1] : null;

          if (!id) return null;

          return {
            key: `${recordIndex}-${urlIndex}`,
            id,
            title: record.fields.Title,
            insight: record.fields.Insight,
            date: record.fields["Date Added"],
          };
        })
        .filter(Boolean);
    });
  }, [filteredRecords]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase">
            Mojo’s Daily TikTok Dig
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (dateInputRef.current?.showPicker) {
                  dateInputRef.current.showPicker();
                } else {
                  dateInputRef.current?.click();
                }
              }}
              className="px-3 py-1 bg-black text-yellow-400 rounded hover:bg-zinc-900 transition cursor-pointer"
            >
              {filterDate
                ? new Date(filterDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "FILTER BY DATE"}
            </button>

            <input
              ref={dateInputRef}
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="hidden"
            />

            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= FEED ================= */}
      <main className="mt-[60px] h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory bg-gradient-to-b from-black to-zinc-900">
        {videos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No videos found for this date.
          </p>
        ) : (
          videos.map((video: any) => (
            <div
              key={video.key}
              className="snap-start min-h-screen flex flex-col items-center pt-16 md:pt-28 pb-16 px-4 bg-black border border-yellow-400/30"
            >
              <iframe
                src={`https://www.tiktok.com/embed/${video.id}`}
                className="w-full max-w-md mx-auto rounded-lg"
                height="580"
                allowFullScreen
              />

              <h2 className="border-b-2 border-yellow-400 pb-1 text-xl font-bold mt-4 text-white text-center">
                {video.title}
              </h2>

              <p className="text-sm text-gray-400">
                {new Date(video.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Toggle Button */}
              <button
                onClick={() =>
                  setOpenIndex(openIndex === video.key ? null : video.key)
                }
                className="mt-2 text-yellow-400 hover:underline"
              >
                {openIndex === video.key ? "Hide Info" : "Show Info"}
              </button>

              {/* Animated Description */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === video.key
                    ? "max-h-40 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-400 max-w-lg mx-auto text-center leading-relaxed px-2 text-sm md:text-base">
                  {video.insight}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}