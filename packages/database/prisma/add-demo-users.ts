import { PrismaClient, Gender, relationType } from '@prisma/client';

const prisma = new PrismaClient();

async function addDemoUsers() {
  try {
    console.log('Adding demo users to the database...');

    // Male users
    const maleUsers = [
      {
        username: 'alex_smith',
        password: 'password123',
        email: 'alex.smith@example.com',
        bio: 'Adventure seeker and photography enthusiast. Love hiking and exploring new places.',
        gender: Gender.male,
        profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
        interests: ['Hiking', 'Photography', 'Travel', 'Cooking'],
        location: 'New York, NY',
        lookingFor: 'Long-term relationship',
        RelationShipType: relationType.LongTerm,
      },
      {
        username: 'michael_jones',
        password: 'password123',
        email: 'michael.jones@example.com',
        bio: 'Tech entrepreneur with a passion for innovation. Enjoy reading and playing chess.',
        gender: Gender.male,
        profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
        interests: ['Technology', 'Chess', 'Reading', 'Fitness'],
        location: 'San Francisco, CA',
        lookingFor: 'Meaningful connections',
        RelationShipType: relationType.LongTerm,
      },
      {
        username: 'david_wilson',
        password: 'password123',
        email: 'david.wilson@example.com',
        bio: 'Music producer and guitarist. Looking for someone who shares my passion for music and art.',
        gender: Gender.male,
        profilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
        interests: ['Music', 'Art', 'Guitar', 'Concerts'],
        location: 'Los Angeles, CA',
        lookingFor: 'Creative soulmate',
        RelationShipType: relationType.LongTerm,
      },
    ];

    // Female users
    const femaleUsers = [
      {
        username: 'sarah_johnson',
        password: 'password123',
        email: 'sarah.johnson@example.com',
        bio: 'Yoga instructor and wellness coach. Passionate about healthy living and mindfulness.',
        gender: Gender.female,
        profilePic: 'https://randomuser.me/api/portraits/women/22.jpg',
        interests: ['Yoga', 'Wellness', 'Meditation', 'Healthy Cooking'],
        location: 'Portland, OR',
        lookingFor: 'Like-minded partner',
        RelationShipType: relationType.LongTerm,
      },
      {
        username: 'emma_davis',
        password: 'password123',
        email: 'emma.davis@example.com',
        bio: 'Art teacher and painter. Love exploring museums and creating art in my free time.',
        gender: Gender.female,
        profilePic: 'https://randomuser.me/api/portraits/women/33.jpg',
        interests: ['Art', 'Painting', 'Museums', 'Travel'],
        location: 'Chicago, IL',
        lookingFor: 'Creative connection',
        RelationShipType: relationType.LongTerm,
      },
      {
        username: 'olivia_brown',
        password: 'password123',
        email: 'olivia.brown@example.com',
        bio: 'Marketing professional with a love for fashion and design. Enjoy attending cultural events.',
        gender: Gender.female,
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
        interests: ['Fashion', 'Design', 'Marketing', 'Cultural Events'],
        location: 'Miami, FL',
        lookingFor: 'Sophisticated partner',
        RelationShipType: relationType.LongTerm,
      },
    ];

    // Add male users
    for (const user of maleUsers) {
      try {
        const createdUser = await prisma.user.create({
          data: user,
        });
        console.log(`Created male user: ${createdUser.username}`);
      } catch (error) {
        console.log(`Error creating user ${user.username}: ${error}`);
      }
    }

    // Add female users
    for (const user of femaleUsers) {
      try {
        const createdUser = await prisma.user.create({
          data: user,
        });
        console.log(`Created female user: ${createdUser.username}`);
      } catch (error) {
        console.log(`Error creating user ${user.username}: ${error}`);
      }
    }

    console.log('Demo users added successfully!');
  } catch (error) {
    console.error('Error adding demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDemoUsers(); 