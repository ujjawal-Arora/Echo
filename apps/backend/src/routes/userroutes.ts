import express, { Request, Response } from 'express';
import { client } from '@repo/database/client'
import jwt ,{JwtPayload} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET||"ujjawal";
import { signUpvalidations, signInvalidations,userDetailsValidation } from '../validations/validations';

const router = express.Router();

// router.post("/signup", async (req: Request, res: any) => {
//     const validation = signUpvalidations.safeParse(req.body);

//     if (!validation.success) {
//         return res.status(400).json({ message: "Failed to sign up", errors: validation.error });
//     }

//     const { username, password, email } = validation.data;

//     try {
//         const newUser = await client.user.create({
//             data: {
//                 username,
//                 password,
//                 email,
               
//             },
//         });
//         const token = jwt.sign(
//             {
//                 id: newUser.id,        
//                 email: newUser.email, 
//             },
//             JWT_SECRET,
//             { expiresIn: "1h" }  
//         );

//         return res.status(201).json({ message: "User created successfully", user: newUser,token });
//     } catch (error) {
//         console.error("Error signing up:", error);
//         return res.status(500).json({ message: "Error creating user" });
//     }
// });
// router.post("/signin", async (req: Request, res: any) => {
  
//     console.log("password");
//     const validations = signInvalidations.safeParse(req.body);
    
//     if (!validations.success) {
//         return res.status(400).json({ message: "Failed to sign in", errors: validations.error });
//     }

//     const { email, password } = validations.data;

//     try {
//         const user = await client.user.findUnique({
//             where: {
//                 email: email,
//                 password: password
//             }
//         });

//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         const token = jwt.sign(
//             {
//                 id: user.id,        
//                 email: user.email, 
//             },
//             JWT_SECRET,
//             { expiresIn: "1h" }  
//         );
//         return res.json({
//             message: "Logged in successfully",
//             token,   
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         console.error("Error signing in:", error);
//         return res.status(500).json({ message: "Something went wrong", error });
//     }
// })


  

// router.post('/userdetails', async (req: Request, res: any) => {
//     const { token, ...userDetails } = req.body; // Extract token and user details from request body
//     console.log("token:", token);

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
//         const email = decoded.email;
//         console.log("email:", email);

//         if (!email) {
//             return res.status(400).json({ message: "Invalid token", errors: "Email not found in token" });
//         }
//         const validation = userDetailsValidation.safeParse(userDetails);
//         if (!validation.success) {
//             const formattedErrors = validation.error.errors.map((err) => ({
//                 path: err.path.join('.'),
//                 message: err.message,
//             }));
//             return res.status(400).json({ message: "Validation failed", errors: formattedErrors });
//         }

//         const { bio, gender, interests, profilePic, location, lookingFor, RelationShipType } = validation.data;
// +console.log("Interests:", interests);

//         const updatedUser = await client.user.update({
//             where: { email },
//             data: {
//                 bio,
//                 gender,
//                 interests,
//                 profilePic,
//                 location,
//                 lookingFor,
//                 RelationShipType,
//             },
//         });

//         return res.status(200).json({ message: "User details updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("Error updating user details:", error);

//         return res.status(500).json({ message: "Internal server error" });
//     }
// });

//   router.post('/userdetails', async (req: Request, res: any) => {
//     const { email } = req.body; 
//     const validation = userDetailsValidation.safeParse(req.body);
//   console.log(email,validation)
//     if (!validation.success) {
//       return res.status(400).json({ message: "Validation failed", errors: validation.error });
//     }
  
//     const { bio, gender, interests, profilePic } = validation.data;
  
//     try {
//       const updatedUser = await client.user.update({
//         where: { email },
//         data: {
//           bio,
//           gender,
//           interests,
//           profilePic,
//         },
//       });
  
//       return res.status(200).json({ message: "User details updated successfully", user: updatedUser });
//     } catch (error) {
//       console.error("Error updating user details:", error);
//       return res.status(500).json({ message: "Error updating user details" });
//     }
//   });

// router.delete('/deleteMessage/:id',async(req:Request,res:any)=>{
//     try {
//         const response=await client.message.delete({
//             where:{
//                 id:req.params.id
//             }
//         })
//         console.log(response);
//         return res.status(200).json(response)
//     } catch (error) {
//         return res.status(400).send("Error occurred")
//     }
// })

// router.get('/getallconversations/:id', async (req: express.Request, res: any) => {
//     try {
//         const conversations = await client.conversation.findMany({
//             where: {
//                 participants: {
//                     some: {
//                         userId: req.params.id 
//                     }
//                 }
//             },
//             include: {
//                 participants: {
//                     select: {
//                         userId: true,
//                         conversationId:true
//                     }
//                 }
//             }
//         });

//         if (!conversations.length) {
//             return res.status(404).json({ message: "No conversations found for this user" });
//         }

//         const userConvoMap:any = {};

//         conversations.forEach(conversation => {
//             conversation.participants.forEach(participant => {
//                 if (participant.userId !== req.params.id) { // Exclude current user
//                     if (!userConvoMap[participant.userId]) {
//                         userConvoMap[participant.userId] = [];
//                     }
//                     userConvoMap[participant.userId].push(participant.conversationId);
//                 }
//             });
//         });

//         const uniqueUserIds = Object.keys(userConvoMap);

//         const uniqueUsers = await client.user.findMany({
//             where: {
//                 id: {
//                     in: uniqueUserIds
//                 }
//             }
//         });

//         const response = uniqueUsers.map(user => ({
//             ...user,
//             conversationIds: userConvoMap[user.id] || [] 
//         }));

