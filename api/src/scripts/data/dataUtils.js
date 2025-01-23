const prisma = require("./../../models/index");

async function departmentIdFromCode(code) {
  try {
    const department = await prisma.department.findUnique({
      where: { code: code },
    });

    return department.id;
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = { departmentIdFromCode };
