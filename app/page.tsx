import VideoFeed from "./components/VideoFeed";

async function getVideos() {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_NAME}?view=API%20View`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
      next: { revalidate: 180 }, // cache for 3 mins
    }
  );

  const data = await res.json();

  return data.records;
}

export default async function Home() {
  const records = await getVideos();

  return <VideoFeed records={records} />;
}