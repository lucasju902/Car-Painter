import styled from "styled-components/macro";

import { makeStyles, IconButton } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    position: "absolute",
    left: "14px",
    top: "14px",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

export const CustomIconButton = styled(IconButton)`
  border-radius: 5px;
`;
