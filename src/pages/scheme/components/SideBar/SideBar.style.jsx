import styled from "styled-components/macro";

import { Box, Button } from "@material-ui/core";

export const LayerWrapper = styled(Box)`
  width: 300px;
  background: #666666;
  overflow: auto;
`;
export const TitleWrapper = styled(Box)`
  background: #666666;
`;
export const Wrapper = styled(Box)`
  height: calc(100% - 46px);
  position: relative;
`;
export const ColorApplyButton = styled(Button)`
  padding: 3px 15px 5px;
`;
