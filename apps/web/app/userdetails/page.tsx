"use client";
import { useState } from 'react';
import uploadFile from '../Helper/upload'; 
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

const UserDetailsPage = () => {
  const router = useRouter(); 

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const availableInterests = [
    'Dancing', 'Cooking', 'Traveling', 'Reading', 'Movies', 'Music',
    'Sports', 'Art', 'Fashion', 'Gaming', 'Fitness', 'Photography',
    'Writing', 'Yoga', 'Adventure'
  ];

  const handleProfilePicChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    } else {
      setProfilePic(null);
    }
  };

  const handleGenderChange = (e:any) => {
    setGender(e.target.value);
  };

  const handleInterestChange = (interest: string) => {
    setInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let profilePicUrl = '';
      if (profilePic) {
        const uploadedImage = await uploadFile(profilePic);
        profilePicUrl = uploadedImage.secure_url; 
      }

      const userDetails = {
        email:localStorage.getItem('email'),
        profilePic: profilePicUrl,
        gender,
        bio,
        interests,
      };

      const response = await axios.post('http://localhost:5173/api/userdetails', userDetails);
      console.log('User details saved successfully:', response.data);
      if(response.status === 200) {
        router.push("/");
      }
      

    } catch (error) {
      console.error('Error uploading profile picture or saving user details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-red-900 text-white flex items-center justify-center p-8">
      <div className="bg-opacity-90 bg-transparent border shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Tell Us About Yourself</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-xl mb-2">Upload Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full p-2 text-black border bg-transparent rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xl mb-2">Write Your Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full p-3 h-28 text-gray-200 bg-transparent border rounded-md resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xl mb-2">Select Gender:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                  className="mr-2"
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="other"
                  checked={gender === 'other'}
                  onChange={handleGenderChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xl mb-2">Select Your Interests:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableInterests.map((interest) => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="mr-2"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-black via-black to-zinc-900 py-3 rounded-md font-semibold text-xl hover:from-zinc-900 hover:to-black transition duration-300"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsPage;
