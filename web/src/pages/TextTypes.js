import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";

function TextTypes() {
  return (
    <Grid container direction="row">
      <Grid item size={{ xs: 0, sm: 3, md: 4 }}></Grid>
      <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
        {" "}
        <Grid
          container
          direction="column"
          spacing={4}
          sx={{
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            padding: "1vh",
          }}
        >
          <Grid item>
            <Typography variant="h1">HEADER - 30 Semi-Bold</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h2">subHeader - 20 Semi-Bold</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h3">
              secondary-subHeader - 15 Semi-Bold
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">Labels - 15 Medium</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">Content - 12 Regular</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={{ xs: 0, sm: 3, md: 4 }}></Grid>
    </Grid>
  );
}

export default TextTypes;
