import { Schema, model, Document } from "mongoose";

interface ContactDoc extends Document {
  name: string;
  phone: string;
  email?: string;
  createdAt: Date;
}

const contactSchema = new Schema<ContactDoc>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Contact = model<ContactDoc>("Contact", contactSchema);

export default Contact;
