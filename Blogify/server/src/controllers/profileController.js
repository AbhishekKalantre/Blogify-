import {
  getProfileQuery,
  updateProfileQuery,
  updateProfilePictureQuery,
} from "../services/profileService.js";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getProfileQuery(id);
    return res.status(response.success ? 200 : 404).json(response);
  } catch (error) {
    console.error("Profile Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const response = await updateProfileQuery(id, userData);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Profile Update Error: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get the filename of the uploaded file
    const filename = req.file.filename;

    // Update the profile picture in the database
    const response = await updateProfilePictureQuery(id, filename);

    return res.status(response.success ? 200 : 400).json(response);
  } catch (error) {
    console.error("Profile Picture Update Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
    });
  }
};
