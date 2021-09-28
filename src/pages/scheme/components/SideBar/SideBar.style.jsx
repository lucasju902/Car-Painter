import styled from "styled-components/macro";

import { Box, Button } from "@material-ui/core";

export const LayerWrapper = styled(Box)`
  background: #666666;
  overflow: auto;
  transition: 0.25s;
`;
export const TitleWrapper = styled(Box)`
  background: #666666;
  transition: 0.25s;
`;
export const Wrapper = styled(Box)`
  height: calc(100% - 56px);
  position: relative;
`;
export const ColorApplyButton = styled(Button)`
  padding: 3px 15px 5px;
`;
