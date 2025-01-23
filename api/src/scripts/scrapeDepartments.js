//Does not scrape department identifier, e.g. CSE for Computer Science Dept. This is done in course scraping script.
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

  for (let school of schools) {
    console.log(school.name);

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

    const min = school.name === "Arts & Sciences" ? 0 : 1;

    for (let i = min; i < numDepts; ++i) {
      const deptButton = await page.$(`#Body_dlDepartments_lnkDept_${i}`);
      if (!deptButton) {
        continue;
      }
      const deptNameCode = await innerHTML(page, deptButton);
      const deptNameCodeFormatted = deptNameCode.replace(/&amp;/g, "&");

      const { name, code } = splitNameAndCode(deptNameCodeFormatted);
      const capitalizedName = lodash.startCase(lodash.lowerCase(name));

      try {
        const result = await prisma.department.create({
          data: {
            code: code,
            name: capitalizedName,
            school: {
              connect: {
                name: school.name,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  await browser.close();
}

main(process.argv);
