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
  return data.records;
}

export default async function Home() {
  const records = await getVideos();

  return <VideoFeed records={records} />;
}