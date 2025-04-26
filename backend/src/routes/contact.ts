import express from "express";

import * as ContactController from "src/controllers/contact";
import * as ContactValidator from "src/validators/contact";

const contactRouter = express.Router();

contactRouter.get("/", ContactController.getContacts);
contactRouter.post(
    "/",
    ContactValidator.createContact,
    ContactController.createContact
);
contactRouter.put(
    "/:id",
    ContactValidator.updateContact,
    ContactController.updateContact
);

export default contactRouter;
