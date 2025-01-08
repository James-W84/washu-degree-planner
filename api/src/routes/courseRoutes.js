const express = require("express");
const prisma = require("./../models/index");

const router = express.Router();

router.get("/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;
  const { department, search } = req.query;

  try {
    const whereClause = {
      AND: [],
    };

    if (department) {
      whereClause.AND.push({ departmentId: parseInt(department) });
    }

    if (search) {
      whereClause.AND.push({
        title: {
          contains: search,
          mode: "insensitive",
        },
      });
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: whereClause.AND.length > 0 ? whereClause : undefined,
        take: limit,
        skip: skip,
        orderBy: {
          id: "asc",
        },
        include: {
          tags: true,
        },
      }),
      prisma.course.count({
        where: whereClause.AND.length > 0 ? whereClause : undefined,
      }),
    ]);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalCourses: total,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(400)
      .json({ error: "Failed to fetch courses. Please try again later." });
  }
});

router.get("/departments", async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
