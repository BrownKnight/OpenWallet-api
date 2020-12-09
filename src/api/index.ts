import { DB } from "@db/db";
import { app } from "./app";

const { PORT = 3000 } = process.env;

(async function () {
  await DB.init();
})();

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});
