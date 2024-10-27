import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface CardProps {
  card: {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    description: string;
    bio: string;
    imageUrl: string;
  };
  onSwipe: (id: number) => void;
}

const Card = ({ card, onSwipe }: CardProps) => {
  const [boxShadow, setBoxShadow] = useState("0px 10px 30px rgba(0, 0, 0, 0.2)");
  const [showSticker, setShowSticker] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { offsetX, target } = event.nativeEvent;
    const cardWidth = (target as HTMLDivElement).offsetWidth;

    if (offsetX < cardWidth / 2) {
      setBoxShadow("0px 10px 30px rgba(255, 0, 0, 0.5)");
      setShowSticker("like");
    } else {
      setBoxShadow("0px 10px 30px rgba(0, 255, 0, 0.5)");
      setShowSticker("dislike");
    }
  };

  const handleMouseLeave = () => {
    setBoxShadow("0px 10px 30px rgba(0, 0, 0, 0.2)");
    setShowSticker("");
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe(card.id); // Right swipe
    } else if (info.offset.x < -100) {
      onSwipe(card.id); // Left swipe
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center h-screen gap-11">
        {/* Card */}
        <motion.div
          className="relative justify-between bg-blue-900 z-50 items-center text-white h-[80vh] w-[50vh] rounded-2xl p-6 text-center border border-gray-700 shadow-xl"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            x, // Dragging motion
            rotate, // Card rotation
            opacity, // Card opacity fade
            boxShadow, // Apply dynamic box shadow
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 flex flex-col justify-between items-center h-full w-full">
            {showSticker === "like" && (
              <div className="absolute top-2 left-2 flex items-center justify-center w-16 h-16 rounded-full">
                {/* <span className="text-white text-lg">💔</span> */}
              </div>
            )}
            {showSticker === "dislike" && (
              <div className="absolute top-2 right-2 flex items-center justify-center w-16 h-16 rounded-full">
                {/* <span className="text-white text-lg">❤️</span> */}
              </div>
            )}

            {/* Bottom Content */}
            <div className="bg-black bg-opacity-60 w-full py-4 rounded-lg text-left px-6 mt-auto">
              <div className="text-xl font-bold">{`${card.firstName} ${card.lastName}`}</div>
              <div className="text-sm text-gray-300">{card.gender}</div>
              <div className="mt-2 text-gray-400 text-sm flex items-center">
                <span className="truncate">{card.bio}</span>
                <button
                  className="ml-2 text-sm text-red-600 hover:text-red-400 font-semibold whitespace-nowrap"
                  onClick={() => setShowPopup(true)} // Open side panel
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popup Panel */}
        {showPopup && (
          <motion.div
            className="relative bg-white w-[60vh] h-[70vh] p-6 shadow-lg rounded-lg border border-gray-300 flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">More Information</h2>
            <p className="text-gray-700 mb-6">{card.description}</p>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setShowPopup(false)} // Close the popup
            >
              Close
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Card;
// import React, { useState } from "react";
// import { motion, useMotionValue, useTransform } from "framer-motion";

// interface CardProps {
//   card: {
//     id: number;
//     firstName: string;
//     lastName: string;
//     gender: string;
//     description: string;
//     bio: string;
//     imageUrl: string; 
//   };
//   onSwipe: (id: number) => void;
// }

// const Card = ({ card, onSwipe }: CardProps) => {
//   const [boxShadow, setBoxShadow] = useState("0px 10px 30px rgba(0, 0, 0, 0.2)"); 
//   const [showSticker, setShowSticker] = useState(""); 
//   const [showPopup, setShowPopup] = useState(false);
//   const x = useMotionValue(0);
//   const rotate = useTransform(x, [-150, 150], [-20, 20]);
//   const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

//   const handleMouseMove = (event: React.MouseEvent) => {
//     const { offsetX, target } = event.nativeEvent;
//     const cardWidth = (target as HTMLDivElement).offsetWidth;

//     if (offsetX < cardWidth / 2) {
//       setBoxShadow("0px 10px 30px rgba(255, 0, 0, 0.5)");
//       setShowSticker("like");
//     } else {
//       setBoxShadow("0px 10px 30px rgba(0, 255, 0, 0.5)");
//       setShowSticker("dislike");
//     }
//   };

//   const handleMouseLeave = () => {
//     setBoxShadow("0px 10px 30px rgba(0, 0, 0, 0.2)"); 
//     setShowSticker(""); 
//   };

//   const handleDragEnd = (event: any, info: any) => {
//     if (info.offset.x > 100) {
//       onSwipe(card.id); // Right swipe
//     } else if (info.offset.x < -100) {
//       onSwipe(card.id); // Left swipe
//     }
//   };

//   return (
//     <>
//           {/* <div className="  h-screen space-y-10"> */}

//           <motion.div
// className="absolute flex flex-col justify-between bg-blue-900 z-50 items-center text-white h-[80vh] w-[50vh] rounded-2xl p-6 text-center border border-gray-700 shadow-xl"
// drag="x"
// dragConstraints={{ left: 0, right: 0 }}
// onDragEnd={handleDragEnd}
// onMouseMove={handleMouseMove}
// onMouseLeave={handleMouseLeave}
// style={{
//   x,         // Dragging motion
//   rotate,    // Card rotation
//   opacity,   // Card opacity fade
//   boxShadow, // Apply dynamic box shadow
// }}
// >
// <div
//   className="absolute inset-0 rounded-2xl bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${card.imageUrl})`, 
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   }}
// />

// <div className="relative z-10 flex flex-col justify-between items-center h-full w-full">
//   {showSticker === "like" && (
//     <div className="absolute top-2 left-2 flex items-center justify-center w-16 h-16 rounded-full">
//       <span className="text-white text-lg">💔</span>
//     </div>
//   )}
//   {showSticker === "dislike" && (
//     <div className="absolute top-2 right-2 flex items-center justify-center w-16 h-16  rounded-full">
//       <span className="text-white text-lg">❤️</span>
//     </div>
//   )}

//   {/* Bottom Content */}
//   <div className="bg-black bg-opacity-60 w-full py-4 rounded-lg text-left px-6 mt-auto">
//     <div className="text-xl font-bold">{`${card.firstName} ${card.lastName}`}</div>
//     <div className="text-sm text-gray-300">{card.gender}</div>
//     <div className="mt-2 text-gray-400 text-sm flex items-center">
//       <span className="truncate">{card.bio}</span>
//       <button 
//         className="ml-2 text-sm text-red-600 hover:text-red-400 font-semibold whitespace-nowrap"
//         onClick={() => setShowPopup(true)} // Show modal on click
//       >
//         More
//       </button>
//     </div>
//   </div>
// </div>
// </motion.div>
//      {/* </div> */}

//       {/* Modal */}
//       {showPopup && (
//           <motion.div
//             className="relative bg-white w-[60vh] h-[70vh] p-6 shadow-lg rounded-lg border border-gray-300 flex flex-col justify-center"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ type: "tween", duration: 0.3 }}
//           >
//             <h2 className="text-xl font-bold mb-4">More Information</h2>
//             <p className="text-gray-700 mb-6">{card.description}</p>
//             <button
//               className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//               onClick={() => setShowPopup(false)} // Close the popup
//             >
//               Close
//             </button>
//           </motion.div>
//         )}
//     </>
//   );
// };

// export default Card;
