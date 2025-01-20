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
          courseCode: "asc",
        },
        include: {
          tags: true,
          department: true,
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

router.get("/one/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        tags: true,
        department: true,
      },
    });

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
});

router.get("/saved/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        savedCourses: {
          include: {
            tags: true,
            department: true,
          },
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/save", async (req, res) => {
  const { userId, courseId, save } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        savedCourses: save
          ? {
              connect: {
                id: parseInt(courseId),
              },
            }
          : {
              disconnect: {
                id: parseInt(courseId),
              },
            },
      },
      include: {
        savedCourses: true,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/isSaved/:userId/:courseId", async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
        savedCourses: { some: { id: parseInt(courseId) } },
      },
    });

    res.status(200).json({ saved: result !== null });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/select", async (req, res) => {
  const { userId, courseId, semester } = req.body;

  try {
    const result = await prisma.userCourse.create({
      data: {
        user: {
          connect: { id: parseInt(userId) },
        },
        course: {
          connect: {
            id: parseInt(courseId),
          },
        },
        semester,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(409).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.post("/unselect", async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const result = await prisma.userCourse.delete({
      where: {
        userId_courseId: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
        },
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/selected/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.userCourse.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        course: {
          include: {
            tags: true,
            department: true,
          },
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/semester/:userId/:semester", async (req, res) => {
  const { userId, semester } = req.params;

  try {
    const result = await prisma.userCourse.findMany({
      where: {
        userId: parseInt(userId),
        semester: parseInt(semester),
      },
      include: {
        course: {
          include: {
            attributes: true,
          },
        },
      },
    });

    res.status(200).json(result.map((userCourse) => userCourse.course));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
