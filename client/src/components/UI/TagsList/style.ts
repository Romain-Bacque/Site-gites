import styled from "@emotion/styled";
import { Paper } from "@mui/material";

// Style
export const StyledPaper = styled(Paper)({
  display: "flex",
  justifyContent: "start",
  flexWrap: "wrap",
  listStyle: "none",
}) as typeof Paper;
export const ListItem = styled("li")({
  margin: "0.5rem",
});
