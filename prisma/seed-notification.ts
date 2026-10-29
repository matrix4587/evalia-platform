import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Find your user (Evans Kibet)
  const user = await prisma.user.findFirst({
    where: { email: { contains: "evans" } } // Adjust if your email is different
  });

  if (!user) {
    console.log("User not found. Please check your email.");
    return;
  }

  // 2. Find the latest assessment
  const latestAssessment = await prisma.assessment.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!latestAssessment) {
    console.log("No assessments found in the database.");
    return;
  }

  // 3. Create the notification
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      type: "ASSESSMENT_AVAILABLE",
      title: "New Assessment Available!",
      body: `A new assessment "${latestAssessment.name}" has just been uploaded. Take it now to unlock new capabilities and higher-paying tasks.`,
      link: `/assessments`, // Links directly to your assessments page
      readAt: null // Shows as unread (blue highlight)
    }
  });

  console.log("✅ Notification created successfully:", notification.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });