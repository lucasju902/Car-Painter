import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import config from "config";

import {
  Box,
  FormControl,
  InputLabel,
  Typography,
  Grid,
} from "components/MaterialUI";
import { ColorPickerInput, SliderInput, FontSelect } from "components/common";
import {
  CustomeTextField,
  TextPreviewWrapper,
  TextPreview,
} from "./InnerForm.style";

import { insertToLoadedList as insertToLoadedFontList } from "redux/reducers/fontReducer";

export const InnerForm = React.memo((props) => {
  const {
    fontList,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
    baseColor,
  } = props;
  const dispatch = useDispatch();
  const loadedFontList = useSelector((state) => state.fontReducer.loadedList);

  const loadFont = useCallback(
    (fontFamily, fontFile) => {
      let fontObject = new FontFace(fontFamily, fontFile);
      fontObject
        .load()
        .then(function (loaded_face) {
          document.fonts.add(loaded_face);
          dispatch(insertToLoadedFontList(fontFamily));
        })
        .catch(function (error) {
          // error occurred
          console.warn(error, fontFamily);
        });
    },
    [insertToLoadedFontList]
  );

  useEffect(() => {
    let font = fontList.length
      ? fontList.find((item) => item.id === values.font)
      : null;
    if (font && !loadedFontList.includes(font.font_name)) {
      loadFont(font.font_name, `url(${config.assetsURL}/${font.font_file})`);
    }
  }, [values.font]);

  return (
    <>
      <CustomeTextField
        name="text"
        label="Text"
        placeholder="Input Text here"
        variant="outlined"
        value={values.text}
        error={Boolean(touched.text && errors.text)}
        helperText={touched.text && errors.text}
        onBlur={handleBlur}
        onChange={handleChange}
        fullWidth
        margin="normal"
        mb={4}
        InputLabelProps={{
          shrink: true,
        }}
        autoFocus={true}
      />
      <FormControl variant="outlined">
        <InputLabel id="font-select-label">Font</InputLabel>
        <FontSelect
          value={values.font}
          onChange={(e) => setFieldValue("font", e.target.value)}
          fontList={fontList}
        />
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Font Size"
            min={6}
            max={72}
            value={values.size}
            setValue={(value) => setFieldValue("size", value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" color="textSecondary" mr={2}>
              Font Color
            </Typography>
            <ColorPickerInput
              value={values.color}
              onChange={(color) => setFieldValue("color", color)}
              onInputChange={(color) => setFieldValue("color", color)}
              error={Boolean(errors.color)}
              helperText={errors.color}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Stroke Width"
            min={0}
            max={10}
            value={values.stroke}
            setValue={(value) => setFieldValue("stroke", value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1" color="textSecondary" mr={2}>
              Stroke Color
            </Typography>
            <ColorPickerInput
              value={values.scolor}
              onChange={(color) => setFieldValue("scolor", color)}
              onInputChange={(color) => setFieldValue("scolor", color)}
              error={Boolean(errors.scolor)}
              helperText={errors.scolor}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SliderInput
            label="Rotation"
            min={-179}
            max={179}
            value={values.rotation}
            setValue={(value) => setFieldValue("rotation", value)}
          />
        </Grid>
      </Grid>
      <TextPreviewWrapper
        width="100%"
        height="200px"
        my={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        backcolor={baseColor}
      >
        <TextPreview
          color={values.color}
          stroke={values.stroke}
          scolor={values.scolor}
          size={values.size}
          rotate={values.rotation}
          font={fontList.find((item) => item.id === values.font).font_name}
        >
          {values.text}
        </TextPreview>
      </TextPreviewWrapper>
    </>
  );
});
