"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
interface CardData {
  id: number;
  username: string;
  gender: string;
  description: string;
  bio: string;
  profilePic: string;
  interests: string[];
  location: string;
  lookingFor: string[];
  relationshipType: string;
}

function SwipeCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch the user data using axios
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId=localStorage.getItem('userId');
        const response = await axios.post('http://localhost:5173/api/sendUser',{userId:userId});
        console.log(response)
        setCards(response.data as CardData[]); // Assert response.data as CardData[]
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleSwipe = (id: number) => {
    // Remove the swiped card from the list
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid h-screen w-full place-items-center bg-zinc-900 overflow-hidden">
      {cards.map((card) => (
        <Card key={card.id} card={card} onSwipe={handleSwipe} />
      ))}
    </div>
  );
}

export default SwipeCards;

// const cardData: CardData[] = [
//   { 
//     id: 1, 
//     firstName: "John", 
//     lastName: "Doe", 
//     gender: "Male", 
//     description: "A passionate developer.", 
//     bio: "John has been coding for over 10 years, working with multiple startups.", 
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPRv-1_yoVy18Aki4wzA4FZ9v9VY-Ddr_UOw&s", 
//     interests: ["Coding", "Gaming", "Music", "Traveling", "Photography"],
//     location: "San Francisco, CA",
//     lookingFor: ["Creative individuals", "Tech enthusiasts"],
//     relationshipType: "Long-term" // New field
//   },
//   { 
//     id: 2, 
//     firstName: "Jane", 
//     lastName: "Smith", 
//     gender: "Female", 
//     description: "A creative designer.", 
//     bio: "Jane specializes in UX/UI design and has a keen eye for detail.", 
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvVFvvUuAm58l28erbR3XBHFMY5g1WN6s3uw&sg", 
//     interests: ["Design", "Art", "Fashion", "Travel", "Reading"],
//     location: "New York, NY",
//     lookingFor: ["Artists", "Innovative thinkers"],
//     relationshipType: "Short-term" // New field
//   },
//   { 
//     id: 3, 
//     firstName: "Lisa", 
//     lastName: "Watson", 
//     gender: "Non-binary", 
//     description: "A skilled project manager.", 
//     bio: "Lisa Watson large-scale projects and is an expert in Agile methodologies.", 
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT03NgdF9L0GIRhUQriHTDoJt888Zte9DhNTA&s", 
//     interests: ["Project Management", "Agile", "Team Building", "Leadership", "Public Speaking"],
//     location: "Chicago, IL",
//     lookingFor: ["Leaders", "Organized individuals"],
//     relationshipType: "Long-term" // New field
//   },
//   { 
//     id: 4, 
//     firstName: "Lisa", 
//     lastName: "Taylor", 
//     gender: "Female", 
//     description: "An experienced marketer.", 
//     bio: "Lisa has over 15 years of experience in digital marketing.", 
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAViD9eGy7S_CYgzTzKR2A0SL_SQ-rQ2kpuw&s", 
//     interests: ["Marketing", "SEO", "Content Creation", "Social Media", "Networking"],
//     location: "Austin, TX",
//     lookingFor: ["Creative marketers", "Entrepreneurs"],
//     relationshipType: "Short-term" // New field
//   },
//   { 
//     id: 5, 
//     firstName: "Mike", 
//     lastName: "Johnson", 
//     gender: "Male", 
//     description: "A data analyst with a knack for insights.", 
//     bio: "Mike uses data to help businesses make informed decisions.", 
//     imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMEO19ulu-z24tMwNq6Xwl7WjEqqwPfAYH7A&s", 
//     interests: ["Data Analysis", "Statistics", "Machine Learning", "Research", "Business Intelligence"],
//     location: "Seattle, WA",
//     lookingFor: ["Analytical thinkers", "Problem solvers"],
//     relationshipType: "Long-term" // New field
//   }
// ];
