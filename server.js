import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import { startIndexer } from "./indexer/index.js";

dotenv.config();
const port = process.env.PORT || 3005;

createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);

   startIndexer();
});
