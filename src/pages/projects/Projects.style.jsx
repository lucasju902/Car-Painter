import styled from "styled-components/macro";
import { Box } from "components/MaterialUI";

export const Wrapper = styled(Box)`
  background-color: #444;
  border-radius: 10px;
`;

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      width="100%"
      {...other}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};
