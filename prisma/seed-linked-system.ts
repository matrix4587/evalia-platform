import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old test data...");
  await prisma.taskAssignment.deleteMany({});
  await prisma.taskSubmission.deleteMany({});
  await prisma.assessmentAttempt.deleteMany({});
  await prisma.userCapability.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.capability.deleteMany({});
  await prisma.project.deleteMany({ where: { slug: "test-project" } });

  console.log("Creating Capabilities...");
  const capSentiment = await prisma.capability.create({
    data: { name: "Sentiment Analysis", slug: "sentiment-analysis", description: "Detect sentiment." }
  });
  const capReasoning = await prisma.capability.create({
    data: { name: "General Reasoning", slug: "general-reasoning", description: "Logic and reasoning." }
  });

  console.log("Creating Assessments...");
  const assessSentiment = await prisma.assessment.create({
    data: {
      name: "Sentiment Analysis Basics",
      slug: "sentiment-analysis",
      description: "Pass this with 80% to unlock Sentiment tasks.",
      category: "NLP",
      difficulty: "BEGINNER",
      status: "PUBLISHED",
      passingScore: 80,
      rules: { create: { name: "Unlock Sentiment", capabilityId: capSentiment.id, targetLevel: "BEGINNER", conditions: {} } }
    }
  });

  const assessReasoning = await prisma.assessment.create({
    data: {
      name: "General Reasoning",
      slug: "general-reasoning",
      description: "Pass this with 80% to unlock Reasoning tasks.",
      category: "REASONING",
      difficulty: "BEGINNER",
      status: "PUBLISHED",
      passingScore: 80,
      rules: { create: { name: "Unlock Reasoning", capabilityId: capReasoning.id, targetLevel: "BEGINNER", conditions: {} } }
    }
  });

  console.log("Creating Questions & Options...");
  await prisma.question.create({
    data: {
      assessmentId: assessSentiment.id,
      type: "MULTIPLE_CHOICE",
      prompt: "I love this product!",
      correctAnswer: { value: "Positive" },
      points: 1,
      options: {
        create: [
          { label: "Positive", isCorrect: true },
          { label: "Negative", isCorrect: false },
          { label: "Neutral", isCorrect: false },
        ]
      }
    }
  });

  await prisma.question.create({
    data: {
      assessmentId: assessSentiment.id,
      type: "MULTIPLE_CHOICE",
      prompt: "This is the worst experience ever.",
      correctAnswer: { value: "Negative" },
      points: 1,
      options: {
        create: [
          { label: "Positive", isCorrect: false },
          { label: "Negative", isCorrect: true },
          { label: "Neutral", isCorrect: false },
        ]
      }
    }
  });

  await prisma.question.create({
    data: {
      assessmentId: assessReasoning.id,
      type: "MULTIPLE_CHOICE",
      prompt: "If all birds can fly, and penguins are birds, can penguins fly?",
      correctAnswer: { value: "Yes" },
      points: 1,
      options: {
        create: [
          { label: "Yes", isCorrect: true },
          { label: "No", isCorrect: false },
        ]
      }
    }
  });

  console.log("Creating Client User & Profile...");
  let clientUser = await prisma.user.findFirst({ where: { email: "client@evalia.com" } });
  if (!clientUser) {
    clientUser = await prisma.user.create({ 
      data: { 
        email: "client@evalia.com", 
        name: "Test Client", 
        role: "CLIENT", 
        status: "ACTIVE",
        clientProfile: {
          create: {
            company: "Test AI Labs"
          }
        }
      },
      include: { clientProfile: true }
    });
  } else {
    // Ensure they have a client profile if they already existed
    const existingProfile = await prisma.client.findUnique({ where: { userId: clientUser.id } });
    if (!existingProfile) {
       await prisma.client.create({ data: { userId: clientUser.id, company: "Test AI Labs" } });
    }
  }

  // Fetch the Client profile ID
  const clientProfile = await prisma.client.findUnique({ where: { userId: clientUser.id } });
  if (!clientProfile) throw new Error("Could not create client profile");

  console.log("Creating Project...");
  const project = await prisma.project.create({
    data: {
      clientId: clientProfile.id, // Use the Client profile ID, not the User ID
      name: "Test Projects", 
      slug: "test-project", 
      description: "Test project", 
      category: "NLP", 
      difficulty: "BEGINNER", 
      status: "ACTIVE", 
      ratePerHourCents: 2000,
    }
  });

  console.log("Creating Gated Tasks...");
  
  await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Evaluate Customer Review Sentiment",
      instructions: "Read the review and determine if it is positive or negative.",
      content: { text: "The delivery was fast, but the box was damaged." },
      difficulty: "BEGINNER",
      status: "AVAILABLE",
      ratePerHourCents: 2000,
      estimatedMinutes: 5,
      requirements: { create: { capabilityId: capSentiment.id, minLevel: "BEGINNER" } }
    }
  });

  await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Logic Puzzle Evaluation",
      instructions: "Assess the logical consistency of the provided AI response.",
      content: { text: "If all birds can fly, and penguins are birds, then penguins can fly." },
      difficulty: "BEGINNER",
      status: "AVAILABLE",
      ratePerHourCents: 2500,
      estimatedMinutes: 8,
      requirements: { create: { capabilityId: capReasoning.id, minLevel: "BEGINNER" } }
    }
  });

  console.log("✅ Database seeded successfully with 2 Assessments and 2 Linked Tasks!");
}

main().catch(console.error).finally(() => prisma.$disconnect());