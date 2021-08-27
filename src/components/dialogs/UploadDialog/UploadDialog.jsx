import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import config from "config";
import { getNameFromUploadFileName } from "helper";

import { DropzoneArea } from "material-ui-dropzone";
import { Delete as DeleteIcon } from "@material-ui/icons";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  GridListTileBar,
} from "components/MaterialUI";
import { ImageWithLoad, Loader } from "components/common";
import { ConfirmDialog, YesNoDialog } from "components/dialogs";
import {
  CustomInfiniteScroll,
  CustomGridList,
  CustomGridListTile,
  CustomDialogContent,
  DeleteButton,
} from "./UploadDialog.style";

import { uploadFiles, deleteUpload } from "redux/reducers/uploadReducer";
import {
  deleteItemsByUploadID as deleteLayerItemsByUploadID,
  setCurrent as setCurrentLayer,
} from "redux/reducers/layerReducer";
import { setMessage } from "redux/reducers/messageReducer";
import SchemeService from "services/schemeService";

export const UploadDialog = React.memo((props) => {
  const step = 30;
  const dispatch = useDispatch();
  const { uploads, onCancel, open, onOpenUpload } = props;
  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const [uploadToDelete, setUploadToDelete] = useState(null);
  const [associatedSchemes, setAssociatedSchemes] = useState([]);
  const [limit, setLimit] = useState(step);
  const [files, setFiles] = useState([]);
  const [dropZoneKey, setDropZoneKey] = useState(1);

  const scrollToRef = useRef(null);

  const increaseData = useCallback(() => {
    setLimit(limit + step);
  }, [setLimit, limit]);

  const handleDropZoneChange = useCallback(
    (files_up) => {
      console.log(files_up);
      if (files_up.length) {
        dispatch(
          uploadFiles(user.id, currentScheme.id, files_up, () => {
            scrollToRef.current.scrollIntoView({ behavior: "smooth" });
          })
        );
        setFiles([]);
        setDropZoneKey(dropZoneKey + 1);
      }
    },
    [dispatch, user.id, currentScheme.id, setFiles, dropZoneKey, setDropZoneKey]
  );
  const handleClickDeleteUpload = useCallback(
    (event, uploadItem) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      setUploadToDelete(uploadItem);
    },
    [setUploadToDelete]
  );
  const handleDeleteUploadConfirm = useCallback(async () => {
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
  }, [dispatch, uploadToDelete, setAssociatedSchemes, setUploadToDelete]);

  const handleDeleteUploadFinally = useCallback(
    (deleteFromAll = true) => {
      if (deleteFromAll) {
        dispatch(deleteLayerItemsByUploadID(uploadToDelete.id));
        dispatch(setCurrentLayer(null));
      }
      dispatch(deleteUpload(uploadToDelete, deleteFromAll));
      setUploadToDelete(null);
      setAssociatedSchemes([]);
    },
    [dispatch, uploadToDelete, setUploadToDelete, setAssociatedSchemes]
  );

  return (
    <Dialog aria-labelledby="upload-title" open={open} onClose={onCancel}>
      <DialogTitle id="upload-title">My Uploads</DialogTitle>
      <CustomDialogContent dividers>
        <DropzoneArea
          onChange={handleDropZoneChange}
          value={files}
          showPreviews={false}
          showPreviewsInDropzone={false}
          showFileNamesInPreview={false}
          showFileNames={false}
          maxFiles={10}
          key={dropZoneKey}
        />
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
                  <ImageWithLoad
                    src={`${config.assetsURL}/${uploadItem.file_name}`}
                    alt={getNameFromUploadFileName(uploadItem.file_name, user)}
                  />
                  <GridListTileBar
                    title={getNameFromUploadFileName(
                      uploadItem.file_name,
                      user
                    )}
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
            <div ref={scrollToRef}></div>
          </CustomInfiniteScroll>
        </Box>
      </CustomDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
      <ConfirmDialog
        text={
          uploadToDelete
            ? `Are you sure to delete "${getNameFromUploadFileName(
                uploadToDelete.file_name,
                user
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
});

export default UploadDialog;
