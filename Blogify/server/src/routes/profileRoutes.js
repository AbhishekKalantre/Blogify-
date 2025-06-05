import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
} from "../controllers/profileController.js";
import upload from "../utils/uploadMiddleware.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);
router.post(
  "/:id/profile-picture",
  upload.single("profile_picture"),
  updateProfilePicture
);

export default router;
