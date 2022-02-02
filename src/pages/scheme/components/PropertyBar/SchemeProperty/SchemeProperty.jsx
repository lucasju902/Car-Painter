import React, { useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { GuidesSetting } from "./components";

import { updateScheme } from "redux/reducers/schemeReducer";
import { setPaintingGuides } from "redux/reducers/boardReducer";

export const SchemeProperty = React.memo((props) => {
  const { editable } = props;

  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const paintingGuides = useSelector(
    (state) => state.boardReducer.paintingGuides
  );

  const handleApplyGuideSettings = useCallback(
    (guide_data) => {
      dispatch(
        updateScheme({
          ...currentScheme,
          guide_data: guide_data,
        })
      );
    },
    [dispatch, currentScheme]
  );
  const handleChangePaintingGuides = useCallback(
    (newFormats) => {
      dispatch(setPaintingGuides(newFormats));
    },
    [dispatch]
  );
  return (
    <>
      <GuidesSetting
        editable={editable}
        guide_data={currentScheme.guide_data}
        paintingGuides={paintingGuides}
        onApply={handleApplyGuideSettings}
        onChangePaintingGuides={handleChangePaintingGuides}
      />
    </>
  );
});

export default SchemeProperty;
