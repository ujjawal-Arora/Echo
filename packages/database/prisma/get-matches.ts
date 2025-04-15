import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getMatches(userId: string) {
  try {
    // First get all friendships where this user is involved and accepted is true
    const friendships = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          },
          { accepted: true }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            bio: true,
            gender: true,
            profilePic: true,
            interests: true,
            lookingFor: true,
            RelationShipType: true,
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
            bio: true,
            gender: true,
            profilePic: true,
            interests: true,
            lookingFor: true,
            RelationShipType: true,
          }
        }
      }
    });

    // Get the current user's info
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        bio: true,
        gender: true,
        interests: true,
        lookingFor: true,
        RelationShipType: true,
      }
    });

    if (!currentUser) {
      console.log('User not found');
      return;
    }

    console.log(`\n💕 Matches for ${currentUser.username} 💕`);
    console.log('=================================');
    console.log('Your Profile:');
    console.log(`👤 Username: ${currentUser.username}`);
    console.log(`👥 Gender: ${currentUser.gender || 'Not specified'}`);
    console.log(`💝 Looking for: ${currentUser.lookingFor || 'Not specified'}`);
    console.log(`💑 Relationship Type: ${currentUser.RelationShipType || 'Not specified'}`);
    console.log(`🎯 Interests: ${currentUser.interests?.join(', ') || 'None specified'}`);
    console.log(`📝 Bio: ${currentUser.bio || 'No bio provided'}`);
    console.log('\n');

    if (friendships.length === 0) {
      console.log('💔 No matches found yet. Keep swiping! 💔');
      return;
    }

    console.log(`Found ${friendships.length} matches:`);
    console.log('------------------------');

    // Process matches
    friendships.forEach((friendship, index) => {
      const match = friendship.senderId === userId ? friendship.receiver : friendship.sender;
      
      console.log(`\n👤 Match #${index + 1}: ${match.username}`);
      console.log(`📧 Email: ${match.email}`);
      console.log(`👥 Gender: ${match.gender || 'Not specified'}`);
      console.log(`💝 Looking for: ${match.lookingFor || 'Not specified'}`);
      console.log(`💑 Relationship Type: ${match.RelationShipType || 'Not specified'}`);
      console.log(`🎯 Interests: ${match.interests?.join(', ') || 'None specified'}`);
      console.log(`📝 Bio: ${match.bio || 'No bio provided'}`);
      console.log('------------------------');
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get all users to choose from
async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        lookingFor: true,
        RelationShipType: true,
        _count: {
          select: {
            sentFriendRequests: true,
            receivedFriendRequests: true
          }
        }
      }
    });

    console.log('Available users to test with:');
    console.log('----------------------------');
    users.forEach((user, index) => {
      const totalConnections = user._count.sentFriendRequests + user._count.receivedFriendRequests;
      console.log(`${index + 1}. ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Looking for: ${user.lookingFor || 'Not specified'}`);
      console.log(`   Relationship Type: ${user.RelationShipType || 'Not specified'}`);
      console.log(`   Total connections: ${totalConnections}`);
      console.log('----------------------------');
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Main function to run the script
async function main() {
  const users = await getAllUsers();

  if (users.length === 0) {
    console.log('No users found in the database');
    return;
  }

  // Find Edna.Boehm95
  const targetUser = users.find(user => user.username === 'Edna.Boehm95');
  if (!targetUser) {
    console.log('Target user not found');
    return;
  }

  console.log(`\nShowing matches for user: ${targetUser.username}`);
  await getMatches(targetUser.id);
}

main(); 