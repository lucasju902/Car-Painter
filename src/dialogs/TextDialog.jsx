import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";

import styled from "styled-components/macro";

import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Typography as MuiTypography,
  Grid,
} from "@material-ui/core";
import SliderInput from "components/SliderInput";
import FontSelect from "components/FontSelect";
import ColorPickerInput from "components/ColorPickerInput";

const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Typography = styled(MuiTypography)(spacing);
const CustomeTextField = styled(TextField)`
  .MuiInputBase-input {
    height: 2rem;
  }
`;

const InnerForm = (props) => {
  const {
    fontList,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = props;
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
    </>
  );
};

const TextDialog = (props) => {
  const { fontList, onCancel, open, onCreate } = props;

  return (
    <Dialog aria-labelledby="insert-text-title" open={open} onClose={onCancel}>
      <DialogTitle id="insert-text-title">Insert Text</DialogTitle>
      <Formik
        initialValues={{
          text: "",
          font: 1,
          size: 14,
          color: "#000000",
          stroke: 0,
          scolor: "#000000",
          rotation: 0,
        }}
        validationSchema={Yup.object().shape({
          text: Yup.string().required("Required"),
        })}
        validate={(values) => {
          console.log(values);
          return {};
        }}
        onSubmit={onCreate}
      >
        {(formProps) => (
          <Form onSubmit={formProps.handleSubmit}>
            <DialogContent dividers id="insert-text-dialog-content">
              <InnerForm {...formProps} fontList={fontList} />
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="outlined"
                disabled={formProps.isSubmitting}
              >
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TextDialog;
