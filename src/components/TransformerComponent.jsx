import React, { useRef, useEffect } from "react";

import { Transformer } from "react-konva";

const TransformerComponent = ({ selectedLayer }) => {
  const trRef = useRef();

  const checkNode = () => {
    if (selectedLayer) {
      const stage = trRef.current.getStage();

      const selectedNode = stage.findOne("." + selectedLayer.id);
      if (selectedNode === trRef.current.node()) {
        return;
      }

      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
      } else {
        trRef.current.detach();
      }
      trRef.current.getLayer().batchDraw();
    }
  };
  useEffect(() => {
    checkNode();
  });

  if (selectedLayer)
    return (
      <Transformer
        ref={trRef}
        keepRatio={
          selectedLayer.layer_data.sizeLocked ||
          selectedLayer.layer_data.scaleLocked
            ? true
            : false
        }
        enabledAnchors={
          selectedLayer.layer_data.sizeLocked ||
          selectedLayer.layer_data.scaleLocked
            ? ["top-left", "top-right", "bottom-left", "bottom-right"]
            : [
                "top-left",
                "top-center",
                "top-right",
                "middle-right",
                "middle-left",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]
        }
      />
    );
  return <></>;
};

export default TransformerComponent;
