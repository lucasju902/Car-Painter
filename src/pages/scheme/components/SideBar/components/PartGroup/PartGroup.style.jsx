import styled from "styled-components/macro";

import { CardHeader, CardContent } from "@material-ui/core";

export const CustomCardHeader = styled(CardHeader)`
  .MuiCardHeader-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .MuiCardHeader-content {
    width: calc(100% - 50px);
  }
`;
export const CustomCardContent = styled(CardContent)`
  padding-top: 0;
`;
