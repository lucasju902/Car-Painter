import React from "react";
import { useSelector } from "react-redux";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";
import { Box } from "components/MaterialUI";

export const PropertyBar = React.memo((props) => {
  const {
    editable,
    stageRef,
    transformingLayer,
    onCloneLayer,
    onDeleteLayer,
  } = props;

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
  );

  return (
    <Box
      position="relative"
      display="flex"
      overflow="visible"
      width={showProperties ? "14%" : "0"}
      minWidth={showProperties ? "260px" : "0"}
      maxWidth="300px"
    >
      {showProperties ? (
        <Box
          bgcolor="#666"
          overflow="auto"
          py={5}
          px={2}
          height="100%"
          width="100%"
        >
          {currentLayer ? (
            <LayerProperty
              editable={editable}
              stageRef={stageRef}
              transformingLayer={transformingLayer}
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
    </Box>
  );
});

export default PropertyBar;
