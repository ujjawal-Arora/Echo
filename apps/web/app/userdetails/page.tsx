"use client";
import { useState } from "react";
import uploadFile from "../Helper/upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {config} from "../config";
import ProtectedRoute from '../Components/ProtectedRoute';

interface UserDetailsResponse {
  success: boolean;
  message?: string;
}

const UserDetailsPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const availableInterests = [
    "Dancing",
    "Cooking",
    "Traveling",
    "Reading",
    "Movies",
    "Music",
    "Sports",
    "Art",
    "Fashion",
    "Gaming",
    "Fitness",
    "Photography",
    "Writing",
    "Yoga",
    "Adventure",
  ];

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    } else {
      setProfilePic(null);
    }
  };

  const handleRelationshipTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRelationshipType(e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };

  const handleInterestChange = (interest: string) => {
    setInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving user details...');

    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        toast.error('Authentication information missing. Please sign in again.', { id: loadingToast });
        router.push('/signin');
        return;
      }

      // Validate required fields
      if (!gender || !lookingFor || !bio || !location) {
        toast.error('Please fill in all required fields.', { id: loadingToast });
        return;
      }

      // Upload profile picture if selected
      let imageUrl = "";
      if (profilePic) {
        try {
          const uploadResponse = await uploadFile(profilePic);
          imageUrl = uploadResponse.secure_url; // Extract the secure_url from Cloudinary response
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          toast.error('Failed to upload profile picture. Please try again.', { id: loadingToast });
          return;
        }
      }

      // Create the user details object matching the validation schema
      const userDetails = {
        token,
        email,
        bio,
        gender,
        lookingFor,
        interests: interests || [],
        location,
        profilePic: imageUrl,
        relationshipType: relationshipType || undefined
      };

      console.log("Sending user details:", userDetails);

      const response = await axios.post<UserDetailsResponse>(
        `${config.apiBaseUrl}/userdetails`,
        userDetails
      );

      if (response.status === 200) {
        // Save flag in localStorage indicating user details are completed
        localStorage.setItem('userDetailsCompleted', 'true');
        toast.success('User details saved successfully!', { id: loadingToast });
        router.push('/swipe');
      } else {
        toast.error('Failed to save user details. Please try again.', { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Error submitting user details:", error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = validationErrors.map((err: any) => `${err.path}: ${err.message}`).join('\n');
        toast.error(`Validation errors:\n${errorMessages}`, { id: loadingToast });
      } else {
        const errorMessage = error.response?.data?.message || 'Error saving user details. Please try again.';
        toast.error(errorMessage, { id: loadingToast });
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <Toaster position="top-center" />
      <div className="bg-transparent border shadow-lg rounded-lg px-10 p-8 w-full max-w-2xl ">
        <h1 className="text-3xl text-[#DB1A5A] text-center font-bold mb-6">
          Tell Us About Yourself
        </h1>

        {step === 1 && (
          <>
            <label className="block text-xl mb-4">
              Upload Profile Picture:
            </label>
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-[#DB1A5A] text-white py-2 px-4 rounded cursor-pointer hover:bg-[#B81A4D] transition duration-200"
              >
                Choose Photo
              </label>
              {profilePic && (
                <div className="flex items-center space-x-2 bg-zinc-800 p-2 rounded-lg">
                  <span className="text-gray-200">{profilePic.name}</span>
                  <button
                    onClick={() => setProfilePic(null)}
                    className="text-[#DB1A5A] font-bold hover:text-[#B81A4D] "
                  >
                    &#10005;
                  </button>
                </div>
              )}
            </div>
            <label className="block text-xl mb-4">Write Your Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full p-3 h-28 text-gray-200 bg-transparent border rounded-md resize-none mb-6"
            />
            <button
              onClick={handleNext}
              className="bg-[#DB1A5A] py-2 px-4 rounded hover:bg-[#B81A4D] transition duration-200"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-xl text-[#DB1A5A] mb-2">Select Gender:</label>
            <div className="flex space-x-4 mb-6">
              {["male", "female", "other"].map((g) => (
                <label
                  key={g}
                  className="flex text-gray-300 font-bold items-center"
                >
                  <input
                    type="radio"
                    value={g}
                    checked={gender === g}
                    onChange={handleGenderChange}
                    className="mr-4 accent-[#B81A4D] transform scale-125"
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>

            <label className="block text-xl text-[#DB1A5A] mb-2">
              Relationship Type:
            </label>
            <div className="space-y-4 mb-6">
              {["LongTerm", "ShortTerm", "Living"].map((type) => (
                <label
                  key={type}
                  className="flex items-center text-gray-300 font-bold"
                >
                  <input
                    type="radio"
                    value={type}
                    checked={relationshipType === type}
                    onChange={handleRelationshipTypeChange}
                    className="mr-4 accent-[#DB1A5A] transform scale-125"
                  />
                  {type}
                </label>
              ))}
            </div>

            <label className="block text-xl text-[#DB1A5A] font-semibold mb-3">
              Looking For:
            </label>
            <select
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="w-full p-3 text-white font-bold bg-[#61132e] bg-opacity-30 border border-pink-500 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-[#DB1A5A] hover:bg-opacity-40 transition-all duration-200 ease-in-out shadow-lg shadow-[#DB1A5A]/30 custom-select"
            >
              <option value="" className="text-white">
                Select Gender Preference
              </option>
              <option value="male" className="text-gray-800">
                Male
              </option>
              <option value="female" className="text-gray-800">
                Female
              </option>
              <option value="other" className="text-gray-800">
                Other
              </option>
            </select>

            <label className="block text-xl text-[#DB1A5A] font-semibold mb-3">
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full p-3 text-white font-bold bg-[#61132e] bg-opacity-30 border border-pink-500 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-[#DB1A5A] hover:bg-opacity-40 transition-all duration-200 ease-in-out shadow-lg shadow-[#DB1A5A]/30"
            />

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-[#DB1A5A] py-2 px-4 hover:bg-[#B81A4D] rounded-lg transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block text-2xl font-semibold mb-4">
              Select Your Interests:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {availableInterests.map((interest) => (
                <label key={interest} className="flex items-center text-gray-300 font-medium">
                  <input
                    type="checkbox"
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="mr-3 accent-[#DB1A5A] transform scale-150 cursor-pointer transition-colors duration-300 ease-in-out"
                  />
                  {interest}
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#DB1A5A] py-2 hover:bg-[#B81A4D]  px-4 rounded-lg transition"
              >
                Finish
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function ProtectedUserDetailsPage() {
  return (
    <ProtectedRoute>
      <UserDetailsPage />
    </ProtectedRoute>
  );
}
