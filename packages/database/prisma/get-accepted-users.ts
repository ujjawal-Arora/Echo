import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAcceptedUsers(userId: string) {
  try {
    console.log(`Finding accepted users for user ID: ${userId}`);
    
    // First, let's get the user to verify it exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return;
    }
    
    console.log(`User found: ${user.username} (${user.email})`);
    
    // Get all accepted friendships for this user
    const friendships = await prisma.friendship.findMany({
      where: {
        accepted: true,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    
    console.log(`\nFound ${friendships.length} accepted friendships`);
    
    // Process the friendships to get the partners
    const partners = friendships.map((friendship) => {
      const isSender = friendship.senderId === userId;
      const partner = isSender ? friendship.receiver : friendship.sender;
      
      return {
        id: partner.id,
        username: partner.username,
        profilePic: partner.profilePic,
        bio: partner.bio,
        gender: partner.gender,
      };
    });
    
    // Display the partners
    console.log('\nAccepted users (chat partners):');
    console.log('--------------------------------');
    
    if (partners.length === 0) {
      console.log('No accepted users found');
    } else {
      partners.forEach((partner, index) => {
        console.log(`${index + 1}. ${partner.username} (${partner.id})`);
        console.log(`   Gender: ${partner.gender || 'Not specified'}`);
        console.log(`   Bio: ${partner.bio || 'No bio'}`);
        console.log(`   Profile Picture: ${partner.profilePic || 'No profile picture'}`);
        console.log('--------------------------------');
      });
    }
    
    return partners;
  } catch (error) {
    console.error('Error fetching accepted users:', error);
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
      },
      take: 10, // Limit to 10 users for display
    });
    
    console.log('Available users:');
    console.log('----------------');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ID: ${user.id}`);
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Main function to run the script
async function main() {
  // First get all users
  const users = await getAllUsers();
  
  if (users.length === 0) {
    console.log('No users found in the database');
    return;
  }
  
  // Use the first user as an example
  const firstUser = users[0];
  if (!firstUser) {
    console.log('No users available');
    return;
  }
  
  console.log(`\nUsing example user: ${firstUser.username} (${firstUser.email})`);
  
  // Get accepted users for this user
  await getAcceptedUsers(firstUser.id);
}

main(); 