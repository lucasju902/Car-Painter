import { useEffect, useCallback, useMemo, useState } from "react";
import { useReducerRef } from "hooks";
import _ from "lodash";

import { useSelector, useDispatch } from "react-redux";

import { LayerTypes, ViewModes, FinishOptions } from "constant";

import {
  setSaving,
  setCurrent as setCurrentScheme,
} from "redux/reducers/schemeReducer";
import { setMessage } from "redux/reducers/messageReducer";
import {
  setCurrent as setCurrentLayer,
  updateLayer,
  setLoadedStatus,
} from "redux/reducers/layerReducer";
import { setShowProperties, setViewMode } from "redux/reducers/boardReducer";
import { dataURItoBlob, addImageProcess, downloadTGA } from "helper";
import SchemeService from "services/schemeService";

export const useCapture = (
  stageRef,
  baseLayerRef,
  mainLayerRef,
  carMaskLayerRef
) => {
  const dispatch = useDispatch();
  const [pauseCapturing, setPauseCapturing] = useState(false);
  const [, userRef] = useReducerRef(
    useSelector((state) => state.authReducer.user)
  );
  const [currentScheme, currentSchemeRef] = useReducerRef(
    useSelector((state) => state.schemeReducer.current)
  );
  const [, currentCarMakeRef] = useReducerRef(
    useSelector((state) => state.carMakeReducer.current)
  );
  const schemeSaving = useSelector((state) => state.schemeReducer.saving);
  const [, currentLayerRef] = useReducerRef(
    useSelector((state) => state.layerReducer.current)
  );
  const loadedStatuses = useSelector(
    (state) => state.layerReducer.loadedStatuses
  );
  const [drawingStatus, drawingStatusRef] = useReducerRef(
    useSelector((state) => state.layerReducer.drawingStatus)
  );
  const viewMode = useSelector((state) => state.boardReducer.viewMode);
  const [, showPropertiesRef] = useReducerRef(
    useSelector((state) => state.boardReducer.showProperties)
  );

  const [, frameSizeRef] = useReducerRef(
    useSelector((state) => state.boardReducer.frameSize)
  );

  const schemeFinishBase = useMemo(() => {
    if (currentScheme) {
      const foundFinish = FinishOptions.find(
        (item) => item.value === currentScheme.finish
      );
      if (foundFinish) return foundFinish.base;
    }
    return FinishOptions[0].base;
  }, [currentScheme]);

  const takeScreenshot = useCallback(
    async (isPNG = true) => {
      if (
        currentLayerRef.current &&
        ![LayerTypes.BASE, LayerTypes.CAR].includes(
          currentLayerRef.current.layer_type
        )
      ) {
        dispatch(updateLayer(currentLayerRef.current));
        dispatch(setCurrentLayer(null));
      }
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      const targetWidth =
        currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
      const pixelRatio = targetWidth / frameSizeRef.current.width;

      let width = frameSizeRef.current.width * pixelRatio;
      let height = frameSizeRef.current.height * pixelRatio;
      let baseLayerImg, mainLayerImg, carMaskLayerImg;
      let stageAttrs = { ...stageRef.current.attrs };

      const boardWrapper = document.getElementById("board-wrapper");

      boardWrapper.style.width = `${frameSizeRef.current.width}px`;
      boardWrapper.style.height = `${frameSizeRef.current.height}px`;
      const originShowProperties = showPropertiesRef.current;
      dispatch(setShowProperties(false));

      const baseLayerAbPos = baseLayerRef.current.absolutePosition();
      const mainLayerAbPos = mainLayerRef.current.absolutePosition();
      const carMaskLayerAbPos = carMaskLayerRef.current.absolutePosition();
      stageRef.current.setAttrs({
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        width: frameSizeRef.current.width,
        height: frameSizeRef.current.height,
      });
      stageRef.current.draw();

      if (baseLayerRef.current) {
        baseLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let baseLayerURL = baseLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        baseLayerImg = await addImageProcess(baseLayerURL);
      }

      if (mainLayerRef.current) {
        mainLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let mainLayerURL = mainLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        mainLayerImg = await addImageProcess(mainLayerURL);
      }
      if (carMaskLayerRef.current) {
        carMaskLayerRef.current.absolutePosition({
          x: 0,
          y: 0,
        });
        let carMaskLayerURL = carMaskLayerRef.current.toDataURL({
          pixelRatio,
          x: 0,
          y: 0,
          width: frameSizeRef.current.width,
          height: frameSizeRef.current.height,
        });
        carMaskLayerImg = await addImageProcess(carMaskLayerURL);
      }

      stageRef.current.setAttrs(_.omit(stageAttrs, ["container"]));
      stageRef.current.draw();
      setTimeout(() => {
        stageRef.current.x(stageAttrs.x);
        stageRef.current.y(stageAttrs.y);
        stageRef.current.draw();
      }, 100);

      baseLayerRef.current.absolutePosition(baseLayerAbPos);
      mainLayerRef.current.absolutePosition(mainLayerAbPos);
      carMaskLayerRef.current.absolutePosition(carMaskLayerAbPos);

      boardWrapper.style.width = `100%`;
      boardWrapper.style.height = `100%`;
      dispatch(setShowProperties(originShowProperties));
      canvas.width = width;
      canvas.height = height;

      if (baseLayerImg) {
        ctx.drawImage(baseLayerImg, 0, 0, width, height);
      }
      if (mainLayerImg) {
        ctx.drawImage(mainLayerImg, 0, 0, width, height);
      }
      if (carMaskLayerImg && isPNG) {
        ctx.drawImage(carMaskLayerImg, 0, 0, width, height);
      }
      return {
        canvas,
        ctx,
        carMaskLayerImg,
      };
    },
    [
      dispatch,
      showPropertiesRef,
      frameSizeRef,
      currentCarMakeRef,
      stageRef,
      baseLayerRef,
      mainLayerRef,
      carMaskLayerRef,
      currentLayerRef,
    ]
  );

  const uploadThumbnail = useCallback(
    async (dataURL) => {
      try {
        let blob = dataURItoBlob(dataURL);
        console.log("blob length: ", blob.size);
        var fileOfBlob = new File(
          [blob],
          `${currentSchemeRef.current.id}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        let formData = new FormData();
        formData.append("files", fileOfBlob);
        formData.append("schemeID", currentSchemeRef.current.id);
        dispatch(setCurrentScheme({ thumbnail_updated: 1 }));
        await SchemeService.uploadThumbnail(formData);
      } catch (err) {
        dispatch(setMessage({ message: err.message }));
      }
    },
    [dispatch, currentSchemeRef]
  );

  const handleUploadThumbnail = useCallback(
    async (uploadLater = true) => {
      if (
        stageRef.current &&
        currentSchemeRef.current &&
        !currentSchemeRef.current.thumbnail_updated
      ) {
        if (drawingStatusRef.current) {
          setPauseCapturing(true);
          return;
        }
        try {
          console.log("Uploading Thumbnail");
          dispatch(setSaving(true));
          const { canvas, ctx, carMaskLayerImg } = await takeScreenshot();
          ctx.drawImage(carMaskLayerImg, 0, 0);
          let dataURL = canvas.toDataURL("image/jpeg", 0.1);
          if (uploadLater) dispatch(setSaving(false));
          await uploadThumbnail(dataURL);
          if (!uploadLater) dispatch(setSaving(false));
          console.log("Uploaded Thumbnail");
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: err.message }));
        }
      }
    },
    [
      dispatch,
      currentSchemeRef,
      stageRef,
      drawingStatusRef,
      takeScreenshot,
      uploadThumbnail,
    ]
  );

  const retrieveTGADataURL = useCallback(async () => {
    if (stageRef.current && currentSchemeRef.current) {
      try {
        dispatch(setSaving(true));
        const { canvas } = await takeScreenshot(false);

        let dataURL = canvas.toDataURL("image/png", 1);
        dispatch(setSaving(false));
        return dataURL;
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
        return null;
      }
    }
  }, [dispatch, currentSchemeRef, stageRef, takeScreenshot]);

  const handleDownloadTGA = useCallback(
    async (isCustomNumberTGA = false) => {
      if (stageRef.current && currentSchemeRef.current) {
        try {
          dispatch(setSaving(true));
          const width =
            currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
          const height =
            currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
          const { canvas, ctx, carMaskLayerImg } = await takeScreenshot(false);

          dispatch(setSaving(false));
          downloadTGA(
            ctx,
            width,
            height,
            isCustomNumberTGA
              ? `car_num_${userRef.current.id}.tga`
              : `car_${userRef.current.id}.tga`
          );

          ctx.drawImage(carMaskLayerImg, 0, 0, width, height);
          let dataURL = canvas.toDataURL("image/jpeg", 0.1);
          if (!currentSchemeRef.current.thumbnail_updated)
            await uploadThumbnail(dataURL);
        } catch (err) {
          console.log(err);
          dispatch(setMessage({ message: err.message }));
        }
      }
    },
    [
      dispatch,
      currentSchemeRef,
      userRef,
      currentCarMakeRef,
      stageRef,
      takeScreenshot,
      uploadThumbnail,
    ]
  );

  const handleDownloadSpecTGA = useCallback(() => {
    if (stageRef.current && currentSchemeRef.current) {
      dispatch(setSaving(true));
      dispatch(setViewMode(ViewModes.SPEC_VIEW));
    }
  }, [dispatch, currentSchemeRef, stageRef]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (
      schemeSaving &&
      viewMode === ViewModes.SPEC_VIEW &&
      loadedStatuses[`guide-mask-${schemeFinishBase}`]
    ) {
      try {
        const width =
          currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
        const height =
          currentCarMakeRef.current.car_type === "Misc" ? 1024 : 2048;
        const { ctx } = await takeScreenshot(false);

        dispatch(setViewMode(ViewModes.NORMAL_VIEW));
        dispatch(
          setLoadedStatus({
            key: `guide-mask-${schemeFinishBase}`,
            value: false,
          })
        );
        setTimeout(() => dispatch(setSaving(false)), 500);

        downloadTGA(ctx, width, height, `car_spec_${userRef.current.id}.tga`);
      } catch (err) {
        console.log(err);
        dispatch(setMessage({ message: err.message }));
      }
    }
  }, [
    dispatch,
    schemeSaving,
    viewMode,
    schemeFinishBase,
    currentCarMakeRef,
    loadedStatuses,
    userRef,
    takeScreenshot,
  ]);

  useEffect(() => {
    if (pauseCapturing && !drawingStatus) {
      setPauseCapturing(false);
      handleUploadThumbnail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseCapturing, drawingStatus]);

  return [
    handleUploadThumbnail,
    handleDownloadTGA,
    handleDownloadSpecTGA,
    retrieveTGADataURL,
  ];
};
