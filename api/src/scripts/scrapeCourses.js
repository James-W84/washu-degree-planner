const puppeteer = require("puppeteer"); //must have chromium
const schools = require("./data.json").schools;
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

    const min =
      school.name === "Arts & Sciences" ? 0 : school.name === "Art" ? 2 : 1;

    for (let i = min; i < numDepts; ++i) {
      const deptButton = await page.$(`#Body_dlDepartments_lnkDept_${i}`);
      if (!deptButton) {
        continue;
      }
      const deptNameCode = await innerHTML(page, deptButton);
      const deptNameCodeFormatted = deptNameCode.replace(/&amp;/g, "&");

      const { code } = splitNameAndCode(deptNameCodeFormatted);

      await deptButton.click();
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

      const coursesDiv = await page.$("#Body_oCourseList_tabSelect");
      const courses = await coursesDiv.$$(":scope > div");

      for (let course of courses) {
        // const innerText = await course.evaluate((el) => el.innerText);
        // console.log("InnerText of course:", innerText);
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

        const [description, attributes] = await course.$eval(
          ".DivDetail table",
          (div) => {
            return [
              div.querySelector("table:nth-of-type(1)").textContent.trim(),
              div.querySelector("table:nth-of-type(2)").textContent.trim(),
            ];
          }
        );
        console.log(code);
        console.log(name);
        console.log(units);
        console.log(description);
        console.log(attributes);
      }
    }
  }

  await browser.close();
}

main(process.argv);
