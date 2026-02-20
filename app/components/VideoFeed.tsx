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
    <main className="p-6 max-w-3xl mx-auto">
      {/* Date Filter + Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-6 py-4 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Branding */}
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Mojo’s Daily TikTok Dig
          </h1>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <label className="text-white text-sm font-medium whitespace-nowrap">
              Filter by date:
            </label>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-600 rounded px-3 py-2 bg-transparent text-white
                         [&::-webkit-calendar-picker-indicator]:invert"
            />

            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
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
                  className="mb-12 bg-gray-900 rounded-2xl shadow-lg p-4 transition transform hover:scale-[1.01] hover:shadow-xl"
                >
                  <iframe
                    src={`https://www.tiktok.com/embed/${id}`}
                    className="w-full max-w-md mx-auto"
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
                    <p className="text-gray-400">
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