import express from "express";
import { checkAuthenticated } from "./middleware/checkAuthenticated";
import { ApiV1Router } from "./v1/router";

const app = express();

app.use(express.json());
app.use(checkAuthenticated);

app.use("/api/v1", new ApiV1Router().router);

export { app };
