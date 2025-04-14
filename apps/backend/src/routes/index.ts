import express, { Request, Response } from "express";

import { handleSignIn, handleSignUp } from "../RouteFunctions/authRoutes";
import { handleDeleteMessage, sendRequest,fetchRequestData, UserDetails,handleRequest,fetchUsers } from "../RouteFunctions/userRoutes";
import { getAllConversations, getMessages,addConversationMessage,linkUsersToConversation,getAcceptedUsers } from "../RouteFunctions/conversation";

const router = express.Router();


router.post("/signup", handleSignUp);
router.post("/signin", handleSignIn);
// getAcceptedUsers
router.get("/get-accepted/:id",getAcceptedUsers);

router.post("/userdetails",UserDetails);
router.delete("/deleteMessage/:id",handleDeleteMessage );

router.get("/getallconversations/:id",getAllConversations);
router.get("/getmessages/:id",getMessages);
router.post("/addconvp",addConversationMessage);
router.post("/linkusers",linkUsersToConversation);
router.post("/sendreq",sendRequest);
router.post("/sendUser",fetchUsers);
router.post("/requestdata",fetchRequestData);
router.post("/deleteReq",handleRequest);

export default router