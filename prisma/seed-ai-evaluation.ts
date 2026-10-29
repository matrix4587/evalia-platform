import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old AI Evaluation data...");
  await prisma.taskAssignment.deleteMany({ where: { task: { project: { slug: "ai-evaluation-project" } } } });
  await prisma.task.deleteMany({ where: { project: { slug: "ai-evaluation-project" } } });
  await prisma.project.deleteMany({ where: { slug: "ai-evaluation-project" } });
  await prisma.assessment.deleteMany({ where: { slug: "ai-response-evaluation-advanced" } });
  await prisma.capability.deleteMany({ where: { slug: "advanced-ai-eval" } });

  console.log("Creating Capability & Assessment...");

  const capability = await prisma.capability.create({
    data: {
      name: "Advanced AI Evaluation",
      slug: "advanced-ai-eval",
      description: "Expert ability to evaluate AI responses for facts, reasoning, and constraints.",
    }
  });

  const assessment = await prisma.assessment.create({
    data: {
      name: "AI Response Evaluation (Advanced)",
      slug: "ai-response-evaluation-advanced",
      description: "Pass this with 80% to unlock expert-level AI evaluation tasks.",
      category: "AI EVALUATION",
      difficulty: "EXPERT",
      status: "PUBLISHED",
      passingScore: 80,
      rules: { 
        create: { 
          name: "Unlock Advanced AI Eval", 
          capabilityId: capability.id, 
          targetLevel: "EXPERT", 
          conditions: { minScore: 80 } 
        } 
      }
    }
  });

  console.log("Adding 3 Advanced Evaluation Questions...");

  const questionsData = [
    {
      prompt: `Evaluate the following candidate response against the reference facts.
Reference facts: 1. Nairobi is the capital of Kenya. 2. Kenya uses the Kenyan shilling (KES). 3. The Pacific Ocean is the largest ocean.
Candidate response: "Mombasa is the capital of Kenya. Kenya uses the Tanzanian shilling. The Atlantic Ocean is the largest ocean."
Which evaluation is correct?`,
      options: [
        "Score: 1 - All 3 errors identified, valid JSON, accurate corrections provided.",
        "Score: 5 - Response sounds confident and authoritative.",
        "Score: 3 - Identified 1 error but missed the rest.",
        "Score: 2 - Incorrectly identified the Pacific Ocean as the largest."
      ],
      correctAnswer: "Score: 1 - All 3 errors identified, valid JSON, accurate corrections provided."
    },
    {
      prompt: `Evaluate the candidate's math and reasoning.
Problem: A shop buys 24 keyboards at KSh 1,250 each. Sells 18 at KSh 1,600 each.
Candidate response: "Total purchase = 24 * 1250 = 30,000. Revenue = 18 * 1600 = 28,800. Profit = 28,800 - 30,000 = -1,200 (Loss of 1,200)."
What is the correct verdict?`,
      options: [
        "Score: 2 - Candidate forgot to account for unsold inventory. Correct gross profit is KSh 6,300.",
        "Score: 5 - Candidate correctly calculated a loss of 1,200.",
        "Score: 4 - Candidate made a minor rounding error.",
        "Score: 1 - Candidate's arithmetic is entirely wrong."
      ],
      correctAnswer: "Score: 2 - Candidate forgot to account for unsold inventory. Correct gross profit is KSh 6,300."
    },
    {
      prompt: `Evaluate the candidate response against the user's constraints.
User request: "Write a support reply of 40-60 words. Apologize for delay, explain it is in transit, DO NOT promise a delivery date, offer tracking help."
Candidate response: "We apologize for the delay. Your shipment is in transit. We guarantee it will arrive tomorrow. Contact us if you need help."
What is the correct evaluation?`,
      options: [
        "Score: 3 - Candidate violated the 40-word minimum and promised a delivery date ('tomorrow').",
        "Score: 5 - Candidate was empathetic and professional.",
        "Score: 4 - Candidate met all constraints except word count.",
        "Score: 1 - Candidate offered to help track the shipment."
      ],
      correctAnswer: "Score: 3 - Candidate violated the 40-word minimum and promised a delivery date ('tomorrow')."
    }
  ];

  for (const q of questionsData) {
    await prisma.question.create({
      data: {
        assessmentId: assessment.id,
        type: "MULTIPLE_CHOICE",
        prompt: q.prompt,
        correctAnswer: { value: q.correctAnswer },
        points: 1,
        options: {
          create: q.options.map(opt => ({
            label: opt,
            isCorrect: opt === q.correctAnswer
          }))
        }
      }
    });
  }

  console.log("Creating Advanced Task with Steps...");

  let clientUser = await prisma.user.findFirst({ where: { email: "client@evalia.com" } });
  if (!clientUser) {
    clientUser = await prisma.user.create({ data: { email: "client@evalia.com", name: "Test Client", role: "CLIENT", status: "ACTIVE" } });
  }
  const clientProfile = await prisma.client.findUnique({ where: { userId: clientUser.id } }) || await prisma.client.create({ data: { userId: clientUser.id, company: "Test AI" } });

  const project = await prisma.project.create({
    data: {
      clientId: clientProfile.id, 
      name: "Advanced AI Evaluation", 
      slug: "ai-evaluation-project", 
      description: "Complex evaluation tasks.", 
      category: "AI EVALUATION", 
      difficulty: "EXPERT", 
      status: "ACTIVE", 
      ratePerHourCents: 5000, // $50/hr
    }
  });

  // THIS IS THE KEY: Creating a task with "steps" in the JSON content
  await prisma.task.create({
    data: {
      projectId: project.id,
      title: "Expert Evaluation of LLM Hallucinations",
      instructions: "Review the provided candidate response and perform a strict factual accuracy check.",
      content: { 
        steps: [
          {
            id: "step1",
            question: `Analyze this candidate response:\n\n"The Eiffel Tower was built in 1889 and is located in Berlin, Germany."\n\nWhat is the primary factual error?`,
            type: "radio",
            options: [
              "The Eiffel Tower is located in Paris, not Berlin.",
              "The Eiffel Tower was built in 1920, not 1889.",
              "There is no factual error in this response.",
              "The Eiffel Tower is in London."
            ]
          },
          {
            id: "step2_positive", // Branches based on step 1
            question: "Correct. Now, how should a professional AI evaluator score this response?",
            type: "radio",
            options: [
              "Score 1: Major hallucination on core entity (Location).",
              "Score 4: Minor error, the year is correct.",
              "Score 5: The response is confident.",
              "Score 3: It is partially correct."
            ]
          },
          {
            id: "step2_negative", // Branches based on step 1
            question: "Incorrect. The Eiffel Tower is in Paris. Given this, what is the severity of the error?",
            type: "radio",
            options: [
              "Severe (Hallucination)",
              "Minor",
              "None",
              "Unknown"
            ]
          },
          {
            id: "step2_mixed",
            question: "Please re-evaluate the location of the Eiffel Tower.",
            type: "radio",
            options: [
              "Paris",
              "Berlin",
              "London",
              "Rome"
            ]
          }
        ]
      },
      difficulty: "EXPERT",
      status: "AVAILABLE",
      ratePerHourCents: 5000,
      estimatedMinutes: 15,
      requirements: { create: { capabilityId: capability.id, minLevel: "EXPERT" } }
    }
  });

  console.log("✅ Advanced AI Evaluation task and assessment seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());