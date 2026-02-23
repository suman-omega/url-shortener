import { auth } from "../lib/auth";

async function seed() {
  console.log("Seeding admin user...");
  try {
    const admin = await auth.api.signUpEmail({
      body: {
        email: "admin@htrcare.com",
        password: "admin123",
        name: "Admin",
      },
    });
    console.log("Admin user created successfully:", admin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
  process.exit(0);
}

seed();
