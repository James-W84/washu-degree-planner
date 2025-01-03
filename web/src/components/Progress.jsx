import React, { useEffect, useState } from "react";
import {
  Container,
  Grid2 as Grid,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import { withStyles } from "@material-ui/core/styles";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

function Progress() {
  // TODO: get labs from API per user's dept/major
  const [loading, setLoading] = useState(true);
  const [programValidation, setProgramValidation] = useState();
  const [degreeValidation, setDegreeValidation] = useState();
  const [schoolValidation, setSchoolValidation] = useState();
  const { userId, isLoggedIn } = useAuth();

  const fetchData = async () => {
    if (userId) {
      try {
        const programResponse = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user/validate_program/${userId}`
        );
        const degreeResponse = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user/validate_degree/${userId}`
        );
        const schoolResponse = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user/validate_school/${userId}`
        );
        setProgramValidation(programResponse.data);
        setDegreeValidation(degreeResponse.data);
        setSchoolValidation(schoolResponse.data);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    console.log(userId);

    fetchData();
  }, [userId, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Container maxWidth={false} sx={{ padding: 3 }}>
        <Typography variant="h1" className="my-3">
          Please log in to view degree progress.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h1" className="my-3">
        Degree Requirement Progress
      </Typography>
      <Container
        maxWidth={false}
        sx={{ padding: 3, overflow: "scroll", height: "85vh" }}
      >
        {/* Program */}
        <Typography variant="h2" className="my-4">
          {programValidation.primary.programTitle}:
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // Two columns for a 5x2 layout
            gap: 3, // Spacing between grid items
          }}
        >
          {programValidation.primary.courseRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.title}
                {bar.taken && ": Complete"}
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={bar.taken ? 100 : 0}
              />
            </Grid>
          ))}
          {programValidation.primary.creditRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.tag}: ({bar.creditsFulfilled}/{bar.requiredCredits})
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={Math.min(
                  100,
                  (100 * parseInt(bar.creditsFulfilled)) /
                    parseInt(bar.requiredCredits)
                )}
              />
            </Grid>
          ))}
        </Grid>

        {/* Degree */}
        <Typography variant="h2" className="my-4">
          {degreeValidation.primary.degreeTitle}:
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // Two columns for a 5x2 layout
            gap: 3, // Spacing between grid items
          }}
        >
          {degreeValidation.primary.courseRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.title}
                {bar.taken && ": Complete"}
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={bar.taken ? 100 : 0}
              />
            </Grid>
          ))}
          {degreeValidation.primary.creditRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.tag}: ({bar.creditsFulfilled}/{bar.requiredCredits})
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={Math.min(
                  100,
                  (100 * parseInt(bar.creditsFulfilled)) /
                    parseInt(bar.requiredCredits)
                )}
              />
            </Grid>
          ))}
        </Grid>

        {/* School */}
        <Typography variant="h2" className="my-4">
          {schoolValidation.primary.schoolTitle}:
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // Two columns for a 5x2 layout
            gap: 3, // Spacing between grid items
          }}
        >
          {schoolValidation.primary.courseRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.title}
                {bar.taken && ": Complete"}
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={bar.taken ? 100 : 0}
              />
            </Grid>
          ))}
          {schoolValidation.primary.creditRequirements.map((bar, index) => (
            <Grid key={index}>
              <Typography variant="body1" gutterBottom>
                {bar.tag}: ({bar.creditsFulfilled}/{bar.requiredCredits})
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={Math.min(
                  100,
                  (100 * parseInt(bar.creditsFulfilled)) /
                    parseInt(bar.requiredCredits)
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Progress;
