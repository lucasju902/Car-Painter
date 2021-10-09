import React, { useRef, useMemo } from "react";
import { useSelector } from "react-redux";

export const withWrapper = (Component) => (props) => {
  const stageRef = useRef(null);
  const baseLayerRef = useRef(null);
  const mainLayerRef = useRef(null);
  const carMaskLayerRef = useRef(null);

  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);

  const editable = useMemo(
    () =>
      !user || !currentScheme
        ? false
        : user.id === currentScheme.user_id ||
          sharedUsers.find(
            (shared) => shared.user_id === user.id && shared.editable
          ),
    [user, currentScheme, sharedUsers]
  );

  return (
    <Component
      {...props}
      editable={editable}
      stageRef={stageRef}
      baseLayerRef={baseLayerRef}
      mainLayerRef={mainLayerRef}
      carMaskLayerRef={carMaskLayerRef}
    />
  );
};
