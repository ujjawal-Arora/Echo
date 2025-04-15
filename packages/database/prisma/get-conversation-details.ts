import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getConversationDetails() {
  try {
    // Get all conversations with participants and messages
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          include: {
            user: true
          }
        },
        messages: {
          include: {
            sender: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    console.log('Conversation Details:');
    console.log('====================');

    conversations.forEach((conversation, index) => {
      console.log(`\nConversation ${index + 1}:`);
      console.log('Participants:');
      conversation.participants.forEach(participant => {
        console.log(`- ${participant.user.username} (${participant.user.email})`);
      });

      console.log('\nMessages:');
      if (conversation.messages.length === 0) {
        console.log('No messages in this conversation');
      } else {
        conversation.messages.forEach(message => {
          console.log(`[${message.createdAt.toLocaleString()}] ${message.sender.username}: ${message.body}`);
        });
      }
      console.log('--------------------');
    });

    // Print some statistics
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const uniqueUsers = new Set();
    conversations.forEach(conv => {
      conv.participants.forEach(participant => {
        uniqueUsers.add(participant.user.id);
      });
    });

    console.log('\nStatistics:');
    console.log(`Total conversations: ${conversations.length}`);
    console.log(`Total messages: ${totalMessages}`);
    console.log(`Total unique users: ${uniqueUsers.size}`);
    console.log(`Average messages per conversation: ${(totalMessages / conversations.length).toFixed(2)}`);

  } catch (error) {
    console.error('Error fetching conversation details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getConversationDetails(); 