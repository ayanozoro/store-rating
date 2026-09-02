import prisma from "../src/config/database.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Clean existing records in order to respect Foreign Key constraints
    await prisma.rating.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();

    // 2. Hash passwords (all satisfy: 8–16 chars, 1 uppercase, 1 special char)
    const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
    const ownerPasswordHash = await bcrypt.hash("Owner@12345", 10);
    const userPasswordHash = await bcrypt.hash("User@12345", 10);

    // 3. Create 1 SYSTEM_ADMIN (Name length must be between 20 and 60 chars)
    const admin = await prisma.user.create({
        data: {
            name: "System Administrator Head",
            email: "admin@storerating.com",
            passwordHash: adminPasswordHash,
            address: "Admin Headquarters, 5th Floor, Cyber City, Bangalore",
            role: "SYSTEM_ADMIN",
        },
    });

    // 4. Create 2 STORE_OWNER accounts
    const owner1 = await prisma.user.create({
        data: {
            name: "Store Owner Rajesh Sharma",
            email: "owner1@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "124 Market Street, Connaught Place, New Delhi",
            role: "STORE_OWNER",
        },
    });

    const owner2 = await prisma.user.create({
        data: {
            name: "Store Owner Priya Patel",
            email: "owner2@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "45 MG Road, Indiranagar, Bangalore",
            role: "STORE_OWNER",
        },
    });

    // 5. Create 3 NORMAL_USER accounts
    const user1 = await prisma.user.create({
        data: {
            name: "Customer Rahul Verma User",
            email: "user1@storerating.com",
            passwordHash: userPasswordHash,
            address: "Flat 402, Sunshine Apartments, Sector 62, Noida",
            role: "NORMAL_USER",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: "Customer Ananya Sen Verma",
            email: "user2@storerating.com",
            passwordHash: userPasswordHash,
            address: "B-12, Green Park Extension, South Delhi",
            role: "NORMAL_USER",
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: "Customer Vikram Malhotra Roy",
            email: "user3@storerating.com",
            passwordHash: userPasswordHash,
            address: "78 Bandra West, Hill Road, Mumbai",
            role: "NORMAL_USER",
        },
    });

    // 6. Create 3 Stores (linked to owners)
    const store1 = await prisma.store.create({
        data: {
            name: "ABC Electronics & Gadgets",
            email: "contact@abcelectronics.com",
            address: "Connaught Place, Central Delhi",
            ownerId: owner1.id,
        },
    });

    const store2 = await prisma.store.create({
        data: {
            name: "The Artisan Coffee Roasters",
            email: "hello@artisancoffee.in",
            address: "100 Feet Road, Indiranagar, Bangalore",
            ownerId: owner2.id,
        },
    });

    const store3 = await prisma.store.create({
        data: {
            name: "Supreme Supermarket & Groceries",
            email: "info@supremegroceries.com",
            address: "Linking Road, Bandra West, Mumbai",
            // Store without an owner assigned yet
        },
    });

    // 7. Create Ratings (Integer 1-5, unique per user-store pair)
    await prisma.rating.createMany({
        data: [
            { rating: 5, userId: user1.id, storeId: store1.id },
            { rating: 4, userId: user2.id, storeId: store1.id },
            { rating: 5, userId: user1.id, storeId: store2.id },
            { rating: 3, userId: user3.id, storeId: store2.id },
            { rating: 4, userId: user2.id, storeId: store3.id },
        ],
    });

    console.log("✅ Database seeded successfully!");
    console.log("-----------------------------------------");
    console.log("Credentials for testing:");
    console.log("Admin:  admin@storerating.com  / Admin@12345");
    console.log("Owner1: owner1@storerating.com / Owner@12345");
    console.log("Owner2: owner2@storerating.com / Owner@12345");
    console.log("User1:  user1@storerating.com  / User@12345");
    console.log("User2:  user2@storerating.com  / User@12345");
    console.log("User3:  user3@storerating.com  / User@12345");
    console.log("-----------------------------------------");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
