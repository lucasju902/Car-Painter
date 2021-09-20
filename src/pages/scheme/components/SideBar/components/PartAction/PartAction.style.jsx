import styled from "styled-components/macro";

import { makeStyles } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  transform: ${(props) =>
    props.isstretch === "true" ? "scaleX(1.2) scaleY(0.8)" : "none"};
`;
