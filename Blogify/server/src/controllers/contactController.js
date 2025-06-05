import ContactModel from "../models/contactModel.js";
import { createContactQuery } from "../services/contactService.js";

export const createContact = async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = new ContactModel({
      fullname,
      email,
      message,
    });

    const response = await createContactQuery(contact);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Contact Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
