async function getVideos() {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.records;
}

export default async function Home() {
  const records = await getVideos();

  return (
    <main className="p-6">
      {records.map((record: any, idx: number) =>
        record.fields["Raw Video URLs"]
          ?.split("\n")
          .filter(Boolean)
          .map((url: string, i: number) => {
            const id = url.split("/video/")[1]?.split("?")[0];

            return (
              <div key={`${idx}-${i}`} className="mb-12">
                <iframe
                  src={`https://www.tiktok.com/embed/${id}`}
                  width="325"
                  height="580"
                  allowFullScreen
                />

                <h2 className="text-xl font-bold mt-4">
                  {record.fields.Title}
                </h2>

                <p className="text-gray-600">
                  {record.fields.Insight}
                </p>
              </div>
            );
          })
      )}
    </main>
  );
}