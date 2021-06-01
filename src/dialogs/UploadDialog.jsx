import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components/macro";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import { spacing } from "@material-ui/system";
import {
  Box,
  Button as MuiButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
  GridListTileBar,
} from "@material-ui/core";
import ConfirmDialog from "dialogs/ConfirmDialog";
import YesNoDialog from "dialogs/YesNoDialog";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { uploadFiles, deleteUpload } from "redux/reducers/uploadReducer";
import {
  deleteItemsByUploadID as deleteLayerItemsByUploadID,
  setCurrent as setCurrentLayer,
} from "redux/reducers/layerReducer";
import { setMessage } from "redux/reducers/messageReducer";

import config from "config";
import SchemeService from "services/schemeService";

const Button = styled(MuiButton)(spacing);

const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
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
const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;
const DeleteButton = styled(IconButton)`
  color: #ccc;
`;

const UploadDialog = (props) => {
  const step = 15;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const [uploadToDelete, setUploadToDelete] = useState(null);
  const [associatedSchemes, setAssociatedSchemes] = useState([]);

  const [limit, setLimit] = useState(step);
  const [files, setFiles] = useState([]);
  const [dropZoneKey, setDropZoneKey] = useState(1);
  const { uploads, onCancel, open, onOpenUpload } = props;

  const increaseData = () => {
    setLimit(limit + step);
  };
  const getNameFromFileName = (file_name) => {
    return file_name.substring(
      file_name.lastIndexOf("uploads/") + "uploads/".length,
      file_name.lastIndexOf(".")
    );
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
  const handleClickDeleteUpload = (event, uploadItem) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setUploadToDelete(uploadItem);
  };
  const handleDeleteUploadConfirm = async () => {
    console.log("Deleting: ", uploadToDelete);
    try {
      let schemes = await SchemeService.getSchemeListByUploadID(
        uploadToDelete.id
      );
      if (schemes.length) {
        setAssociatedSchemes(schemes);
      } else {
        dispatch(deleteUpload(uploadToDelete, true));
        setUploadToDelete(null);
      }
    } catch (err) {
      dispatch(setMessage({ message: err.message }));
      setUploadToDelete(null);
    }
  };

  const handleDeleteUploadFinally = (deleteFromAll = true) => {
    if (deleteFromAll) {
      dispatch(deleteLayerItemsByUploadID(uploadToDelete.id));
      dispatch(setCurrentLayer(null));
    }
    dispatch(deleteUpload(uploadToDelete, deleteFromAll));
    setUploadToDelete(null);
    setAssociatedSchemes([]);
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
                  <CustomImg
                    src={`${config.assetsURL}/${uploadItem.file_name}`}
                    alt={getNameFromFileName(uploadItem.file_name)}
                  />
                  <GridListTileBar
                    title={getNameFromFileName(uploadItem.file_name)}
                    actionIcon={
                      <DeleteButton
                        onClick={(event) =>
                          handleClickDeleteUpload(event, uploadItem)
                        }
                      >
                        <DeleteIcon />
                      </DeleteButton>
                    }
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
      <ConfirmDialog
        text={
          uploadToDelete
            ? `Are you sure to delete "${getNameFromFileName(
                uploadToDelete.file_name
              )}"?`
            : ""
        }
        open={!!uploadToDelete}
        onCancel={() => setUploadToDelete(null)}
        onConfirm={handleDeleteUploadConfirm}
      />
      <YesNoDialog
        text={
          associatedSchemes.length ? (
            <>
              The Projects below have the associated file:
              <ul>
                {associatedSchemes.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
              Would you like delete all of them?
            </>
          ) : (
            ""
          )
        }
        open={!!associatedSchemes.length}
        onYes={() => handleDeleteUploadFinally(true)}
        onNo={() => handleDeleteUploadFinally(false)}
      />
    </Dialog>
  );
};

export default UploadDialog;
