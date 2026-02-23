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

          <div className="flex items-center gap-2 relative">
            {/* Date Filter Button */}
            <div className="relative">
              <div className="px-3 py-1 bg-black text-yellow-400 rounded text-sm">
                {filterDate
                  ? new Date(filterDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "FILTER BY DATE"}
              </div>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* Clear Button */}
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="px-3 py-1 bg-black text-yellow-400 rounded hover:bg-zinc-900 transition text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= FEED ================= */}
      <main className="mt-[60px] h-[calc(100vh-60px)] overflow-y-scroll snap-y snap-mandatory scroll-pt-[60px] scroll-smooth overscroll-y-contain bg-gradient-to-b from-black to-zinc-900 pb-20 md:pb-10">
        {videos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No videos found for this date.
          </p>
        ) : (
          videos.map((video: any) => (
            <div
              key={video.key}
              className="snap-card snap-start min-h-[calc(100vh-60px)] flex flex-col items-center justify-start px-4 py-6"
            >
              {/* Video */}
              <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black mb-3">
                <iframe
                  src={`https://www.tiktok.com/embed/${video.id}`}
                  className="w-full h-[50vh] md:h-[580px]"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <h2 className="border-b-2 border-yellow-400 pb-1 text-xl font-bold mt-4 text-white text-center">
                {video.title}
              </h2>

              {/* Date */}
              <p className="text-sm text-gray-400">
                {new Date(video.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Toggle Info Button */}
              <button
                onClick={(e) => {
                  const newKey =
                    openIndex === video.key ? null : video.key;
                  setOpenIndex(newKey);

                  if (newKey) {
                    const target =
                      e.currentTarget.closest(".snap-card");

                    setTimeout(() => {
                      target?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 250);
                  }
                }}
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