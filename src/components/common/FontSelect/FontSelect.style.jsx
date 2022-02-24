import styled from "styled-components/macro";
import { Select } from "components/MaterialUI";

export const CustomSelect = styled(Select)`
  .MuiMenu-paper {
    border: 1px solid gray;
  }
  .MuiSelect-selectMenu {
    display: flex;
    align-items: center;
    height: 2rem;
  }
`;
export const FontImage = styled.img`
  width: 100%;
  filter: invert(1);
`;
