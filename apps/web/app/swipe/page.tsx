"use client";
import React, { useState } from "react";
import Card from "./Card";

// Define the type for card data

interface CardData {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  description: string;
  bio:string,
  imageUrl: string
  interests:string[],
  location: string
  lookingFor: string[];
  relationshipType: string;
}

function SwipeCards() {
  // Initialize card data with the predefined data
  const [cards, setCards] = useState<CardData[]>(cardData);

  const handleSwipe = (id: number) => {
    // Remove the swiped card from the list
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <div className="grid h-screen w-full place-items-center bg-zinc-900 overflow-hidden"
    // style={{
    //   backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    // }}
    >
      
      {cards.map((card) => (
        <Card  key={card.id}
          card={card}
          onSwipe={handleSwipe}/>
      ))}
    </div>
  );
}

export default SwipeCards;const cardData: CardData[] = [
  { 
    id: 1, 
    firstName: "John", 
    lastName: "Doe", 
    gender: "Male", 
    description: "A passionate developer.", 
    bio: "John has been coding for over 10 years, working with multiple startups.", 
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPRv-1_yoVy18Aki4wzA4FZ9v9VY-Ddr_UOw&s", 
    interests: ["Coding", "Gaming", "Music", "Traveling", "Photography"],
    location: "San Francisco, CA",
    lookingFor: ["Creative individuals", "Tech enthusiasts"],
    relationshipType: "Long-term" // New field
  },
  { 
    id: 2, 
    firstName: "Jane", 
    lastName: "Smith", 
    gender: "Female", 
    description: "A creative designer.", 
    bio: "Jane specializes in UX/UI design and has a keen eye for detail.", 
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvVFvvUuAm58l28erbR3XBHFMY5g1WN6s3uw&sg", 
    interests: ["Design", "Art", "Fashion", "Travel", "Reading"],
    location: "New York, NY",
    lookingFor: ["Artists", "Innovative thinkers"],
    relationshipType: "Short-term" // New field
  },
  { 
    id: 3, 
    firstName: "Lisa", 
    lastName: "Watson", 
    gender: "Non-binary", 
    description: "A skilled project manager.", 
    bio: "Lisa Watson large-scale projects and is an expert in Agile methodologies.", 
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT03NgdF9L0GIRhUQriHTDoJt888Zte9DhNTA&s", 
    interests: ["Project Management", "Agile", "Team Building", "Leadership", "Public Speaking"],
    location: "Chicago, IL",
    lookingFor: ["Leaders", "Organized individuals"],
    relationshipType: "Long-term" // New field
  },
  { 
    id: 4, 
    firstName: "Lisa", 
    lastName: "Taylor", 
    gender: "Female", 
    description: "An experienced marketer.", 
    bio: "Lisa has over 15 years of experience in digital marketing.", 
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAViD9eGy7S_CYgzTzKR2A0SL_SQ-rQ2kpuw&s", 
    interests: ["Marketing", "SEO", "Content Creation", "Social Media", "Networking"],
    location: "Austin, TX",
    lookingFor: ["Creative marketers", "Entrepreneurs"],
    relationshipType: "Short-term" // New field
  },
  { 
    id: 5, 
    firstName: "Mike", 
    lastName: "Johnson", 
    gender: "Male", 
    description: "A data analyst with a knack for insights.", 
    bio: "Mike uses data to help businesses make informed decisions.", 
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMEO19ulu-z24tMwNq6Xwl7WjEqqwPfAYH7A&s", 
    interests: ["Data Analysis", "Statistics", "Machine Learning", "Research", "Business Intelligence"],
    location: "Seattle, WA",
    lookingFor: ["Analytical thinkers", "Problem solvers"],
    relationshipType: "Long-term" // New field
  }
];
