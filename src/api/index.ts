import express from "express";
import { Request, Response } from "express";
import { DBConnection } from "@db/db";

const app = express();
const { PORT = 3000 } = process.env;

(async function () {
  DBConnection.init();
})();

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "hello world",
  });
});

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});
