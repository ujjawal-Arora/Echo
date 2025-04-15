import { PrismaClient, Gender, relationType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create random users
  const userCount = 10;
  const users = [];

  for (let i = 0; i < userCount; i++) {
    const gender = faker.helpers.arrayElement(['male', 'female', 'other']) as Gender;
    const relationshipType = faker.helpers.arrayElement(['LongTerm', 'ShortTerm', 'Living']) as relationType;
    
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        bio: faker.lorem.paragraph(),
        gender: gender,
        profilePic: faker.image.avatar(),
        interests: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
          faker.helpers.arrayElement(['Reading', 'Gaming', 'Music', 'Sports', 'Travel', 'Cooking', 'Art', 'Technology'])
        ),
        location: faker.location.city(),
        lookingFor: faker.helpers.arrayElement(['Friendship', 'Dating', 'Networking']),
        Accepted: faker.datatype.boolean(),
        RelationShipType: relationshipType,
        requests: [],
        sentRequests: [],
      },
    });
    
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // Create conversations and messages
  for (let i = 0; i < 5; i++) {
    // Randomly select 2-4 users for each conversation
    const participantCount = faker.number.int({ min: 2, max: 4 });
    const conversationParticipants = faker.helpers.arrayElements(users, participantCount);
    
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: conversationParticipants.map(user => ({
            userId: user.id,
          })),
        },
      },
    });
    
    console.log(`Created conversation with ${participantCount} participants`);
    
    // Add messages to the conversation
    const messageCount = faker.number.int({ min: 5, max: 15 });
    
    for (let j = 0; j < messageCount; j++) {
      const sender = faker.helpers.arrayElement(conversationParticipants);
      if (!sender) continue;
      
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: sender.id,
          body: faker.lorem.sentence(),
        },
      });
    }
    
    console.log(`Added ${messageCount} messages to conversation`);
  }

  // Create friendships
  for (let i = 0; i < 15; i++) {
    const selectedUsers = faker.helpers.arrayElements(users, 2);
    if (selectedUsers.length < 2) continue;
    
    const sender = selectedUsers[0];
    const receiver = selectedUsers[1];
    
    if (!sender || !receiver) continue;
    
    try {
      await prisma.friendship.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          accepted: faker.datatype.boolean(),
        },
      });
      
      console.log(`Created friendship between ${sender.username} and ${receiver.username}`);
    } catch (error) {
      console.log(`Skipping duplicate friendship between ${sender.username} and ${receiver.username}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 