const prisma = require("./../models/index");
const schools = require("./data.json").schools;

async function main() {
  try {
    for (const school of schools) {
      const result = await prisma.school.upsert({
        where: { name: school.name },
        update: { title: school.title },
        create: { name: school.name, title: school.title },
      });

      console.log(result);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
