import React from "react";

import { Box, TextField, Typography } from "@material-ui/core";

const SizeProperty = (props) => {
  const { currentLayer, onChange } = props;

  const handleChange = (field, value) => {
    onChange({
      [field]: value,
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography>Size</Typography>
      <TextField
        label="Width"
        value={currentLayer.layer_data.width}
        onChange={(event) => handleChange("width", event.target.value)}
      />
      <TextField
        label="Height"
        value={currentLayer.layer_data.height}
        onChange={(event) => handleChange("height", event.target.value)}
      />
    </Box>
  );
};

export default SizeProperty;
