import { body, param } from "express-validator";

const validateId = param("id")
  .notEmpty()
  .withMessage("ID is required")
  .isMongoId()
  .withMessage("ID must be a valid MongoDB ObjectId")
  .trim();

const validateName = body("name")
  .notEmpty()
  .withMessage("Name is required")
  .isString()
  .withMessage("Name must be a string")
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long")
  .isLength({ max: 50 })
  .withMessage("Name must be at most 50 characters long")
  .trim();

const validateEmail = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Email must be a valid email address")
  .trim();

const validatePhone = body("phone")
  .notEmpty()
  .withMessage("Phone is required")
  .isString()
  .withMessage("Phone must be a string")
  .isLength({ min: 10 })
  .withMessage("Phone must be at least 10 characters long")
  .isNumeric()
  .withMessage("Phone must be a number")
  .trim();

export const createContact = [validateName, validatePhone, validateEmail];

export const updateContact = [
  validateId,
  validateName.optional(),
  validatePhone.optional(),
  validateEmail.optional(),
];
