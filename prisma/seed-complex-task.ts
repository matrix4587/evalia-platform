import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed complex task...");

  // 1. Get the test client & project from previous seed
  const project = await prisma.project.findFirst({
    where: { slug: "general-ai-training-test" }
  });

  if (!project) {
    console.error("Project not found. Please run the previous seed script first.");
    return;
  }

  // 2. Create the complex task with branching logic
  const task = await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Advanced Sentiment & Reasoning",
      instructions: "This is a two-part task. First, identify the sentiment of the text. Then, based on your answer, you will be asked a follow-up question.",
      difficulty: "INTERMEDIATE",
      status: "AVAILABLE",
      ratePerHourCents: 2500, // $25.00/hr
      estimatedMinutes: 8,
      content: {
        steps: [
          {
            id: "step1",
            question: "Analyze the sentiment of the following review: 'The product arrived broken, but customer service replaced it immediately.'",
            type: "radio",
            options: ["Positive", "Negative", "Mixed"],
          },
          {
            id: "step2_positive", // Shown if step 1 = Positive
            question: "Since you selected Positive, why is the sentiment ultimately positive?",
            type: "radio",
            options: ["The product was fixed quickly", "The initial product was great", "The company donated to charity"],
          },
          {
            id: "step2_negative", // Shown if step 1 = Negative
            question: "Since you selected Negative, what was the main issue?",
            type: "radio",
            options: ["The product broke", "The delivery was late", "The price was too high"],
          },
          {
            id: "step2_mixed", // Shown if step 1 = Mixed
            question: "Since you selected Mixed, which statement is true?",
            type: "radio",
            options: ["The product was bad, but the service was good", "The product was good, but the service was bad", "Both product and service were bad"],
          }
        ]
      }
    }
  });

  console.log(`✅ Created complex task: ${task.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });