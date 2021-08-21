import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "rgba(0, 0, 0, 0.2)",
    fontSize: 11,
  },
  arrow: {
    color: "white",
  },
}))(Tooltip);

export default LightTooltip;