//         return res.json(response);
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         return res.status(500).json({ message: "Error fetching user data" });
//     }
// });
// router.get('/getmessages/:id', async (req: Request, res: any) => {
//     try {
//         let messages = await client.message.findMany({
//             where: {
//                 conversationId: req.params.id, 
//             }
//         });
//         const primarymessage={
//             id:'1',
//             conversationId:'1',
//             senderId:'1',
//             body:'Messages are end-to-end encrypted, No one outside of this chat can read them',
//             createdAt:new Date(),
//             updatedAt:new Date()
//         }
//         messages=[primarymessage,...messages]
//         return res.json(messages);
//     } catch (error) {
//         console.error(error); 
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });

// router.post("/addconvp",async(req:any,res:any)=>{
//     const {conversationId,senderId,body}=req.body;
//     console.log(conversationId,senderId,body);
//     try{
//         const userExists = await client.user.findUnique({
//             where: { id: senderId }
//         });
//         if (!userExists) {
//             return res.status(400).json({ message: "Invalid senderId" });
//         }

//         const message = await client.message.create({
//             data: {
//                 conversationId,
//                 senderId,
//                 body
//             },
//         });
//           return res.status(201).json({"msg":"Success","message":message});
//     }
//     catch(error){
//         return res.status(error).json({ message:error})
//     }
// })
// router.post('/linkusers', async (req: Request, res: any) => {
//     const { userId1, userId2 } = req.body;
//     console.log(userId1,userId2);
//     if (!userId1 || !userId2) {
//         return res.status(400).json({ message: "Both userId1 and userId2 are required" });
//     }

//     try {
//         // Check if a conversation already exists between these two users
//         const existingConversation = await client.conversation.findFirst({
//             where: {
//                 participants: {
//                     every: {
//                         OR: [
//                             { userId: userId1 },
//                             { userId: userId2 }
//                         ]
//                     }
//                 }
//             },
//             include: { participants: true }
//         });

//         let conversation;
//         if (existingConversation) {
//             // If a conversation already exists, use it
//             conversation = existingConversation;
//         } else {
//             // Otherwise, create a new conversation
//             conversation = await client.conversation.create({
//                 data: {
//                     participants: {
//                         create: [
//                             { userId: userId1 },
//                             { userId: userId2 }
//                         ]
//                     }
//                 },
//                 include: { participants: true }
//             });
//         }

//         return res.status(200).json({
//             message: "Conversation linked successfully",
//             conversationId: conversation.id,
//             participants: conversation.participants
//         });

//     } catch (error) {
//         console.error("Error linking users to conversation:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });
// Add senderId to the recipient's requests array if not already present


//   router.post("/sendreq",async(req:any,res:any)=>{
//     const { recieverId,senderId } = req.body;
              
  
//     await client.user.update({
//       where: { id: recieverId },
//       data: {
//         requests: { push: senderId }
//       }
//     });
//     res.status(200).json({ message: "Request sent successfully" });
// })
// router.post("/sendUser", async (req: any, res: any) => {
//     try {
//       const { userId } = req.body;
  
//       const user = await client.user.findUnique({
//         where: { id: userId },
//         select: { lookingFor: true, gender: true },
//       });
  
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       const genderToMatch = user.lookingFor as "male" | "female" | "other";
  
//       const users = await client.user.findMany({
//         where: {
//           gender: genderToMatch, 
//           id: { not: userId },  
//         },
//         select: {
//           id: true,
//           username: true,
//           email: true,
//           bio: true,
//           profilePic: true,
//           interests: true,
//           location: true,
//           lookingFor: true,
//           RelationShipType: true,
//         },
//         take: 10, // Limit to 10 users
//       });
  
//       res.status(200).json(users);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }

//   });
//   router.post('/requestdata', async (req: any, res: any) => {
//     try {
//       const { userId } = req.body;
  
//       if (!userId) {
//         return res.status(400).json({ error: 'User ID is missing' });
//       }
  
//       const user = await client.user.findUnique({
//         where: { id: userId },
//         select: { requests: true },
//       });
      
  
//       if (!user || !user.requests || user.requests.length === 0) {
//         return res.status(404).json({ error: 'User not found or no requests available' });
//       }
  
//       const requestedUsers = await client.user.findMany({
//         where: {
//           id: { in: user.requests },
//         },
//         select: {
//           id: true,
//           username: true,
//           bio: true,
//           gender: true,
//           profilePic: true,
//           interests: true,
//           location: true,
//           lookingFor: true,
//           RelationShipType: true,
//         },
//       });
  
      
//       res.json( requestedUsers );
//     } catch (error) {
//       console.error("Error in fetching request data:", error);
//       res.status(500).json({ error: 'An error occurred while fetching request data' });
//     }
//   });
  
//   router.post('/deleteReq', async (req: Request, res: any) => {
//     const { reqComeId, userId, accepted } = req.body;
//     console.log("req id that come ",reqComeId);
  
//     if (!reqComeId || !userId) {
//       return res.status(400).json({ error: "Request ID and User ID are required" });
//     }
  
//     try {
//       const user = await client.user.findUnique({
//         where: { id: userId },
//         select: { requests: true },
//       });
  
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       const updatedRequests = user.requests.filter((requestId: string) => requestId !== reqComeId);
  
//       const updatedUser = await client.user.update({
//         where: { id: userId },
//         data: {
//           Accepted: accepted,           
//           requests: updatedRequests,       
//         },
//       });
  
//     res.status(200).json({
//         message: `Request ${accepted ? "accepted" : "deleted"}`,
//         Accepted:accepted
//       });
//     } catch (error) {
//       console.error("Error handling request:", error);
//       res.status(500).json({ error: "Failed to handle request" });
//     }
//   });
  
// export default router;
