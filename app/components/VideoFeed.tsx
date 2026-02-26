"use client";

import { useState, useMemo, useEffect, useRef } from "react";

export default function VideoFeed({ records }: any) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [visibleVideo, setVisibleVideo] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<any>({ type: "all" });
  const [draftFilter, setDraftFilter] = useState<any>(dateFilter);

  /* ---------------- PRESET RANGE HELPER ---------------- */
  const getPresetRange = (preset: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (preset) {
      case "today":
        break;
      case "7days":
        start.setDate(today.getDate() - 6);
        break;
      case "thisMonth":
        start.setDate(1);
        break;
      case "lastMonth":
        start.setMonth(today.getMonth() - 1, 1);
        end.setMonth(today.getMonth(), 0);
        break;
    }

    return {
      start: start.toLocaleDateString("en-CA"),
      end: end.toLocaleDateString("en-CA"),
    };
  };

  /* ---------------- FILTER RECORDS ---------------- */
  const filteredRecords = useMemo(() => {
    return records.filter((record: any) => {
      if (dateFilter.type === "all") return true;

      const dateValue = record.fields["Date Added"];
      if (!dateValue) return false;

      const recordDate = new Date(dateValue).toLocaleDateString("en-CA");

      let start = dateFilter.start;
      let end = dateFilter.end;

      if (dateFilter.type === "preset" && dateFilter.preset) {
        const range = getPresetRange(dateFilter.preset);
        start = range.start;
        end = range.end;
      }

      if (!start || !end) return true;

      return recordDate >= start && recordDate <= end;
    });
  }, [records, dateFilter]);

  /* ---------------- FLATTEN VIDEOS ---------------- */
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

  /* ---------------- ACTIVE FILTER LABEL ---------------- */
const getActiveFilterLabel = () => {
  if (dateFilter.type === "all") return "All Dates";

  if (dateFilter.type === "preset") {
    switch (dateFilter.preset) {
      case "today":
        return "Today";
      case "7days":
        return "Last 7 Days";
      case "thisMonth":
        return "This Month";
      case "lastMonth":
        return "Last Month";
      default:
        return "Filtered";
    }
  }

  if (dateFilter.type === "range" && dateFilter.start && dateFilter.end) {
    const format = (d: string) =>
      new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    return `${format(dateFilter.start)} – ${format(dateFilter.end)}`;
  }

  return "Filtered";
};

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [dateFilter]);

    useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.getAttribute("data-key");
          if (key) setVisibleVideo(key);
        }
      });
    },
    { threshold: 0.15 }
  );

  const elements = document.querySelectorAll("[data-video]");
  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [videos]);

  return (
    <>
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black px-4 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-black uppercase">
            Mojo’s Daily TikTok Dig
          </h1>

          <button
            onClick={() => {
              setDraftFilter(dateFilter);
              setShowFilter(true);
            }}
            className="px-3 py-1 bg-black text-yellow-400 rounded text-sm flex items-center gap-2"
          >
            <span>{getActiveFilterLabel()}</span>

            {dateFilter.type !== "all" && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  const cleared = { type: "all" };
                  setDateFilter(cleared);
                  setDraftFilter(cleared);
                }}
                className="text-xs bg-yellow-400 text-black px-1 rounded"
              >
                ✕
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center overflow-x-hidden px-2">
          <div className="bg-zinc-900 w-full max-w-md rounded-t-2xl md:rounded-2xl p-5 space-y-4 box-border overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Filter Videos</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-yellow-400 text-xl"
              >
                ✕
              </button>
            </div>

            {/* PRESETS */}
            <div className="grid grid-cols-2 gap-2">
              {[
                ["today", "Today"],
                ["7days", "Last 7 Days"],
                ["thisMonth", "This Month"],
                ["lastMonth", "Last Month"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    const newFilter = { type: "preset", preset: value };
                    setDateFilter(newFilter);
                    setDraftFilter(newFilter);
                    setShowFilter(false);
                  }}
                  className={`py-2 rounded text-sm transition ${
                    dateFilter.type === "preset" &&
                    dateFilter.preset === value
                      ? "bg-yellow-400 text-black"
                      : "bg-black text-yellow-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* CUSTOM RANGE */}
            <div className="space-y-3">
              <p className="text-white font-bold">Custom Range</p>

              <p className="text-xs text-yellow-400">Start Date</p>
              <div className="w-full min-w-0 overflow-hidden rounded border border-zinc-700 bg-white">
                <input
                  type="date"
                  value={draftFilter.start || ""}
                  onChange={(e) =>
                    setDraftFilter((prev: any) => ({
                      ...prev,
                      type: "range",
                      start: e.target.value,
                    }))
                  }
                  className="block w-full min-w-0 px-3 py-2 text-black bg-white outline-none"
                />
              </div>

              <p className="text-xs text-yellow-400">End Date</p>
              <div className="w-full min-w-0 overflow-hidden rounded border border-zinc-700 bg-white">
                <input
                  type="date"
                  value={draftFilter.end || ""}
                  onChange={(e) =>
                    setDraftFilter((prev: any) => ({
                      ...prev,
                      type: "range",
                      end: e.target.value,
                    }))
                  }
                  className="block w-full min-w-0 px-3 py-2 text-black bg-white outline-none"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  const cleared = { type: "all" };
                  setDateFilter(cleared);
                  setDraftFilter(cleared);
                  setShowFilter(false);
                }}
                className="flex-1 bg-zinc-700 text-white py-2 rounded"
              >
                Clear
              </button>

              <button
                onClick={() => {
                  if (draftFilter.type === "range") {
                    setDateFilter(draftFilter);
                  }
                  setShowFilter(false);
                }}
                className="flex-1 bg-yellow-400 text-black py-2 rounded font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEED */}
      <main
        ref={scrollRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-pt-16 scroll-smooth overscroll-y-contain bg-linear-to-b from-black to-zinc-900 pt-16 pb-20 md:pb-10"
      >
        {videos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No videos found.
          </p>
        ) : (
          videos.map((video: any) => (
            <div
              key={video.key}
              data-video
              data-key={video.key}
              className="snap-start min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-6"
            >
              <div className="relative w-full max-w-md h-[70vh] perspective">
                <div
                  className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                    openIndex === video.key ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT */}
                  <div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-black flex flex-col">
                    <button
                      onClick={() => setOpenIndex(video.key)}
                      className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg"
                    >
                      i
                    </button>

                    <div className="flex-1">
                      {visibleVideo === video.key ? (
                        <iframe
                          src={`https://www.tiktok.com/embed/${video.id}`}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-gray-400">
                          Loading video…
                        </div>
                      )}
                    </div>

                    <h2 className="border-b-2 border-yellow-400 pb-1 text-lg font-bold mt-3 text-white text-center px-2">
                      {video.title}
                    </h2>

                    <p className="text-sm text-gray-400 text-center mb-2">
                      {new Date(video.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* BACK */}
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