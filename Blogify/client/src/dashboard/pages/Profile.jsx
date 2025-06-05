import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Camera,
  ChevronRight,
  Shield,
  AlertCircle,
  Upload,
} from "lucide-react";

const Profile = () => {
  const defaultUserData = {
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Default avatar
    role: "User",
    joinDate: "",
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...defaultUserData });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState(null);

  const fileInputRef = useRef(null);

  // Get user ID from localStorage (assuming it's saved during login)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  // Function to get proper image URL
  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return "https://randomuser.me/api/portraits/men/1.jpg";

    // If it's already a full URL, return it
    if (profilePicture.startsWith("http")) return profilePicture;

    // If it's a path starting with "/uploads", prefix with API base URL
    const baseUrl = axios.defaults.baseURL || "";
    return `${baseUrl}${profilePicture}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/profile/${userId}`);

        if (response.data.success) {
          const profileData = response.data.data;

          // Format the data for our component
          const formattedData = {
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            avatar: getImageUrl(profileData.profile_picture),
            role: profileData.role || "User",
            joinDate: new Date(profileData.created_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ),
          };

          setUserData(formattedData);
          setFormData(formattedData);
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      setError("User ID not found. Please log in again.");
      setLoading(false);
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdateSuccess(false);

      // Prepare data for API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      // Call API to update user profile
      const response = await axios.put(`/api/profile/${userId}`, updateData);

      if (response.data.success) {
        // Update local state with form data
        const updatedProfile = {
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        };

        setUserData(updatedProfile);
        setUpdateSuccess(true);
        setIsEditing(false);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again later.");
    }
  };

  const handleProfilePictureClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setPhotoMessage({
        type: "error",
        text: "Please select a valid image file (JPEG, PNG, GIF)",
      });
      setTimeout(() => setPhotoMessage(null), 3000);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage({
        type: "error",
        text: "Image size should be less than 5MB",
      });
      setTimeout(() => setPhotoMessage(null), 3000);
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoMessage(null);

      // Create form data
      const formData = new FormData();
      formData.append("profile_picture", file);

      // Upload the image
      const response = await axios.post(
        `/api/profile/${userId}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Update the avatar in the state with properly formatted URL
        const updatedUserData = {
          ...userData,
          avatar: getImageUrl(response.data.data.profile_picture),
        };

        setUserData(updatedUserData);
        setPhotoMessage({
          type: "success",
          text: "Profile picture updated successfully!",
        });
      } else {
        setPhotoMessage({
          type: "error",
          text: response.data.message || "Failed to update profile picture",
        });
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setPhotoMessage({
        type: "error",
        text: "Failed to upload profile picture. Please try again.",
      });
    } finally {
      setUploadingPhoto(false);
      setTimeout(() => setPhotoMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl p-5 sm:p-8 md:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-white"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex flex-wrap items-center gap-2">
            My Profile
            {!loading && userData && userData.role && (
              <div className="px-3 py-1 bg-white/20 text-xs rounded-full backdrop-blur-sm">
                {userData.role}
              </div>
            )}
          </h1>
          <p className="opacity-80 text-sm sm:text-base md:text-lg">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      <div className="bg-white rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 -mt-6 relative z-20">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        ) : (
          <>
            {updateSuccess && (
              <div className="bg-green-50 text-green-700 p-4 mb-6 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                <p>Profile updated successfully!</p>
              </div>
            )}

            {photoMessage && (
              <div
                className={`${
                  photoMessage.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                } p-4 mb-6 rounded-lg flex items-center gap-2`}
              >
                <AlertCircle size={18} />
                <p>{photoMessage.text}</p>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Profile Image Section */}
              <div className="md:w-1/3 flex flex-col items-center mt-10 sm:mt-12 md:mt-16">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-4 border-white shadow-xl -mt-20 object-cover z-10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={handleProfilePictureClick}
                      disabled={uploadingPhoto}
                      className="absolute bottom-2 right-2 bg-blue-600 p-2 sm:p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      {uploadingPhoto ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      ) : (
                        <>
                          <Camera size={16} className="text-white sm:hidden" />
                          <Camera
                            size={18}
                            className="text-white hidden sm:block"
                          />
                        </>
                      )}
                    </button>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/jpeg, image/png, image/gif"
                    />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-5 md:mt-6 text-gray-800">
                  <span>{userData.firstName}</span>
                  {userData.lastName && <span> {userData.lastName}</span>}
                </h2>
                <p className="text-blue-600 font-medium flex items-center gap-1">
                  <Shield size={14} /> {userData.role}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Member since {userData.joinDate}
                </p>

                <div className="w-full mt-6 sm:mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Account Status
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-green-600 font-medium">Active</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-6 sm:mt-8 w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <Edit2 size={16} className="sm:hidden" />
                  <Edit2 size={18} className="hidden sm:block" />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </button>
              </div>

              {/* Profile Details Section */}
              <div className="md:w-2/3 mt-8 md:mt-0">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Manage your personal details and contact information
                  </p>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={handleUpdate}
                    className="space-y-6 animate-fadeIn"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 sm:mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(userData);
                        }}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl shadow-sm transition-colors mr-3 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all text-sm sm:text-base"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <User className="text-blue-600" size={16} />
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            First Name
                          </p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">
                            {userData.firstName || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <User className="text-blue-600" size={16} />
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Last Name
                          </p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">
                            {userData.lastName || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <Mail className="text-blue-600" size={16} />
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Email Address
                          </p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">
                            {userData.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <Phone className="text-blue-600" size={16} />
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Phone Number
                          </p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">
                            {userData.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                          <MapPin className="text-blue-600" size={16} />
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          />
                        </div>
                        <div className="mt-2 sm:mt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Address
                          </p>
                          <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1 break-words">
                            {userData.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Profile;
