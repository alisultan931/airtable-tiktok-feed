import VideoFeed from "./components/VideoFeed";

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

  // Sort newest first
  const sortedRecords = data.records.sort(
    (a: any, b: any) =>
      new Date(b.fields["Date Added"]).getTime() -
      new Date(a.fields["Date Added"]).getTime()
  );

  return sortedRecords;
}

export default async function Home() {
  const records = await getVideos();

  return <VideoFeed records={records} />;
}