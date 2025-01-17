import { Stack, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { DragDropContext } from "@hello-pangea/dnd";
import CoursePlanner from "../components/Planner/CoursePlanner";

function Dashboard() {
  const [mainContentPage, setMainContentPage] = useState("planner");

  const handleMainContentPageChange = (event, newMainContentPage) => {
    if (newMainContentPage !== null) {
      setMainContentPage(newMainContentPage);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    console.log(destination);

    if (!destination) return;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Header></Header>

      <Stack direction="row" spacing={2} sx={{ padding: "1em" }}>
        <Stack
          direction={"column"}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            exclusive
            value={mainContentPage}
            onChange={handleMainContentPageChange}
            sx={{ width: "90%", marginBottom: "1em", height: "2em" }}
          >
            <ToggleButton
              value="planner"
              aria-label="planner"
              sx={{ width: "100%" }}
            >
              Plan
            </ToggleButton>
            <ToggleButton
              value="progress"
              aria-label="progress"
              sx={{ width: "100%" }}
            >
              Progress
            </ToggleButton>
          </ToggleButtonGroup>
          <Sidebar />
        </Stack>
        <Box sx={{ flex: 2 }}>
          {/* {mainContentPage === "planner" ? <Planner /> : <Progress />} */}
          <CoursePlanner></CoursePlanner>
        </Box>
      </Stack>
    </DragDropContext>
  );
}

export default Dashboard;
