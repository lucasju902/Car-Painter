import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { Box } from "components/MaterialUI";

import { alphaToHex } from "helper";

import { LightTooltip } from "components/common";
import styled from "styled-components";

export const DefaultSettingsButton = React.memo(({ onClick }) => {
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);

  const bgColor = useMemo(
    () =>
      currentLayer
        ? (currentLayer.layer_data.color || "#000000") +
          alphaToHex(currentLayer.layer_data.opacity || 1)
        : (currentScheme.guide_data.default_shape_color || "#000000") +
          alphaToHex(currentScheme.guide_data.default_shape_opacity || 1),
    [currentScheme, currentLayer]
  );

  const outlineWidth = useMemo(
    () =>
      Math.min(
        (currentLayer
          ? currentLayer.layer_data.stroke
          : currentScheme.guide_data.default_shape_stroke) || 0,
        5
      ),
    [currentScheme, currentLayer]
  );

  const outlineColor = useMemo(
    () =>
      (currentLayer
        ? currentLayer.layer_data.scolor
        : currentScheme.guide_data.default_shape_scolor) || "#000000",
    [currentScheme, currentLayer]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      width="45px"
      height="45px"
      alignItems="center"
    >
      <LightTooltip title="Default Shape Settings" arrow placement="right">
        <Box bgcolor="#FFFFFF" height="25px">
          <CustomButton
            width="25px"
            height="25px"
            bgcolor={bgColor}
            outline={`${outlineWidth}px solid ${outlineColor}`}
            onClick={onClick}
          />
        </Box>
      </LightTooltip>
    </Box>
  );
});

const CustomButton = styled(Box)`
  outline: ${(props) => props.outline};
  cursor: pointer;
  caret-color: transparent;
`;

export default DefaultSettingsButton;
