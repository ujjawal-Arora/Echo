"use client";
import { useState } from "react";
import uploadFile from "../Helper/upload";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserDetailsPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState("");
  const [relationshipType, setRelationshipType] = useState("");

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

  const handleSubmit = async () => {
    try {
      let profilePicUrl = "";
      if (profilePic) {
        const uploadedImage = await uploadFile(profilePic);
        profilePicUrl = uploadedImage.secure_url;
      }
      


  
      const userDetails = {
        token: localStorage.getItem("token"),
        profilePic: profilePicUrl,
        gender,
        bio,
        interests,
        lookingFor,
        relationshipType, 
      };
  
      const response = await axios.post("http://localhost:5173/api/userdetails", userDetails);
  
      if (response.status === 200) {
        console.log("User details saved successfully:", response.data);
        router.push("/");
      }
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
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
            <div className="flex  space-x-4  mb-6">
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
                    className="mr-4 accent-[#B81A4D] transform scale-125" // Custom pink color for the selected state
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>

            <label className="block text-xl  text-[#DB1A5A]  mb-2">
              Relationship Type:
            </label>
            <div className="space-y-4 mb-6">
              {["Long-term", "Short-term",  "Living"].map((type) => (
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
  className="w-full p-3 text-white font-bold bg-[#61132e] bg-opacity-30 border border-pink-500 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-[#DB1A5A] hover:bg-opacity-40 transition-all duration-200 ease-in-out shadow-lg shadow-[#DB1A5A]/30 custom-select"
>
  <option value="" className="text-white">
    Select Relationship Type
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

<style jsx>{`
  .custom-select option {
    background-color: #61132e; /* Tailwind's gray-800 */
    color: #ffffff;
  }
`}</style>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-600 py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-[#DB1A5A] py-2 px-4 hover:bg-[#B81A4D]  rounded-lg  transition"
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

export default UserDetailsPage;
