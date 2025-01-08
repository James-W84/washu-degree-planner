import React from "react";
import { Typography, Modal, Box, Button, Stack } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CourseModal = ({ course, open, setOpen }) => {
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="course-title"
        aria-describedby="modal-code"
      >
        <Stack spacing={0.5} direction={"column"} sx={style}>
          <Typography id="course-title" variant="h2" component="h2">
            {course.title}
          </Typography>
          <Typography id="course-code" variant="h3">
            {course.department.code} {course.department.identifier}{" "}
            {course.courseCode}
          </Typography>
          <Typography>
            <b>{course.credits} Credits</b>
          </Typography>
          <Typography id="course-description">
            <b>Description:</b> {course.description}
          </Typography>
          <Typography>
            <b>Attributes:</b> {course.tags?.map((tag) => tag.name).join(", ")}
          </Typography>

          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            Close
          </Button>
        </Stack>
      </Modal>
    </div>
  );
};

export default CourseModal;
