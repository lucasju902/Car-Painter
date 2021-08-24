import { Skeleton } from "@material-ui/lab";
import styled from "styled-components/macro";

export const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
  cursor: pointer;
`;

export const CustomSkeleton = styled(Skeleton)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
