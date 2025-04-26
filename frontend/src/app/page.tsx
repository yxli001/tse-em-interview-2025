"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Modal,
    Table,
    TextField,
} from "@tritonse/tse-constellation";
import { getContacts, createContact, updateContact } from "../api/contact";

interface Contact {
    _id: string;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
}

export default function Home() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState<Contact | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    // Don't want users to type in non-digit characters in the phone input
    useEffect(() => {
        setPhone((prevPhone) => {
            return prevPhone.replace(/\D/g, "");
        });
    }, [phone]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            setError("Failed to load contacts");
            console.error(error);
        }
    };

    const handleAddContact = async () => {
        try {
            const newContact = await createContact(name, phone, email);
            setContacts([...contacts, newContact]);
            resetForm();
            setIsAddModalOpen(false);
            setError("");
        } catch (error) {
            setError("Failed to add contact");
            console.error(error);
        }
    };

    const handleUpdateContact = async () => {
        if (!currentContact) return;

        try {
            await updateContact(currentContact._id, name, phone, email);

            resetForm();
            setIsEditModalOpen(false);
            setCurrentContact(null);
            setError("");
        } catch (error) {
            setError("Failed to update contact");
            console.error(error);
        }
    };

    const openEditModal = (contact: Contact) => {
        setCurrentContact(contact);
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setName("");
        setPhone("");
        setEmail("");
        setError("");
    };

    // Table columns configuration
    const columns = [
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Phone",
            accessorKey: "phone",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Actions",
            cell: ({ row }: { row: { original: Contact } }) => (
                <Button
                    variant="secondary"
                    small
                    onClick={() => openEditModal(row.original)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Phonebook</h1>
                <Button
                    variant="default"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Contact
                </Button>
            </div>

            <Card
                contents={
                    <div>
                        {loading ? (
                            <p>Loading contacts...</p>
                        ) : (
                            <Table columns={columns} data={contacts} />
                        )}
                        {contacts.length === 0 && !loading && (
                            <p>No contacts found</p>
                        )}
                    </div>
                }
            />

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {isAddModalOpen && (
                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        resetForm();
                    }}
                    title="Add New Contact"
                    content={
                        <div className="space-y-4 mb-6">
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(value: string) => setName(value)}
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={phone}
                                onChange={(value: string) => setEmail(value)}
                            />
                            <TextField
                                label="Phone (digits only)"
                                value={phone}
                                onChange={(value: string) => setPhone(value)}
                            />

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleAddContact}
                                    disabled={!name || !phone || !email}
                                >
                                    Add Contact
                                </Button>
                            </div>
                        </div>
                    }
                    withDividers={false}
                />
            )}
            {isEditModalOpen && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setCurrentContact(null);
                        resetForm();
                    }}
                    title="Edit Contact"
                    content={
                        <>
                            <div className="space-y-4 mb-6">
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={(value: string) => setName(value)}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(value: string) =>
                                        setEmail(value)
                                    }
                                />
                                <TextField
                                    label="Phone (digits only)"
                                    value={phone}
                                    onChange={(value: string) =>
                                        setPhone(value)
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setCurrentContact(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleUpdateContact}
                                    disabled={!name || !phone || !email}
                                >
                                    Update Contact
                                </Button>
                            </div>
                        </>
                    }
                    withDividers={false}
                />
            )}
        </div>
    );
}
