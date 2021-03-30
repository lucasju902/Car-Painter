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
        trRef.current.attachTo(selectedNode);
      } else {
        trRef.current.detach();
      }
      trRef.current.getLayer().batchDraw();
    }
  };
  useEffect(() => {
    checkNode();
  });

  if (selectedLayer) return <Transformer ref={trRef} keepRatio={false} />;
  return <></>;
};

export default TransformerComponent;
