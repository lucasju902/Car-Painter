const express = require("express");
const authRoute = require("./authRoute");
const schemeRoute = require("./schemeRoute");
const sharedSchemeRoute = require("./sharedSchemeRoute");
const carMakeRoute = require("./carMakeRoute");
const basePaintRoute = require("./basePaintRoute");
const layerRoute = require("./layerRoute");
const overlayRoute = require("./overlayRoute");
const logoRoute = require("./logoRoute");
const uploadRoute = require("./uploadRoute");
const fontRoute = require("./fontRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/scheme", schemeRoute);
router.use("/shared", sharedSchemeRoute);
router.use("/carMake", carMakeRoute);
router.use("/base", basePaintRoute);
router.use("/layer", layerRoute);
router.use("/overlay", overlayRoute);
router.use("/logo", logoRoute);
router.use("/upload", uploadRoute);
router.use("/font", fontRoute);

module.exports = router;
