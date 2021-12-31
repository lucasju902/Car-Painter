const express = require("express");
const authRoute = require("./authRoute");
const schemeRoute = require("./schemeRoute");
const sharedSchemeRoute = require("./sharedSchemeRoute");
const favoriteSchemeRoute = require("./favoriteSchemeRoute");
const teamRoute = require("./teamRoute");
const leagueSeriesRoute = require("./leagueSeriesRoute");
const carMakeRoute = require("./carMakeRoute");
const basePaintRoute = require("./basePaintRoute");
const layerRoute = require("./layerRoute");
const overlayRoute = require("./overlayRoute");
const logoRoute = require("./logoRoute");
const uploadRoute = require("./uploadRoute");
const userRoute = require("./userRoute");
const fontRoute = require("./fontRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/scheme", schemeRoute);
router.use("/shared", sharedSchemeRoute);
router.use("/favorite", favoriteSchemeRoute);
router.use("/team", teamRoute);
router.use("/leagueSeries", leagueSeriesRoute);
router.use("/carMake", carMakeRoute);
router.use("/base", basePaintRoute);
router.use("/layer", layerRoute);
router.use("/overlay", overlayRoute);
router.use("/logo", logoRoute);
router.use("/upload", uploadRoute);
router.use("/user", userRoute);
router.use("/font", fontRoute);

module.exports = router;
