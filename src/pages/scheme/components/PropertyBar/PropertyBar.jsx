import React from "react";
import { useSelector } from "react-redux";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";

export const PropertyBar = (props) => {
  const { editable, stageRef, onCloneLayer, onDeleteLayer } = props;

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  return (
    <>
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
    </>
  );
};

export default PropertyBar;
