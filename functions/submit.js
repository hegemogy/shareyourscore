export async function onRequestPost(context) {
  const { request, env } = context;

  const formData = await request.formData();
  const firstName = formData.get("first_name");
  const middleInitial = formData.get("middle_initial") || null;
  const lastName = formData.get("last_name");
  const birthday = formData.get("birthday");

  if (!firstName || !lastName || !birthday) {
    return new Response("Missing required fields", { status: 400 });
  }

  const createdAt = new Date().toISOString();

  await env.DB
    .prepare(
      `INSERT INTO submissions (first_name, middle_initial, last_name, birthday, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(firstName, middleInitial, lastName, birthday, createdAt)
    .run();

  return new Response("Thank you. Your submission was recorded.", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
