import { useCallback, useMemo } from "react";
import Konva from "konva";
import { PaintingGuides } from "constant";
import { mathRound2 } from "helper";

export const useDrag = ({
  stageRef,
  shapeRef,
  paintingGuides,
  guideData,
  frameSize,
  offsetsFromStroke,
  onSelect,
  onChange,
  onDragStart,
  onDragEnd,
}) => {
  const GUIDELINE_ID = "snapping-guide-line";
  const GUIDELINE_OFFSET = useMemo(
    () => (guideData ? Math.max(guideData.grid_padding / 10, 2) : 10),
    [guideData]
  );

  const getLineGuideStops = useCallback(() => {
    var vertical = Array.from(
      Array(Math.round(frameSize.width / guideData.grid_padding))
    ).map((e, i) => guideData.grid_padding * i);
    var horizontal = Array.from(
      Array(Math.round(frameSize.height / guideData.grid_padding))
    ).map((e, i) => guideData.grid_padding * i);
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  }, [frameSize, guideData]);

  const getObjectSnappingEdges = useCallback(() => {
    var box = shapeRef.current.getClientRect({
      relativeTo: shapeRef.current.getParent().getParent(),
      skipShadow: true,
    });
    var pos = shapeRef.current.position();

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(pos.x - box.x),
          snap: "start",
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(pos.x - box.x - box.width / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(pos.x - box.x - box.width),
          snap: "end",
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(pos.y - box.y),
          snap: "start",
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(pos.y - box.y - box.height / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(pos.y - box.y - box.height),
          snap: "end",
        },
      ],
    };
  }, [shapeRef]);

  // find all snapping possibilities
  const getGuides = useCallback(
    (lineGuideStops, itemBounds) => {
      var resultV = [];
      var resultH = [];

      lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
          var diff = Math.abs(lineGuide - itemBound.guide);
          // if the distance between guild line and object snap point is close we can consider this for snapping
          if (diff < GUIDELINE_OFFSET) {
            resultV.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
          var diff = Math.abs(lineGuide - itemBound.guide);
          if (diff < GUIDELINE_OFFSET) {
            resultH.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset,
            });
          }
        });
      });

      var guides = [];

      // find closest snap
      var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
      var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
      if (minV) {
        guides.push({
          lineGuide: minV.lineGuide,
          offset: minV.offset,
          orientation: "V",
          snap: minV.snap,
        });
      }
      if (minH) {
        guides.push({
          lineGuide: minH.lineGuide,
          offset: minH.offset,
          orientation: "H",
          snap: minH.snap,
        });
      }
      return guides;
    },
    [GUIDELINE_OFFSET]
  );

  const drawGuides = useCallback(
    (guides) => {
      guides.forEach((lg) => {
        var layer = stageRef.current.findOne(".layer-guide-top");
        var line;
        if (lg.orientation === "H") {
          line = new Konva.Line({
            points: [0, 0, frameSize.width, 0],
            stroke: "rgb(255, 0, 0)",
            strokeWidth: 1,
            name: GUIDELINE_ID,
            dash: [4, 6],
          });
          layer.add(line);
          line.position({
            x: 0,
            y: lg.lineGuide,
          });
        } else if (lg.orientation === "V") {
          line = new Konva.Line({
            points: [0, 0, 0, frameSize.height],
            stroke: "rgb(255, 0, 0)",
            strokeWidth: 1,
            name: GUIDELINE_ID,
            dash: [4, 6],
          });
          layer.add(line);
          line.position({
            x: lg.lineGuide,
            y: 0,
          });
        }
      });
    },
    [frameSize, stageRef]
  );

  const handleDragMove = useCallback(
    (e) => {
      if (paintingGuides.includes(PaintingGuides.GRID) && guideData.snap_grid) {
        // clear all previous lines on the screen
        stageRef.current.find("." + GUIDELINE_ID).forEach((l) => l.destroy());

        // find possible snapping lines
        var lineGuideStops = getLineGuideStops(e.target);
        // find snapping points of current object
        var itemBounds = getObjectSnappingEdges(e.target);

        // now find where can we snap current object
        var guides = getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        if (!guides.length) {
          return;
        }

        drawGuides(guides);

        var pos = e.target.position();
        // now force object position
        guides.forEach((lg) => {
          switch (lg.snap) {
            case "start": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            case "center": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            case "end": {
              switch (lg.orientation) {
                case "V": {
                  pos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  pos.y = lg.lineGuide + lg.offset;
                  break;
                }
                default:
                  break;
              }
              break;
            }
            default:
              break;
          }
        });
        e.target.position(pos);
      }
    },
    [
      drawGuides,
      getGuides,
      getLineGuideStops,
      getObjectSnappingEdges,
      guideData,
      paintingGuides,
      stageRef,
    ]
  );

  const handleDragStart = useCallback(
    (e) => {
      onSelect();
      if (onDragStart) onDragStart();
    },
    [onSelect, onDragStart]
  );

  const handleDragEnd = useCallback(
    (e) => {
      stageRef.current.find("." + GUIDELINE_ID).forEach((l) => l.destroy());
      if (onChange) {
        onChange({
          left: mathRound2(
            e.target.x() - (offsetsFromStroke ? offsetsFromStroke.x : 0)
          ),
          top: mathRound2(
            e.target.y() - (offsetsFromStroke ? offsetsFromStroke.y : 0)
          ),
        });
      }
      if (onDragEnd) onDragEnd();
    },
    [stageRef, offsetsFromStroke, onChange, onDragEnd]
  );

  return [handleDragStart, handleDragMove, handleDragEnd];
};
