export default async function listUsers({ container }) {
  const query = container.resolve("query")
  const { data: users } = await query.graph({
    entity: "user",
    fields: ["id", "email"],
  })
  console.log("USERS:", JSON.stringify(users))
}
