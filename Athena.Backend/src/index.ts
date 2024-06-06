import dotenv from "dotenv";
import express from "express";
import { Application } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { AppDataSource } from "./db/data-source";
import { useExpressServer } from "routing-controllers";
import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor } from "@opentelemetry/tracing";
import { CollectorTraceExporter } from "@opentelemetry/exporter-collector-proto";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

dotenv.config();
const PORT: number = parseInt(process.env.PORT || "8000");
let app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));

try {
  const connected = AppDataSource.initialize();
  if (connected) {
    console.log("Database connection established");
  }
} catch (error) {
  console.log("Database connection failed", error);
}
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "portfolio-api",
  }),
});
provider.addSpanProcessor(
  new SimpleSpanProcessor(new CollectorTraceExporter())
);
provider.register();
const tracer = provider.getTracer("portfolio-api");

const controllerPath = path.resolve("src", "controller", "*.ts");

useExpressServer(app, {
  defaultErrorHandler: true,
  routePrefix: "/portfolio-api",
  controllers: [controllerPath],
});

let server = app.listen(PORT, () => {
  return console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
export default server;
