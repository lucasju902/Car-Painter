import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "components/MaterialUI";
import { SearchBox } from "components/common";
import { CustomDialogContent } from "./UploadDialog.style";

import UploadListContent from "./UploadListConent";

export const UploadDialog = React.memo((props) => {
  const { uploads, onCancel, open, onOpenUpload } = props;
  const [search, setSearch] = useState("");

  const handleSearchChange = useCallback((value) => setSearch(value), []);

  return (
    <Dialog aria-labelledby="upload-title" open={open} onClose={onCancel}>
      <DialogTitle id="upload-title">My Uploads</DialogTitle>
      <CustomDialogContent dividers>
        <Box mb={2}>
          <SearchBox value={search} onChange={handleSearchChange} />
        </Box>
        <UploadListContent
          uploads={uploads}
          search={search}
          setSearch={setSearch}
          onOpenUpload={onOpenUpload}
        />
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UploadDialog;
