import React, { useCallback } from "react";
import { Form } from "formik";

import { DefaultLayer } from "constant";

import {
  NameProperty,
  GeneralProperty,
  SizeProperty,
  PositionProperty,
  FontProperty,
  StrokeProperty,
  ColorProperty,
  BackgroundProperty,
  RotationProperty,
  ShadowProperty,
  CornerProperty,
  ExtraProperty,
  SkewProperty,
} from "./components";

export const InnerForm = React.memo(
  ({
    user,
    editable,
    stageRef,
    fontList,
    toggleField,
    toggleLayerDataField,
    currentLayer,
    currentCarMake,
    pressedKey,
    onClone,
    onDelete,
    onLayerDataUpdate,
    onLayerDataMultiUpdate,
    ...formProps
  }) => {
    const checkLayerDataDirty = useCallback(
      (params) => {
        if (!currentLayer) return false;
        for (let param of params) {
          if (
            formProps.values.layer_data[param] !=
              currentLayer.layer_data[param] &&
            !(
              formProps.values.layer_data[param] ===
                DefaultLayer.layer_data[param] &&
              currentLayer.layer_data[param] === undefined
            )
          )
            return true;
        }
        return false;
      },
      [formProps.values, currentLayer]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <NameProperty
          {...formProps}
          editable={editable}
          user={user}
          layerType={currentLayer && currentLayer.layer_type}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <GeneralProperty
          {...formProps}
          editable={editable}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <FontProperty
          {...formProps}
          editable={editable}
          fontList={fontList}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ColorProperty
          {...formProps}
          editable={editable}
          currentCarMake={currentCarMake}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <BackgroundProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <StrokeProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
        />
        <SizeProperty
          {...formProps}
          editable={editable}
          toggleLayerDataField={toggleLayerDataField}
          currentLayer={currentLayer}
          pressedKey={pressedKey}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <PositionProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <RotationProperty
          {...formProps}
          editable={editable}
          stageRef={stageRef}
          currentLayer={currentLayer}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onLayerDataMultiUpdate={onLayerDataMultiUpdate}
        />
        <SkewProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ShadowProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onApply={formProps.handleSubmit}
        />
        <CornerProperty
          editable={editable}
          {...formProps}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ExtraProperty
          {...formProps}
          editable={editable}
          onClone={onClone}
          onDelete={onDelete}
        />
      </Form>
    );
  }
);
