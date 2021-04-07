// Theme
export const THEME_SET = "THEME_SET";
export const THEMES = {
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
};

export const LayerTypes = {
  TEXT: 1,
  LOGO: 2,
  BASE: 3,
  OVERLAY: 4,
  UPLOAD: 5,
  CAR: 6,
};

export const AllowedLayerProps = {
  [LayerTypes.TEXT]: [
    "layer_visible",
    "layer_locked",
    "layer_data",
    "layer_data.name",
    "layer_data.text",
    "layer_data.width",
    "layer_data.height",
    "layer_data.left",
    "layer_data.top",
    "layer_data.scaleX",
    "layer_data.scaleY",
    "layer_data.rotation",
    "layer_data.flop",
    "layer_data.flip",
    "layer_data.font",
    "layer_data.color",
    "layer_data.size",
    "layer_data.stroke",
    "layer_data.scolor",
  ],
  [LayerTypes.LOGO]: [
    "layer_visible",
    "layer_locked",
    "layer_data",
    "layer_data.name",
    "layer_data.width",
    "layer_data.height",
    "layer_data.left",
    "layer_data.top",
    "layer_data.rotation",
    "layer_data.flop",
    "layer_data.flip",
  ],
  [LayerTypes.OVERLAY]: [
    "layer_visible",
    "layer_locked",
    "layer_data",
    "layer_data.name",
    "layer_data.width",
    "layer_data.height",
    "layer_data.left",
    "layer_data.top",
    "layer_data.rotation",
    "layer_data.flop",
    "layer_data.flip",
  ],
  [LayerTypes.UPLOAD]: [
    "layer_visible",
    "layer_locked",
    "layer_data",
    "layer_data.name",
    "layer_data.width",
    "layer_data.height",
    "layer_data.left",
    "layer_data.top",
    "layer_data.rotation",
    "layer_data.flop",
    "layer_data.flip",
  ],
  [LayerTypes.BASE]: ["layer_data.name", "layer_visible", "layer_data"],
  [LayerTypes.CAR]: ["layer_data.name", "layer_visible", "layer_data"],
};

export const PaintingGuides = {
  CARMASK: "car-mask",
  WIREFRAME: "wireframe",
  SPONSORBLOCKS: "sponsor-blocks",
  NUMBERBLOCKS: "number-blocks",
  GRID: "grid",
};

export const Palette = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  lime: "#BFFF00",
  gray: "#808080",
  orange: "#FFA500",
  purple: "#800080",
  black: "#000000",
  white: "#FFFFFF",
  pink: "#FFC0CB",
  darkblue: "#00008b",
};

export const DialogTypes = {
  BASEPAINT: "BASEPAINT",
  SHAPE: "SHAPE",
  LOGO: "LOGO",
  UPLOAD: "UPLOAD",
  TEXT: "TEXT",
};
