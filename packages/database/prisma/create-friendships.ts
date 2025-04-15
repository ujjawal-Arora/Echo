import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAcceptedFriendships() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      }
    });

    if (users.length < 2) {
      console.log('Need at least 2 users to create friendships');
      return;
    }

    console.log(`Found ${users.length} users`);

    // Create some accepted friendships
    const friendshipsToCreate = [
      // Create 5 accepted friendships
      { sender: users[0], receiver: users[1] },
      { sender: users[1], receiver: users[2] },
      { sender: users[2], receiver: users[3] },
      { sender: users[3], receiver: users[4] },
      { sender: users[4], receiver: users[0] },
    ];

    for (const friendship of friendshipsToCreate) {
      if (!friendship.sender || !friendship.receiver) continue;

      try {
        await prisma.friendship.create({
          data: {
            senderId: friendship.sender.id,
            receiverId: friendship.receiver.id,
            accepted: true,
          },
        });
        console.log(`Created accepted friendship between ${friendship.sender.username} and ${friendship.receiver.username}`);
      } catch (error) {
        console.log(`Friendship already exists between ${friendship.sender.username} and ${friendship.receiver.username}`);
      }
    }

    // Verify the friendships were created
    const friendships = await prisma.friendship.findMany({
      where: {
        accepted: true,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    console.log('\nCreated friendships:');
    console.log('-------------------');
    friendships.forEach((friendship, index) => {
      console.log(`${index + 1}. ${friendship.sender.username} <-> ${friendship.receiver.username}`);
    });

  } catch (error) {
    console.error('Error creating friendships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAcceptedFriendships(); 