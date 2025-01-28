import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors";

import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import limiter from './app/common/middleware/rate-limiter.middleware';
import 'reflect-metadata';
import { AppDataSource } from './app/common/services/postgre.service';

loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
/*
const corsOptions = {
  origin: 'http://127.0.0.1:5173',  // Frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed methods
  credentials: true,  // Allow cookies if needed
};
*/

app.use(cors());

const initApp = async (): Promise<void> => {
  // init mongodb
  // await initDB();
 AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => console.log("Database connection failed:", error));

  // passport init
  initPassport();

  // limiter
  app.use(limiter);

  // set base path to /api
  app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });



  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};

void initApp();
