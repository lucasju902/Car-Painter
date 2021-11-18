import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import { DialogContent, ImageList, ImageListItem } from "components/MaterialUI";

export const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;

export const CustomImageList = styled(ImageList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
export const CustomImageListItem = styled(ImageListItem)`
  cursor: pointer;
`;
export const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;
