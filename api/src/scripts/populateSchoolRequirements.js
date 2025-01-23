const prisma = require("./../models/index");
const schoolRequirements = require("./data/schoolRequirementData.json");
const { departmentIdFromCode } = require("./data/dataUtils");

async function main() {
  for (let schoolObj of schoolRequirements) {
    const {
      electiveRequirements,
      tagRequirements,
      courseRequirementGroups,
      startYear,
    } = schoolObj.requirementSet;

    try {
      const school = await prisma.school.findUnique({
        where: { id: schoolObj.id },
        include: { requirementConnector: true },
      });

      let requirementConnector;

      if (school.requirementConnector) {
        requirementConnector = school.requirementConnector;
      } else {
        requirementConnector = await prisma.requirementConnector.create({
          data: { school: { connect: { id: schoolObj.id } } },
        });
      }

      const courseReqGroupCreate = await Promise.all(
        courseRequirementGroups.map(async (grp) => ({
          type: grp.type,
          courses: {
            connect: await Promise.all(
              grp.courses.map(async (code) => {
                const [departmentCode, courseCode] = code.split(" ");
                const departmentId = await departmentIdFromCode(departmentCode);
                return {
                  departmentId_courseCode: {
                    departmentId: departmentId,
                    courseCode: courseCode,
                  },
                };
              })
            ),
          },
        }))
      );

      const reqSetData = {
        ...(electiveRequirements.length > 0 && { electiveRequirements }),
        ...(tagRequirements.length > 0 && {
          tagRequirements: {
            create: tagRequirements.map((req) => ({
              credits: req.credits,
              tags: {
                connect: req.tags.map((tagName) => ({ name: tagName })),
              },
            })),
          },
        }),
        ...(courseRequirementGroups.length > 0 && {
          courseRequirementGroups: {
            create: courseReqGroupCreate,
          },
        }),
        startYear: startYear,
        requirementConnector: {
          connect: {
            id: requirementConnector.id,
          },
        },
      };

      const originalReqSet = await prisma.requirementSet.findUnique({
        where: {
          uniqueRequirementSet: {
            requirementConnectorId: requirementConnector.id,
            startYear: startYear,
          },
        },
      });

      if (originalReqSet) {
        await prisma.requirementSet.delete({
          where: {
            uniqueRequirementSet: {
              requirementConnectorId: requirementConnector.id,
              startYear: startYear,
            },
          },
        });
      }

      await prisma.requirementSet.create({ data: reqSetData });
    } catch (error) {
      console.error(error);
      console.log(schoolObj.name);
    }
  }
}

async function find() {
  const crses = [
    { type: "AND", courses: ["L24 131", "L24 132"] },
    { type: "SINGLE", courses: ["B50 2610"] },
    { type: "SINGLE", courses: ["B50 2620"] },
    { type: "SINGLE", courses: ["B59 120"] },
    { type: "SINGLE", courses: ["B59 121"] },
    { type: "SINGLE", courses: ["B59 220"] },
    { type: "SINGLE", courses: ["B52 340"] },
    { type: "SINGLE", courses: ["B54 290"] },
    { type: "OR", courses: ["B59 292", "L11 1021"] },
    { type: "SINGLE", courses: ["B53 100"] },
    { type: "SINGLE", courses: ["B53 150A"] },
    { type: "SINGLE", courses: ["B53 201"] },
    { type: "SINGLE", courses: ["B55 370"] },
    { type: "SINGLE", courses: ["B56 360"] },
    { type: "SINGLE", courses: ["B57 356"] },
  ];

  for (const c of crses) {
    for (const code of c.courses) {
      const [departmentCode, courseCode] = code.split(" ");
      try {
        const departmentId = await departmentIdFromCode(departmentCode);
        const reslt = await prisma.course.findMany({
          where: {
            departmentId,
            courseCode,
          },
        });

        // console.log(reslt);

        if (reslt.length === 0) {
          console.log(code);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

main();
// find();
