const puppeteer = require("puppeteer"); //must have chromium
const lodash = require("lodash");
const schools = require("./data/schools.json");
const prisma = require("./../models/index");

function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function innerHTML(page, e) {
  return await page.evaluate((e) => e.innerHTML, e);
}

function splitNameAndCode(input) {
  const match = input.match(/^(.*)\(([^()]+)\)$/);
  if (match) {
    return {
      name: match[1].trim(),
      code: match[2].trim(),
    };
  }

  throw new Error("Invalid name and code string");
}

function splitCourseCodeString(code) {
  const regex = /^(\S+)(?:\s+(.*\s+)?(\S+))?$/;
  const match = code.match(regex);

  if (!match) {
    throw new Error("Invalid course code string format.");
  }

  return [match[1], match[2].trim(), match[3]];
}

function extractCredits(str) {
  return parseFloat(str.split(" ", 2)[0]);
}

async function main(args) {
  const semester = args.length > 2 ? Number(args[2]) : 1;
  if (isNaN(semester)) {
    throw new Error("Invalid semester argument. Please give an integer value.");
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://acadinfo.wustl.edu/CourseListings/Semester/Listing.aspx"
  );

  let button;

  if (semester > 4) {
    await page.click("#Body_hlMoreSemesters");

    let moreSems = await page.$("#Body_divMoreSems");
    let inc = 0;

    while (!moreSems) {
      await sleep();
      moreSems = await page.$("#Body_divMoreSems");
      ++inc;
    }
    button = await page.$(`#Body_repMoreSems_hlMore_${semester - 5}`);
  } else {
    button = await page.$(`#Body_hlSemester${semester}`);
  }

  const targetSem = await innerHTML(page, button);

  await button.click();

  let title = await page.$("#Body_lblSelectedSemesterDepartment");
  let text = await innerHTML(page, title);
  while (!text.includes(targetSem)) {
    await sleep();
    title = await page.$("#Body_lblSelectedSemesterDepartment");
    text = await innerHTML(page, title);
  }

  let schoolsIterable = schools;

  if (args.length > 3) {
    if (parseInt(args[3]) < 1 || parseInt(args[3]) > 5) {
      throw new Error(
        "Expected school argument as integer between 1 and 5, inclusive. Instead recieved " +
          args[3]
      );
    }
    schoolsIterable = [schools[parseInt(args[3]) - 1]];
  }

  for (let school of schoolsIterable) {
    console.log("Started scraping school: " + school.name);

    const [navigationResult] = await Promise.all([
      page
        .waitForNavigation({ waitUntil: "load", timeout: 5000 })
        .catch(() => null),
      page.click(`#Body_repSchools_lnkSchool_${school.webstacLinkId}`),
    ]);

    await page.waitForSelector("#Body_lblSelectedSemesterDepartment");

    let title = await page.$("#Body_lblSelectedSemesterDepartment");

    let text = await innerHTML(page, title);

    while (!text.includes(school.name.replace(/&/g, "&amp;"))) {
      await sleep();
      title = await page.$("#Body_lblSelectedSemesterDepartment");
      text = await innerHTML(page, title);
    }

    const numDepts = await page.$eval(`#Body_dlDepartments tbody`, (tbody) => {
      return tbody.querySelectorAll("td").length;
    });

    const min =
      school.name === "Arts & Sciences" ? 0 : school.name === "Art" ? 2 : 1; //first valid department within school

    for (let i = min; i < numDepts; ++i) {
      const deptButton = await page.$(`#Body_dlDepartments_lnkDept_${i}`);
      if (!deptButton) {
        continue;
      }
      const deptNameCode = await innerHTML(page, deptButton);
      const deptNameCodeFormatted = deptNameCode.replace(/&amp;/g, "&");

      const { name, code } = splitNameAndCode(deptNameCodeFormatted);
      const capitalizedName = lodash.startCase(lodash.lowerCase(name));

      console.log("Started scraping department: " + capitalizedName);

      await deptButton.click();

      try {
        await page.waitForSelector("#tabDeptBar0");

        let deptBarText = await page.$eval("#tabDeptBar0", (table) => {
          const link = table.querySelector("td:nth-child(2) > a.RedLink");
          return link ? link.textContent.trim() : null;
        });

        let counter = 0;
        while (!deptBarText.includes(code)) {
          await sleep();
          deptBarText = await page.$eval("#tabDeptBar0", (table) => {
            const link = table.querySelector("td:nth-child(2) > a.RedLink");
            return link ? link.textContent.trim() : null;
          });
          ++counter;
          if (counter > 30) {
            throw new Error(
              "Waiting for new department courses timed out after 30000 ms."
            );
          }
        }
      } catch (error) {
        //no courses listed or timed out
        console.error(error);

        continue;
      }

      const coursesDiv = await page.$("#Body_oCourseList_tabSelect");
      const courses = await coursesDiv.$$(":scope > div");

      let isIdentifierSet = false;
      let departmentId;

      for (let course of courses) {
        const [code, name, units] = await course.$eval(
          "td:nth-child(2)",
          (td) => {
            return [
              td.querySelector("td:nth-child(1)").textContent.trim(),
              td.querySelector("td:nth-child(2)").textContent.trim(),
              td.querySelector("td:nth-child(3)").textContent.trim(),
            ];
          }
        );

        const [deptCode, deptIdentifier, courseCode] =
          splitCourseCodeString(code);

        const credits = extractCredits(units);

        if (!isIdentifierSet) {
          try {
            const result = await prisma.department.update({
              where: {
                code: deptCode,
              },
              data: {
                identifier: deptIdentifier,
              },
            });

            departmentId = result.id;
          } catch (error) {
            console.error(error);
          }
          isIdentifierSet = true;
        }

        const description = await course.$eval(".DivDetail table", (div) => {
          return div.querySelector("table:nth-of-type(1)").textContent.trim();
        });

        const descriptionTrimmed = description.split("Description:", 2)[1];

        const attributesTable = await course.$("table:nth-of-type(2)");
        const attributesData = await attributesTable.$("td:nth-of-type(2)");
        const attributeNodes = await attributesData.$$("a");

        let attributeKey;
        const attributes = [];

        for (let attribute of attributeNodes) {
          const isAttrKey = await attribute.evaluate((element, className) => {
            return element.classList.contains(className);
          }, "CrsAttr");

          const text = await attribute.evaluate((element) =>
            element.innerText.trim()
          );

          if (isAttrKey) {
            attributeKey = text;
          } else {
            attributes.push(attributeKey + ": " + text);
          }
        }

        try {
          await Promise.all(
            attributes.map(async (attribute) => {
              const result = await prisma.tag.upsert({
                where: { name: attribute },
                update: {},
                create: { name: attribute },
              });
            })
          );

          const result = await prisma.course.upsert({
            where: {
              departmentId_courseCode: {
                departmentId: parseInt(departmentId),
                courseCode: courseCode,
              },
            },
            update: {},
            create: {
              title: name,
              courseCode: courseCode,
              credits: credits,
              department: {
                connect: {
                  id: departmentId,
                },
              },
              description: descriptionTrimmed,
              tags: {
                connect: attributes.map((name) => ({ name })),
              },
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  await browser.close();
}

main(process.argv);
