import { Stack } from "@mui/material";
import SemesterCard from "./SemesterCard";

const PlannerYear = ({ year }) => {
  return (
    <Stack
      direction={"row"}
      height={"calc(100vh - 15em)"}
      justifyContent={"space-between"}
    >
      <SemesterCard year={year} semester={1}></SemesterCard>
      <SemesterCard year={year} semester={2}></SemesterCard>
    </Stack>
  );
};

export default PlannerYear;
