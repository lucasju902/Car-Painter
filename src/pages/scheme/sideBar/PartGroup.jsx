import React, { useState } from "react";
import clsx from "clsx";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { ReactSortable } from "react-sortablejs";
import { spacing } from "@material-ui/system";

import {
  updateLayer,
  setCurrent as setCurrentLayer,
} from "redux/reducers/layerReducer";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Button as MuiButton,
  ButtonGroup as MuiButtonGroup,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { makeStyles } from "@material-ui/core/styles";
import PartItem from "./PartItem";

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const Button = styled(MuiButton)(spacing);
const ButtonGroup = styled(MuiButtonGroup)(spacing);
const AddButton = styled(Button)`
  min-width: 40px;
  padding: 3px 5px;
  .MuiButton-startIcon {
    margin-right: 2px;
  }
  .MuiButton-endIcon {
    margin: 0;
  }
  .fa-lg {
    font-size: 1.3333333333em !important;
  }
`;

const PartGroup = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const {
    layerList,
    title,
    actions,
    extraChildren,
    disableLock,
    disableDnd,
  } = props;
  const sortedList = _.sortBy(layerList, ["layer_order"]);

  const handleExpandClick = () => {
    setExpanded((preValue) => !preValue);
  };
  const handleChangeLayer = (list) => {
    for (let index in list) {
      const layer = layerList.find((item) => item.id === list[index].id);
      if (layer.layer_order !== parseInt(index) + 1) {
        dispatch(
          updateLayer({
            ...layer,
            layer_order: parseInt(index) + 1,
          })
        );
      }
    }
  };
  const toggleField = (id, field) => {
    const layer = layerList.find((item) => item.id === id);
    dispatch(
      updateLayer({
        ...layer,
        [field]: layer[field] ? false : true,
      })
    );
  };
  const selectLayer = (layer) => {
    dispatch(setCurrentLayer(layer));
  };

  return (
    <Box mb={2}>
      <Card>
        <CardHeader
          title={title}
          action={
            <Box display="flex">
              {actions ? (
                <ButtonGroup mr={1}>
                  {actions.map((action, index) => (
                    <AddButton
                      key={index}
                      onClick={action.onClick}
                      size="small"
                      startIcon={<AddIcon />}
                      endIcon={<FontAwesomeIcon icon={action.icon} size="lg" />}
                      variant="outlined"
                    ></AddButton>
                  ))}
                </ButtonGroup>
              ) : (
                <></>
              )}
              <IconButton
                onClick={handleExpandClick}
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          }
        />
        <Collapse in={expanded}>
          <CardContent>
            <ReactSortable
              list={sortedList}
              setList={handleChangeLayer}
              animation={150}
              sort={!disableDnd}
            >
              {sortedList.map((item) => (
                <PartItem
                  text={item.layer_data.name}
                  layer_visible={item.layer_visible}
                  layer_locked={item.layer_locked}
                  key={item.id}
                  toggleVisible={() => toggleField(item.id, "layer_visible")}
                  toggleLocked={() => toggleField(item.id, "layer_locked")}
                  selected={currentLayer && currentLayer.id === item.id}
                  onClick={() => selectLayer(item)}
                  disableLock={disableLock}
                />
              ))}
            </ReactSortable>
            {extraChildren}
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default PartGroup;
