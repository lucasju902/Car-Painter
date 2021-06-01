import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import config from "config";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

import { Box, Button as MuiButton, Typography, Grid } from "@material-ui/core";

import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import ScreenLoader from "components/ScreenLoader";
import CreateProjectDialog from "dialogs/CreateProjectDialog";
import SearchBox from "components/SearchBox";

import { getDifferenceFromToday } from "helper";

import {
  getSchemeList,
  createScheme,
  getScheme,
} from "redux/reducers/schemeReducer";
import { getCarMakeList } from "redux/reducers/carMakeReducer";

const Button = styled(MuiButton)(spacing);
const CustomInfiniteScroll = styled(InfiniteScroll)`
  &.infinite-scroll-component {
    overflow: hidden !important;
  }
`;
const CustomImg = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
`;
const Wrapper = styled(Box)`
  background-color: #444;
  border-radius: 10px;
`;
const ItemWrapper = styled(Box)`
  border: 1px solid grey;
  cursor: pointer;
`;

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

  const step = 15;
  const [limit, setLimit] = useState(step);
  const [search, setSearch] = useState("");

  const filteredSchemeList = useMemo(
    () =>
      schemeList.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.carMake.name.toLowerCase().includes(search.toLowerCase())
      ),
    [schemeList, search]
  );

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

  const handleCreateNew = () => {
    setDialog("CreateProjectDialog");
  };

  const increaseData = () => {
    setLimit(limit + step);
  };

  const schemeThumbnailURL = (id) => {
    return `${config.assetsURL}/scheme_thumbnails/${id}.png`;
  };

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      {schemeLoading || carMakeLoading || !schemeList || !carMakeList ? (
        <ScreenLoader />
      ) : (
        <>
          <Wrapper
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={2}
            p={5}
            height="calc(100% - 16px)"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              mb={3}
            >
              <SearchBox
                value={search}
                onChange={(value) => setSearch(value)}
              />
              <Button
                onClick={handleCreateNew}
                color="default"
                variant="outlined"
              >
                NEW
              </Button>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              mb={3}
            >
              <Typography variant="body1">Last modified</Typography>
            </Box>
            <Box id="scheme-list-content" overflow="auto" position="relative">
              <CustomInfiniteScroll
                dataLength={limit} //This is important field to render the next data
                next={increaseData}
                hasMore={limit < filteredSchemeList.length}
                loader={<Loader />}
                scrollableTarget="scheme-list-content"
              >
                <Grid container spacing={4}>
                  {filteredSchemeList.slice(0, limit).map((scheme) => (
                    <Grid
                      key={scheme.id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={3}
                      onClick={() => openScheme(scheme.id)}
                    >
                      <ItemWrapper display="flex" flexDirection="column">
                        <CustomImg
                          src={schemeThumbnailURL(scheme.id)}
                          alt={scheme.name}
                        />
                        <Box display="flex" flexDirection="column" p={4}>
                          <Typography variant="body1">{scheme.name}</Typography>
                          <Typography variant="body2">
                            Edited{" "}
                            {getDifferenceFromToday(scheme.date_modified)}
                          </Typography>
                          <Typography variant="body2">
                            {scheme.carMake.name}
                          </Typography>
                        </Box>
                      </ItemWrapper>
                    </Grid>
                  ))}
                </Grid>
              </CustomInfiniteScroll>
            </Box>
          </Wrapper>
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
