import { RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";

import Contact from "src/models/Contact";
import validationErrorParser from "src/utils/validationErrorParser";

export const getContacts: RequestHandler = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const createContact: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const { name, phone, email } = matchedData(req, {
      locations: ["body"],
    });

    // FORMAT PHONE NUMBER
    let raw = phone.trim();
    let digits = raw.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }

    const formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(
      3,
      6
    )}-${digits.slice(6)}`;

    const vote = await Contact.create({
      name,
      phone,
      email,
    });

    res.status(201).json(vote);
  } catch (error) {
    next(error);
  }
};

export const updateContact: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const { id } = req.params;
    const updates = matchedData(req, {
      locations: ["body"],
    });

    if (updates.phone) {
      // FORMAT PHONE NUMBER
      let raw = updates.phone.trim();
      let digits = raw.replace(/\D/g, "");
      if (digits.length === 11 && digits.startsWith("1")) {
        digits = digits.slice(1);
      }

      const formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(
        3,
        6
      )}-${digits.slice(6)}`;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      { new: true }
    );

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
