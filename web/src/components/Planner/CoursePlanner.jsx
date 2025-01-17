import { Container, Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import PlannerYear from "./PlannerYear";

function CoursePlanner() {
  const [year, setYear] = useState("1");

  const handleChange = (event, value) => {
    setYear(value);
  };

  return (
    <Container maxWidth={false}>
      <TabContext value={year}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Freshman" value="1" />
            <Tab label="Sophomore" value="2" />
            <Tab label="Junior" value="3" />
            <Tab label="Senior" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingX: 0 }}>
          <PlannerYear year={1}></PlannerYear>
        </TabPanel>
        <TabPanel value="2" sx={{ paddingX: 0 }}>
          <PlannerYear year={2}></PlannerYear>
        </TabPanel>
        <TabPanel value="3" sx={{ paddingX: 0 }}>
          <PlannerYear year={3}></PlannerYear>
        </TabPanel>
        <TabPanel value="4" sx={{ paddingX: 0 }}>
          <PlannerYear year={4}></PlannerYear>
        </TabPanel>
      </TabContext>
    </Container>
  );
}

export default CoursePlanner;
