export async function GET() {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  return Response.json(data.records);
}