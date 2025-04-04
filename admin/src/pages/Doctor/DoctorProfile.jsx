import React, { useContext, useState, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fees: "",
    address: {
      line1: "",
      line2: "",
    },
    available: true,
  });

  useEffect(() => {
    if (dToken) {
      console.log("Fetching profile data with token:", dToken);
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      console.log("Profile data received:", profileData);
      setFormData({
        fees: profileData.fees || "",
        address: profileData.address || { line1: "", line2: "" },
        available: profileData.available !== undefined ? profileData.available : true,
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "line1" || name === "line2") {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        {
          fees: formData.fees,
          address: formData.address,
          available: formData.available,
        },
        {
          headers: { dToken: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        getProfileData(); // Refresh profile data
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        fees: profileData.fees || "",
        address: profileData.address || { line1: "", line2: "" },
        available: profileData.available !== undefined ? profileData.available : true,
      });
    }
    setIsEdit(false);
  };

  if (!dToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">Not logged in. Please login to view your profile.</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] m-5 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-6 text-sm bg-white border rounded-xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img
            className="w-36 h-36 object-cover rounded-full border-4 border-gray-200"
            src={profileData.image || "https://via.placeholder.com/150"}
            alt={profileData.name}
          />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold text-gray-800">{profileData.name}</h1>
            <div className="mt-2 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {profileData.speciality}
              </span>
              {profileData.available ? (
                <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              ) : (
                <span className="ml-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
            <div className="mt-4 text-gray-600">
              <p className="font-medium">{profileData.degree}</p>
              <p>{profileData.experience} Years Experience</p>
            </div>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">About</h2>
            <p className="text-gray-600">{profileData.about}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Email: </span>
                {profileData.email}
              </p>
              <div className="text-gray-600">
                <span className="font-medium text-gray-700">Address: </span>
                <p className="mt-1 text-gray-600">
                  {profileData.address?.line1}
                  {profileData.address?.line2 && (
                    <>
                      <br />
                      {profileData.address.line2}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-2 border-gray-200" />

        {isEdit ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="fees">
                  Consultation Fee ({currency})
                </label>
                <input
                  id="fees"
                  name="fees"
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fees}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Availability</label>
                <div className="flex items-center">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <label htmlFor="available" className="ml-2 block text-gray-700">
                    Available for Appointments
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  name="line1"
                  type="text"
                  placeholder="Address Line 1"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  value={formData.address.line1}
                  onChange={handleChange}
                />
                <input
                  name="line2"
                  type="text"
                  placeholder="Address Line 2 (optional)"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.address.line2}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-700">Consultation Fee</p>
              <p className="text-2xl font-bold text-blue-600">
                {currency}{profileData.fees}
              </p>
            </div>
            
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
