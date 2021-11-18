import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconButton, ImageList, ImageListItem } from "@material-ui/core";

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

export const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;

export const DeleteButton = styled(IconButton)`
  color: #ccc;
`;
