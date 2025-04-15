import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsersWithConversations() {
  try {
    // Get all conversations with their participants
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });

    console.log('Users with conversations:');
    console.log('------------------------');

    // Create a map to track unique users
    const uniqueUsers = new Map();

    // Process each conversation
    conversations.forEach((conversation, index) => {
      console.log(`\nConversation ${index + 1}:`);
      
      // Add each participant to the unique users map
      conversation.participants.forEach(participant => {
        const user = participant.user;
        uniqueUsers.set(user.id, user);
        
        console.log(`- ${user.username} (${user.email})`);
      });
    });

    console.log('\n------------------------');
    console.log(`Total unique users with conversations: ${uniqueUsers.size}`);
    
    // Display all unique users
    console.log('\nAll users with conversations:');
    uniqueUsers.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });

  } catch (error) {
    console.error('Error fetching users with conversations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsersWithConversations(); 