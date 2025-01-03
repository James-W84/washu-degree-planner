const puppeteer = require("puppeteer"); //must have chromium
const schools = require("./data.json").schools;

async function main(args) {
  console.log(schools);

  const semester = args.length > 2 ? Number(args[2]) : 1;
  if (isNaN(semester)) {
    throw new Error("Invalid semester argument. Please give an integer value.");
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://acadinfo.wustl.edu/CourseListings/Semester/Listing.aspx"
  );

  if (semester > 4) {
    await page.click("#Body_hlMoreSemesters");
    await page.click(`#Body_repMoreSems_hlMore_${semester - 5}`);
  } else {
    await page.click(`#Body_hlSemester${semester}`);
  }

  setTimeout(async () => {
    await page.screenshot({ path: "example.png" });
    await browser.close();
  }, 2000);
}

main(process.argv);
