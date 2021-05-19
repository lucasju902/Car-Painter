import _ from "lodash";
import validateColor from "validate-color";

export const getDifferenceFromToday = (past_date) => {
  const difference_In_Second =
    new Date().getTime() / 1000 - new Date(past_date).getTime();
  if (difference_In_Second < 60) {
    return `${Math.round(difference_In_Second)} seconds ago`;
  }
  const difference_In_Min = difference_In_Second / 60;
  if (difference_In_Min < 60) {
    return `${Math.round(difference_In_Min)} minutes ago`;
  }
  const difference_In_Hour = difference_In_Min / 60;
  if (difference_In_Hour < 24) {
    return `${Math.round(difference_In_Hour)} hours ago`;
  }
  const difference_In_Day = difference_In_Hour / 24;
  return `${Math.round(difference_In_Day)} days ago`;
};

export const hexToRgba = (hex) => {
  let result =
    hex.length > 7
      ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: hex.length > 7 ? parseInt(result[4], 16) : 255,
  };
};

export const mathRound2 = (num) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const mathRound4 = (num) => Math.round(num * 10000) / 10000;

export const colorValidator = (color) => {
  if (!color || !color.length) return true;
  return validateColor(color);
};

export const getRelativePointerPosition = (node) => {
  var transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();
  // get pointer (say mouse or touch) position
  var pos = node.getStage().getPointerPosition();
  // now we can find relative point
  return transform.point(pos);
};

export const getRelativeShadowOffset = (boardRotate, offset) => {
  let shadowOffset = { ...offset };
  if (boardRotate === 90) {
    shadowOffset.x = -offset.y;
    shadowOffset.y = offset.x;
  } else if (boardRotate === 180) {
    shadowOffset.x = -offset.x;
    shadowOffset.y = -offset.y;
  } else if (boardRotate === 270) {
    shadowOffset.x = offset.y;
    shadowOffset.y = -offset.x;
  }
  return shadowOffset;
};

export const removeDuplicatedPointFromEnd = (points) => {
  let new_points = [...points];
  if (new_points.length >= 4) {
    while (
      new_points[new_points.length - 1] === new_points[new_points.length - 3] &&
      new_points[new_points.length - 2] === new_points[new_points.length - 4]
    ) {
      new_points.splice(-2, 2);
    }
  }
  return new_points;
};

export const parseLayer = (layer) => {
  let newLayer = layer;
  if (typeof newLayer.layer_data === "string") {
    newLayer.layer_data = JSON.parse(newLayer.layer_data);
  }
  return newLayer;
};

export const parseScheme = (scheme) => {
  let newScheme = scheme;
  if (typeof newScheme.guide_data === "string" || !newScheme.guide_data) {
    newScheme.guide_data = JSON.parse(newScheme.guide_data) || {};
  }
  return newScheme;
};
