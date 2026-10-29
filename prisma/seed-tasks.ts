import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed tasks...");

  // 1. Get or create a test client (user)
  let clientUser = await prisma.user.findFirst({
    where: { email: "client@evalia.com" }
  });

  if (!clientUser) {
    clientUser = await prisma.user.create({
      data: {
        email: "client@evalia.com",
        name: "Test Client Enterprise",
        role: "CLIENT",
        status: "ACTIVE",
      }
    });
  }

  let clientProfile = await prisma.client.findUnique({
    where: { userId: clientUser.id }
  });

  if (!clientProfile) {
    clientProfile = await prisma.client.create({
      data: {
        userId: clientUser.id,
        company: "Evalia Test Labs",
      }
    });
  }

  // 2. Create a Capability for the tasks
  const capability = await prisma.capability.upsert({
    where: { slug: "basic-ai-evaluation" },
    update: {},
    create: {
      name: "Basic AI Evaluation",
      slug: "basic-ai-evaluation",
      description: "General tasks for AI response evaluation.",
    }
  });

  // 3. Create a Project
  const project = await prisma.project.upsert({
    where: { slug: "general-ai-training-test" },
    update: {},
    create: {
      clientId: clientProfile.id,
      name: "General AI Training (Test)",
      slug: "general-ai-training-test",
      description: "A test project containing sample tasks for you to practice on.",
      category: "AI Evaluation",
      difficulty: "BEGINNER",
      status: "ACTIVE",
      ratePerHourCents: 1500, // $15.00/hr
      qualityThreshold: 80,
    }
  });

  // 4. Create the Tasks
  const task1 = await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Evaluate AI Sentiment Response",
      instructions: "Read the prompt and the AI's response. Determine if the sentiment was correctly identified.",
      content: {
        prompt: "I absolutely loved the new update, it's fantastic!",
        aiResponse: "The user is clearly angry about the update.",
        question: "Did the AI correctly identify the sentiment?"
      },
      difficulty: "BEGINNER",
      status: "AVAILABLE",
      ratePerHourCents: 1500,
      estimatedMinutes: 5,
      requirements: {
        create: {
          capabilityId: capability.id,
          minLevel: "BEGINNER",
        }
      }
    }
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Classify Text Category",
      instructions: "Read the text and classify it into one of the provided categories.",
      content: {
        text: "The stock market saw a massive rally today as tech companies reported record earnings.",
        categories: ["Sports", "Finance", "Technology", "Politics"]
      },
      difficulty: "BEGINNER",
      status: "AVAILABLE",
      ratePerHourCents: 1200,
      estimatedMinutes: 3,
      requirements: {
        create: {
          capabilityId: capability.id,
          minLevel: "BEGINNER",
        }
      }
    }
  });

  console.log(`✅ Created 2 tasks: ${task1.title}, ${task2.title}`);

  // 5. Assign this capability to your worker account so you can see the tasks!
  // Note: Change this email if your worker account uses a different one.
  const workerUser = await prisma.user.findFirst({
    where: { email: { contains: "evans" } } // Finds Evans Kibet
  });

  if (workerUser) {
    await prisma.userCapability.upsert({
      where: {
        userId_capabilityId: {
          userId: workerUser.id,
          capabilityId: capability.id,
        }
      },
      update: {},
      create: {
        userId: workerUser.id,
        capabilityId: capability.id,
        level: "BEGINNER",
        score: 85,
      }
    });
    console.log(`✅ Granted ${capability.name} capability to ${workerUser.name}`);
  } else {
    console.log("⚠️ Could not find your worker account to grant the capability.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });