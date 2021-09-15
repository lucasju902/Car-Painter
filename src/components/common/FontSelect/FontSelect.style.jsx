import styled from "styled-components/macro";
import { Select } from "components/MaterialUI";

export const CustomSelect = styled(Select)`
  .MuiSelect-selectMenu {
    display: flex;
    align-items: center;
    height: 2rem;
  }
`;
export const FontImage = styled.img`
  width: 506px;
  filter: invert(1);
`;