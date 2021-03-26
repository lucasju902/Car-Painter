import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  GridListTileBar,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { uploadFiles } from "redux/reducers/uploadReducer";
import config from "config";

const Button = styled(MuiButton)(spacing);

const CustomInfiniteScroll = styled(InfiniteScroll)`
  .infinite-scroll-component {
    overflow: hidden !important;
  }
`;

const CustomGridList = styled(GridList)`
  overflow: hidden !important;
  margin: 0 !important;
`;
const CustomGridListTile = styled(GridListTile)`
  cursor: pointer;
`;
const CustomDialogContent = styled(DialogContent)`
  width: 600px;
`;

const UploadDialog = (props) => {
  const step = 15;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const [limit, setLimit] = useState(step);
  const [files, setFiles] = useState([]);
  const [dropZoneKey, setDropZoneKey] = useState(1);
  const { uploads, onCancel, open, onOpenUpload } = props;

  const increaseData = () => {
    setLimit(limit + step);
  };
  const getNameFromFileName = (file_name) => {
    return file_name.match(/(?<=uploads\/)(.*)(?=\.)/g)[0];
  };
  const handleDropZoneChange = (files_up) => {
    setFiles(files_up);
    console.log(files_up);
  };
  const handleUploadFiles = () => {
    console.log(files);
    dispatch(uploadFiles(user.id, currentScheme.id, files));
    setFiles([]);
    setDropZoneKey(dropZoneKey + 1);
  };

  return (
    <Dialog aria-labelledby="upload-title" open={open} onClose={onCancel}>
      <DialogTitle id="upload-title">My Uploads</DialogTitle>
      <CustomDialogContent dividers>
        <DropzoneArea
          onChange={handleDropZoneChange}
          value={files}
          showFileNamesInPreview={true}
          showFileNames={true}
          maxFiles={10}
          key={dropZoneKey}
        />
        {files.length ? (
          <Box mt={1} width="100%" display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadFiles}
            >
              Save To My Upload List
            </Button>
          </Box>
        ) : (
          <></>
        )}
        <Box id="upload-dialog-content" overflow="auto" height="40vh" mt={1}>
          <CustomInfiniteScroll
            dataLength={limit} //This is important field to render the next data
            next={increaseData}
            hasMore={limit < uploads.length}
            loader={<Loader />}
            scrollableTarget="upload-dialog-content"
          >
            <CustomGridList cellHeight={178} cols={3}>
              {uploads.slice(0, limit).map((uploadItem) => (
                <CustomGridListTile
                  key={uploadItem.id}
                  cols={1}
                  onClick={() => onOpenUpload(uploadItem)}
                >
                  <img
                    src={`${config.assetsURL}/${uploadItem.file_name}`}
                    alt={getNameFromFileName(uploadItem.file_name)}
                  />
                  <GridListTileBar
                    title={getNameFromFileName(uploadItem.file_name)}
                  />
                </CustomGridListTile>
              ))}
            </CustomGridList>
          </CustomInfiniteScroll>
        </Box>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
