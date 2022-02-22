import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";
import { LightTooltip } from "components/common";
import { IconButton, Box, useMediaQuery } from "components/MaterialUI";
import { ChevronsLeft, ChevronsRight } from "react-feather";

import { setShowProperties } from "redux/reducers/boardReducer";

export const PropertyBar = React.memo((props) => {
  const { editable, stageRef, onCloneLayer, onDeleteLayer } = props;
  const dispatch = useDispatch();
  const overTablet = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
  );

  const handleToggleProperties = useCallback(() => {
    dispatch(setShowProperties(!showProperties));
  }, [dispatch, showProperties]);

  return (
    <Box
      position="relative"
      display="flex"
      overflow="visible"
      width="20%"
      minWidth="250px"
    >
      {showProperties ? (
        <Box bgcolor="#666" overflow="auto" py={5} px={3} height="100%">
          {currentLayer ? (
            <LayerProperty
              editable={editable}
              stageRef={stageRef}
              onClone={onCloneLayer}
              onDelete={onDeleteLayer}
            />
          ) : currentScheme ? (
            <SchemeProperty editable={editable} />
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}
      <Box position="absolute" bgcolor="#666" left="-48px" bottom={0}>
        <LightTooltip title="Toggle Properties" arrow>
          <IconButton onClick={handleToggleProperties}>
            {showProperties ? <ChevronsRight /> : <ChevronsLeft />}
          </IconButton>
        </LightTooltip>
      </Box>
    </Box>
  );
});

export default PropertyBar;
