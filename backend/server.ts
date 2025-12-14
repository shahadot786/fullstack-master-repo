import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./common/db/mongo";

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
