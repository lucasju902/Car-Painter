import React from "react";

import { Box, Link as MuiLink, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";
import TradingPaintsLogo from "assets/trading-paints-logo.svg";
import PaintBuilderLogo from "assets/paint-builder-logo.svg";

export const AppHeader = React.memo(({ children }) => {
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="15px"
      bgcolor="black"
    >
      <Box
        height="30px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <MuiLink href="https://tradingpaints.com/" style={{ height: "30px" }}>
          <img src={TradingPaintsLogo} alt="TradingPaintsLogo" height="100%" />
        </MuiLink>
        <SlashSeparator>&#47;</SlashSeparator>
        <Link to="/" style={{ height: "30px" }}>
          <img src={PaintBuilderLogo} alt="PaintBuilderLogo" height="100%" />
        </Link>
      </Box>
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {children}
      </Box>
    </Box>
  );
});

export const SlashSeparator = styled(Typography)`
  color: #666;
  font-size: 46px;
  font-weight: 400;
  margin: 0 5px;
`;

export default AppHeader;
