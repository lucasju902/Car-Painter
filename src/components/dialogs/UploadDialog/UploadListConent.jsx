import React, { useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { getNameFromUploadFileName, uploadAssetURL } from "helper";

import { DropzoneArea } from "material-ui-dropzone";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Box, ImageListItemBar } from "components/MaterialUI";
import { ImageWithLoad, Loader, ScreenLoader } from "components/common";
import { ConfirmDialog, YesNoDialog } from "components/dialogs";
import {
  CustomInfiniteScroll,
  CustomImageList,
  CustomImageListItem,
  DeleteButton,
} from "./UploadDialog.style";

import { uploadFiles, deleteUpload } from "redux/reducers/uploadReducer";
import {
  deleteItemsByUploadID as deleteLayerItemsByUploadID,
  setCurrent as setCurrentLayer,
} from "redux/reducers/layerReducer";
import { setMessage } from "redux/reducers/messageReducer";
import SchemeService from "services/schemeService";

export const UploadListContent = React.memo((props) => {
  const step = 40;
  const dispatch = useDispatch();
  const { uploads, search, setSearch, onOpenUpload } = props;
  const user = useSelector((state) => state.authReducer.user);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const [uploadToDelete, setUploadToDelete] = useState(null);
  const [associatedSchemes, setAssociatedSchemes] = useState([]);
  const [limit, setLimit] = useState(step);
  const [loading, setLoading] = useState(false);
  const [fetchingDeleteList, setFetchingDeleteList] = useState(false);
  const [files, setFiles] = useState([]);
  const [dropZoneKey, setDropZoneKey] = useState(1);

  const scrollToRef = useRef(null);

  const filteredUploads = useMemo(
    () =>
      _.orderBy(uploads, ["id"], "desc").filter((item) =>
        getNameFromUploadFileName(item.file_name, user)
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [uploads, user, search]
  );

  const increaseData = useCallback(() => {
    setLimit(limit + step);
  }, [setLimit, limit]);

  const handleDropZoneChange = useCallback(
    (files_up) => {
      console.log(files_up);
      if (files_up.length) {
        setLoading(true);
        dispatch(
          uploadFiles(user.id, currentScheme.id, files_up, () => {
            setLoading(false);
          })
        );
        setFiles([]);
        setSearch("");
        setDropZoneKey(dropZoneKey + 1);
      }
    },
    [dispatch, user.id, currentScheme.id, setSearch, dropZoneKey]
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
      setFetchingDeleteList(true);
      let schemes = await SchemeService.getSchemeListByUploadID(
        uploadToDelete.id
      );
      setFetchingDeleteList(false);
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

  const handleCancelForDeleteUploadFinally = useCallback(
    () => handleDeleteUploadFinally(false),
    [handleDeleteUploadFinally]
  );

  const unsetUploadToDelete = useCallback(() => setUploadToDelete(null), []);

  return (
    <>
      <DropzoneArea
        onChange={handleDropZoneChange}
        value={files}
        showPreviews={false}
        showPreviewsInDropzone={false}
        showFileNamesInPreview={false}
        showFileNames={false}
        acceptedFiles={["image/*"]}
        maxFiles={10}
        key={dropZoneKey}
      />
      <Box
        id="upload-dialog-content"
        overflow="auto"
        height="min(700px, calc(100vh - 500px))"
        mt={1}
        position="relative"
      >
        <CustomInfiniteScroll
          dataLength={limit} //This is important field to render the next data
          next={increaseData}
          hasMore={limit < filteredUploads.length}
          loader={<Loader />}
          scrollableTarget="upload-dialog-content"
        >
          <CustomImageList rowHeight={178} cols={3}>
            {filteredUploads.slice(0, limit).map((uploadItem) => (
              <CustomImageListItem
                key={uploadItem.id}
                cols={1}
                onClick={() => onOpenUpload(uploadItem)}
              >
                <ImageWithLoad
                  src={uploadAssetURL(uploadItem)}
                  alt={getNameFromUploadFileName(uploadItem.file_name, user)}
                  alignItems="center"
                />
                <ImageListItemBar
                  title={getNameFromUploadFileName(uploadItem.file_name, user)}
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
              </CustomImageListItem>
            ))}
          </CustomImageList>
          {loading ? (
            <Box
              position="absolute"
              bgcolor="rgba(0, 0, 0, 0.5)"
              width="100%"
              height="100%"
              left="0"
              top="0"
            >
              <ScreenLoader />
            </Box>
          ) : (
            <></>
          )}

          <div ref={scrollToRef}></div>
        </CustomInfiniteScroll>
      </Box>

      <ConfirmDialog
        text={
          uploadToDelete
            ? `Are you sure you want to delete "${getNameFromUploadFileName(
                uploadToDelete.file_name,
                user
              )}"?`
            : ""
        }
        open={!!uploadToDelete}
        onCancel={unsetUploadToDelete}
        onConfirm={handleDeleteUploadConfirm}
        confirmLoading={fetchingDeleteList}
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
        onYes={handleDeleteUploadFinally}
        onNo={handleCancelForDeleteUploadFinally}
      />
    </>
  );
});

export default UploadListContent;
