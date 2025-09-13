import { response, Router } from "express";
import multer from "multer";

import customers from "./app/controllers/CostumersController";
import contact from "./app/controllers/ContactsController";
import users from "./app/controllers/UsersController";
import sessions from "./app/controllers/SessionsController";
import auth from "./app/middlewares/auth";
import multerrConf from "./config/multer"
import files from "./app/controllers/FilesController";

const routes = new Router();
const uploads = multer(multerrConf);

//Sessions
routes.post("/session", sessions.create);

routes.use(auth);

//Customer
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.delete);

//Contacts
routes.get("/customers/:customerId/contacts", contact.index);
routes.get("/customers/:customerId/contacts/:id", contact.show);
routes.post("/customers/:customerId/contacts", contact.create);
routes.put("/customers/:customerId/contacts/:id", contact.update);
routes.delete("/customers/:customerId/contacts/:id", contact.delete);

//Users
routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

//Files
routes.post("/files", uploads.single("file"), files.create);


export default routes;