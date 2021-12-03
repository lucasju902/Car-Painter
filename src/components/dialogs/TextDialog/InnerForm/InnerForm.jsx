import React, { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import config from "config";
import fitty from "fitty";

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
  const previewBoxRef = useRef();

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

  useEffect(() => {
    fitty("#text-preview", {
      minSize: 10,
      maxSize: 512,
      multiLine: false,
    });
  }, [values.text, values.font]);

  useEffect(() => {
    const adjustFont = (e) => {
      setFieldValue("size", Math.round(e.detail.newValue));
    };

    if (previewBoxRef.current) {
      previewBoxRef.current.addEventListener("fit", adjustFont);
    }

    return () => {
      if (previewBoxRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        previewBoxRef.current.removeEventListener("fit", adjustFont);
      }
    };
  }, []);

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
        inputProps={{ maxLength: 100 }}
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
            label="Stroke Width"
            min={0}
            max={10}
            value={values.stroke}
            setValue={(value) => setFieldValue("stroke", value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
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

      <TextPreviewWrapper
        width="100%"
        height="300px"
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
          rotate={values.rotation}
          font={fontList.find((item) => item.id === values.font).font_name}
          id="text-preview"
          ref={previewBoxRef}
        >
          {values.text}
        </TextPreview>
      </TextPreviewWrapper>
    </>
  );
});
