import config from "config";
import TGA from "utils/tga";
import { LayerTypes, MouseModes } from "constant";
// import validateColor from "validate-color";

export const getDifferenceFromToday = (past_date) => {
  const difference_In_Second =
    new Date().getTime() / 1000 - new Date(past_date).getTime();
  let returnValue;
  if (difference_In_Second < 60) {
    returnValue = Math.round(difference_In_Second);
    return `${returnValue} second${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Min = difference_In_Second / 60;
  if (difference_In_Min < 60) {
    returnValue = Math.round(difference_In_Min);
    return `${returnValue} minute${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Hour = difference_In_Min / 60;
  if (difference_In_Hour < 24) {
    returnValue = Math.round(difference_In_Hour);
    return `${returnValue} hour${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Day = difference_In_Hour / 24;
  if (difference_In_Day < 30) {
    returnValue = Math.round(difference_In_Day);
    return `${returnValue} day${returnValue > 1 ? "s" : ""} ago`;
  }
  if (difference_In_Day < 365) {
    const difference_In_Month = difference_In_Day / 30;
    returnValue = Math.round(difference_In_Month);
    return `${returnValue} month${returnValue > 1 ? "s" : ""} ago`;
  }
  const difference_In_Year = difference_In_Day / 365;
  returnValue = Math.round(difference_In_Year);
  return `${returnValue} year${returnValue > 1 ? "s" : ""} ago`;
};

export const hexToRgba = (hex) => {
  let result =
    hex.length > 7
      ? /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result)
    return {
      r: null,
      g: null,
      b: null,
      a: null,
    };
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

export const colorValidator = (color, allowAlpha = true) => {
  if (!color || !color.length) return true;
  if (
    color[0] === "#" &&
    (color.length === 1 ||
      color.length === 4 ||
      color.length === 7 ||
      (color.length === 9 && allowAlpha))
  )
    return true;
  return false;
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
  let newLayer = { ...layer };
  if (typeof newLayer.layer_data === "string") {
    newLayer.layer_data = JSON.parse(newLayer.layer_data);
  }
  return newLayer;
};

export const parseScheme = (scheme) => {
  let newScheme = { ...scheme };
  if (typeof newScheme.guide_data === "string" || !newScheme.guide_data) {
    newScheme.guide_data = JSON.parse(newScheme.guide_data) || {};
  }
  return newScheme;
};

export const dataURItoBlob = (dataURI) => {
  var binary = atob(dataURI.split(",")[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
};

export const addImageProcess = (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const alphaToHex = (alpha) => {
  let s = Math.floor(alpha * 255).toString(16);
  if (s.length === 1) s = "0" + s;
  return s;
};

export const correctColor = (color) => {
  if (color.indexOf("#") === 0) return color;
  if (color.length === 6) return "#" + color;
  return null;
};

export const legacyBasePaintAssetURL = (basepaint) => {
  return `${config.assetsURL}/bases/${basepaint.id}/`;
};

export const basePaintAssetURL = (carMake, index) => {
  return `${config.assetsURL}/templates2048/${carMake.folder_directory.replace(
    " ",
    "_"
  )}/bases/${index}/`;
};

export const legacyCarMakeAssetURL = (carMake) => {
  return `${config.assetsURL}/templates/${carMake.folder_directory.replace(
    " ",
    "_"
  )}/`;
};
export const carMakeAssetURL = (carMake) => {
  return `${config.assetsURL}/templates2048/${carMake.folder_directory.replace(
    " ",
    "_"
  )}/`;
};

export const uploadAssetURL = (uploadItem) => {
  return uploadItem.legacy_mode
    ? `${config.legacyAssetURL}/${uploadItem.file_name}`
    : `${config.assetsURL}/${uploadItem.file_name}`;
};

export const getZoomedCenterPosition = (
  stageRef,
  frameSize,
  zoom,
  boardRotate = 0
) => {
  const transform = stageRef.current.getTransform().m;
  let width = stageRef.current.attrs.width;
  let height = stageRef.current.attrs.height;
  const fitZoom = mathRound4(
    Math.min(width / frameSize.width, height / frameSize.height)
  );
  return rotatePoint(
    -transform[4] / zoom + (frameSize.width * fitZoom) / zoom / 2,
    -transform[5] / zoom + (frameSize.height * fitZoom) / zoom / 2,
    boardRotate
  );
};

export const rotatePoint = (x, y, angle) => {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * x + sin * y,
    ny = cos * y - sin * x;
  return { x: nx, y: ny };
};

export const getCenter = (shape) => {
  return {
    x:
      shape.x +
      (shape.width / 2) * Math.cos(shape.rotation) +
      (shape.height / 2) * Math.sin(-shape.rotation),
    y:
      shape.y +
      (shape.height / 2) * Math.cos(shape.rotation) +
      (shape.width / 2) * Math.sin(shape.rotation),
  };
};

export const rotateAroundPoint = (shape, deltaDeg, point) => {
  const x = Math.round(
    point.x +
      (shape.x - point.x) * Math.cos(deltaDeg) -
      (shape.y - point.y) * Math.sin(deltaDeg)
  );
  const y = Math.round(
    point.y +
      (shape.x - point.x) * Math.sin(deltaDeg) +
      (shape.y - point.y) * Math.cos(deltaDeg)
  );

  return {
    ...shape,
    rotation: shape.rotation + deltaDeg,
    x,
    y,
  };
};

export const rotateAroundCenter = (shape, deltaDeg) => {
  const center = getCenter(shape);
  return rotateAroundPoint(shape, deltaDeg, center);
};

export const getSnapRotation = (rot) => {
  const rotation = rot < 0 ? 2 * Math.PI + rot : rot;
  const son = Math.PI / 12;
  return Math.round(rotation / son) * son;
};

export const getTwoRandomNumbers = (limit) => {
  let arr = [];
  while (arr.length < 2) {
    var r = Math.floor(Math.random() * limit);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

export const reduceString = (text, limit) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
};

export const getNameFromUploadFileName = (file_name, user) => {
  let temp = file_name.substring(
    file_name.lastIndexOf("uploads/") + "uploads/".length,
    file_name.indexOf(".")
  );
  if (temp.indexOf(user.id.toString()) === 0)
    return temp.slice(user.id.toString().length + 1);
  return temp;
};

export const getTGA = (ctx, width, height) => {
  let imageData = ctx.getImageData(0, 0, width, height);
  var tga = new TGA({
    width: width,
    height: height,
    imageType: TGA.Type.RGB,
  });
  tga.setImageData(imageData);
  return tga.getDataURL("image/x-tga");
};

export const downloadTGA = (ctx, width, height, fileName) => {
  // get a blob url which can be used to download the file
  let imageData = ctx.getImageData(0, 0, width, height);
  var tga = new TGA({
    width: width,
    height: height,
    imageType: TGA.Type.RGB,
  });
  tga.setImageData(imageData);
  var url = tga.getBlobURL();

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const focusBoard = () => {
  setTimeout(() => document.activeElement.blur(), 1000);
};

export const isCenterBasedShape = (type) =>
  [
    MouseModes.CIRCLE,
    MouseModes.STAR,
    MouseModes.RING,
    MouseModes.REGULARPOLYGON,
    MouseModes.WEDGE,
    MouseModes.ARC,
  ].includes(type);

export const fitPoints = (points) => {
  const leftTopOffset = {
    x: 0,
    y: 0,
  };
  for (let index in points) {
    if (index % 2 === 0 && leftTopOffset.x > points[index]) {
      leftTopOffset.x = points[index];
    }
    if (index % 2 === 1 && leftTopOffset.y > points[index]) {
      leftTopOffset.y = points[index];
    }
  }

  const newPoints = points.map((value, index) =>
    index % 2 === 0 ? value - leftTopOffset.x : value - leftTopOffset.y
  );

  return [leftTopOffset, newPoints];
};

export const getPixelRatio = (node, image) => {
  if (image) {
    if (image.width && image.height)
      return Math.max(
        1,
        image.width / node.width(),
        image.height / node.height()
      );
    return 5;
  }
  return 1;
};

export const loadImage = async (
  imageSource,
  imageRef,
  handleLoad,
  handleError
) => {
  const img = new window.Image();
  img.src = imageSource;
  img.crossOrigin = "anonymous";
  imageRef.current = img;
  if (handleLoad) imageRef.current.addEventListener("load", handleLoad);
  if (handleError) imageRef.current.addEventListener("error", handleError);
};

export const isInSameSideBar = (type1, type2) => {
  if (
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(type1) &&
    [LayerTypes.LOGO, LayerTypes.TEXT, LayerTypes.UPLOAD].includes(type2)
  )
    return true;
  if (type1 === type2) return true;
  return false;
};
