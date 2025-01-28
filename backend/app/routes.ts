import express from "express";
import userRoutes from "./user/user.route";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger/swagger.json");

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;