import styled from "styled-components/macro";

import { Button } from "@material-ui/core";

export const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  padding: 10px 0px;
  background: #666666;
  z-index: 1201;
  position: absolute;
  bottom: 0;
`;

export const ZoomButton = styled(Button)`
  &.MuiButton-contained {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.12);
  }
`;
