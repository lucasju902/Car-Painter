import styled from "styled-components";
import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  TextField as MuiTextField,
  Typography as MuiTypography,
  Link as MuiLink,
  Grid as MuiGrid,
  CircularProgress as MuiCircularProgress,
  Select as MuiSelect,
} from "@material-ui/core";
import {
  Alert as MuiAlert,
  Autocomplete as MuiAutocomplete,
} from "@material-ui/lab";
import { spacing } from "@material-ui/system";

export * from "@material-ui/core";

export const Alert = styled(MuiAlert)(spacing);
export const Autocomplete = styled(MuiAutocomplete)(spacing);
export const TextField = styled(MuiTextField)(spacing);
export const Button = styled(MuiButton)(spacing);
export const IconButton = styled(MuiIconButton)(spacing);
export const Link = styled(MuiLink)(spacing);
export const Typography = styled(MuiTypography)(spacing);
export const Grid = styled(MuiGrid)(spacing);
export const CircularProgress = styled(MuiCircularProgress)(spacing);
export const Select = styled(MuiSelect)(spacing);
