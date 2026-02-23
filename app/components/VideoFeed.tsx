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
      <main className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scroll-pt-[60px] scroll-smooth overscroll-y-contain bg-gradient-to-b from-black to-zinc-900 pt-[60px] pb-20 md:pb-10">
        {videos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No videos found for this date.
          </p>
        ) : (
          videos.map((video: any) => (
            <div
              key={video.key}
              className="snap-card snap-start min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-6"
            >
              {/* FLIP CARD */}
              <div className="relative w-full max-w-md h-[70vh] perspective">
                <div
                  className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                    openIndex === video.key ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT — VIDEO */}
                  <div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-black">
                    <button
                      onClick={() => setOpenIndex(video.key)}
                      className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center animate-pulse shadow-lg"
                    >
                      i
                    </button>

                    <iframe
                      src={`https://www.tiktok.com/embed/${video.id}`}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>

                  {/* BACK — INFO */}
                  <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-black text-white rounded-lg p-6 flex flex-col justify-center text-center">
                    <button
                      onClick={() => setOpenIndex(null)}
                      className="absolute top-3 right-3 text-yellow-400 text-xl"
                    >
                      ✕
                    </button>

                    <h2 className="text-xl font-bold mb-3">
                      {video.title}
                    </h2>

                    <p className="text-gray-400 leading-relaxed">
                      {video.insight}
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(video.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}