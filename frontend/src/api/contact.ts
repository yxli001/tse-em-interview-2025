import { Contact } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/api/contact`);

  return (await response.json()) as Contact[];
};

export const createContact = async (
  name: string,
  phone: string,
  email: string
): Promise<Contact> => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone, email }),
  });

  return (await response.json()) as Contact;
};

export const updateContact = async (
  id: string,
  name: string,
  phone: string,
  email: string
): Promise<Contact> => {
  const response = await fetch(`${API_URL}/api/contact/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, phone, email }),
  });

  return (await response.json()) as Contact;
};
