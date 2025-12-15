import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "@common/db/mongo";
import { config } from "@config/index";

const PORT = config.port;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});
