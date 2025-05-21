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

    // CODE QUALITY ISSUE 1
    // Variable was named `vote` instead of `contact`
    const contact = await Contact.create({
      name,
      // BUG 3 SOLUTION
      // Use formatted phone number instead of raw phone number
      phone: formattedPhone,
      email,
    });

    res.status(201).json(contact);
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
      // CODE QUALITY ISSUE 2
      // The block of code below that formats the phone number is repeated in createContact AND updateContact
      // Should be refactored into a helper function

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

      // BUG 4 SOLUTION PART 2
      // Use formatted phone number instead of raw phone number
      updates.phone = formattedPhone;
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
