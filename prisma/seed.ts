import db from "db"

async function seed() {
  console.log("seed ran, but no data seeded (intentionally)")
}

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
