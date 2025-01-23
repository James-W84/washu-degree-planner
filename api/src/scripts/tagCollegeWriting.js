const prisma = require("./../models/index");

async function main() {
  try {
    await prisma.tag.upsert({
      where: {
        name: "CWP",
      },
      create: {
        name: "CWP",
      },
      update: {},
    });

    const collegeWritingCourseIds = await prisma.course.findMany({
      where: { department: { code: "L59" } },
      select: { id: true },
    });

    await Promise.all(
      collegeWritingCourseIds.map((course) =>
        prisma.course.update({
          where: { id: course.id },
          data: { tags: { connect: { name: "CWP" } } },
        })
      )
    );
  } catch (error) {
    console.error(error);
  }
}

main();
