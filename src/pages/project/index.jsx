import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { Box } from "@material-ui/core";
import ScreenLoader from "components/ScreenLoader";
import ProjectSelectDialog from "dialogs/ProjectSelectDialog";
import OpenProjectDialog from "dialogs/OpenProjectDialog";
import CreateProjectDialog from "dialogs/CreateProjectDialog";

import {
  getSchemeList,
  createScheme,
  getScheme,
} from "redux/reducers/schemeReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";

const Scheme = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dialog, setDialog] = useState("ProjectSelectDialog");
  const user = useSelector((state) => state.authReducer.user);
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const schemeList = useSelector((state) => state.schemeReducer.list);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const schemeLoading = useSelector((state) => state.schemeReducer.loading);
  const carMakeLoading = useSelector((state) => state.carMakeReducer.loading);

  useEffect(() => {
    if (user) {
      if (!schemeList.length) dispatch(getSchemeList(user.id));
      if (!carMakeList.length) dispatch(getCarMakeList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (currentScheme) {
      history.push(`/scheme/${currentScheme.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScheme]);

  const openScheme = (schemeID) => {
    console.log("Opening scheme: ", schemeID);
    dispatch(getScheme(schemeID));
    setDialog(null);
  };

  const createSchemeFromCarMake = (carMake, name) => {
    dispatch(createScheme(carMake, name, user.id));
    setDialog(null);
  };

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      {schemeLoading || carMakeLoading || !schemeList || !carMakeList ? (
        <ScreenLoader />
      ) : (
        <>
          <ProjectSelectDialog
            open={dialog === "ProjectSelectDialog"}
            onCreateProject={() => setDialog("CreateProjectDialog")}
            onOpenProject={() => setDialog("OpenProjectDialog")}
            onCancel={() => setDialog(null)}
          />
          <OpenProjectDialog
            schemeList={schemeList}
            open={dialog === "OpenProjectDialog"}
            onCreateProject={() => setDialog("CreateProjectDialog")}
            onOpenProject={(scheme) => openScheme(scheme)}
            onCancel={() => setDialog("ProjectSelectDialog")}
          />
          <CreateProjectDialog
            carMakeList={carMakeList}
            open={dialog === "CreateProjectDialog"}
            onContinue={(carMake, name) =>
              createSchemeFromCarMake(carMake, name)
            }
            onCancel={() => setDialog("ProjectSelectDialog")}
          />
        </>
      )}
    </Box>
  );
};

export default Scheme;
