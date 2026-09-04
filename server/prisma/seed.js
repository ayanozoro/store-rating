import prisma from "../src/config/database.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Seeding database with curated bookstore data...");

    // 1. Clean existing records in order to respect Foreign Key constraints
    await prisma.rating.deleteMany();
    await prisma.store.deleteMany();
    await prisma.user.deleteMany();

    // 2. Hash standard passwords (all satisfy: 8–16 chars, 1 uppercase, 1 special char)
    const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
    const ownerPasswordHash = await bcrypt.hash("Owner@12345", 10);
    const userPasswordHash = await bcrypt.hash("User@12345", 10);

    // 3. Create 1 SYSTEM_ADMIN (Name length 20–60 chars)
    const admin = await prisma.user.create({
        data: {
            name: "System Administrator Head",
            email: "admin@storerating.com",
            passwordHash: adminPasswordHash,
            address: "The Literary Guild, 10 Bloomsbury Square, London",
            role: "SYSTEM_ADMIN",
        },
    });

    // 4. Create STORE_OWNER accounts
    const owner1 = await prisma.user.create({
        data: {
            name: "Proprietor Sylvia Beach Jr",
            email: "owner1@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "37 Rue de la Bûcherie, 75005 Paris",
            role: "STORE_OWNER",
        },
    });

    const owner2 = await prisma.user.create({
        data: {
            name: "Lawrence Ferlinghetti Cur",
            email: "owner2@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "261 Columbus Ave, San Francisco, CA 94133",
            role: "STORE_OWNER",
        },
    });

    const owner3 = await prisma.user.create({
        data: {
            name: "Michael Powell Bookmaker",
            email: "owner3@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "1005 W Burnside St, Portland, OR 97209",
            role: "STORE_OWNER",
        },
    });

    const owner4 = await prisma.user.create({
        data: {
            name: "James Daunt Rare Curator",
            email: "owner4@storerating.com",
            passwordHash: ownerPasswordHash,
            address: "83-84 Marylebone High St, London W1U 4QW",
            role: "STORE_OWNER",
        },
    });

    // 5. Create community NORMAL_USER readers
    const user1 = await prisma.user.create({
        data: {
            name: "Arthur Conan Doyle Senior",
            email: "user1@storerating.com",
            passwordHash: userPasswordHash,
            address: "221B Baker Street, Marylebone, London",
            role: "NORMAL_USER",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: "Virginia Woolf Fellow Writer",
            email: "user2@storerating.com",
            passwordHash: userPasswordHash,
            address: "52 Tavistock Square, Bloomsbury, London",
            role: "NORMAL_USER",
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: "Ernest Hemingway Traveler",
            email: "user3@storerating.com",
            passwordHash: userPasswordHash,
            address: "74 Rue du Cardinal Lemoine, Paris",
            role: "NORMAL_USER",
        },
    });

    const user4 = await prisma.user.create({
        data: {
            name: "Clarissa Dalloway Reader",
            email: "user4@storerating.com",
            passwordHash: userPasswordHash,
            address: "Westminster, London SW1",
            role: "NORMAL_USER",
        },
    });

    const user5 = await prisma.user.create({
        data: {
            name: "Atticus Finch Book Collector",
            email: "user5@storerating.com",
            passwordHash: userPasswordHash,
            address: "Maycomb County Court Square",
            role: "NORMAL_USER",
        },
    });

    // 6. Create 10 Curated Bookstores
    const storesData = [
        {
            name: "Shakespeare & Company Paris",
            email: "contact@shakespeareandcompany.com",
            address: "37 Rue de la Bûcherie, Latin Quarter, Paris",
            ownerId: owner1.id,
        },
        {
            name: "City Lights Booksellers & Arts",
            email: "books@citylightsbooks.org",
            address: "261 Columbus Avenue, San Francisco, CA",
            ownerId: owner2.id,
        },
        {
            name: "Powell's City of Rare Books",
            email: "help@powellsbooks.com",
            address: "1005 W Burnside St, Portland, Oregon",
            ownerId: owner3.id,
        },
        {
            name: "Daunt Books Marylebone London",
            email: "orders@dauntbooks.co.uk",
            address: "83-84 Marylebone High Street, London",
            ownerId: owner4.id,
        },
        {
            name: "The Strand Book Stall & Prints",
            email: "info@strandbooksnyc.com",
            address: "828 Broadway at 12th Street, New York, NY",
            ownerId: null,
        },
        {
            name: "Livraria Lello & Antiquarian",
            email: "welcome@livrarialello.pt",
            address: "Rua das Carmelitas 144, 4050-161 Porto",
            ownerId: null,
        },
        {
            name: "Atlantis Books Santorini Haven",
            email: "hello@atlantisbooks.org",
            address: "Main Pedestrian Street, Oia, Santorini, Greece",
            ownerId: null,
        },
        {
            name: "The Bookworm Literary Café",
            email: "events@bookwormcafe.cn",
            address: "Building 4, Sanlitun South Road, Beijing",
            ownerId: null,
        },
        {
            name: "Foyles Charing Cross Flagship",
            email: "charingcross@foyles.co.uk",
            address: "107 Charing Cross Road, Soho, London",
            ownerId: null,
        },
        {
            name: "Blackwell's Broad Street Oxford",
            email: "oxford@blackwells.co.uk",
            address: "48-51 Broad Street, Oxford OX1 3BQ",
            ownerId: null,
        },
    ];

    const createdStores = [];
    for (const s of storesData) {
        const storeRecord = await prisma.store.create({ data: s });
        createdStores.push(storeRecord);
    }

    // 7. Seed Diverse Realistic Community Ratings (1-5 stars)
    const ratingsData = [
        // Store 0: Shakespeare & Company (Average ~4.8)
        { rating: 5, userId: user1.id, storeId: createdStores[0].id },
        { rating: 5, userId: user2.id, storeId: createdStores[0].id },
        { rating: 5, userId: user3.id, storeId: createdStores[0].id },
        { rating: 4, userId: user4.id, storeId: createdStores[0].id },

        // Store 1: City Lights Booksellers (Average ~4.7)
        { rating: 5, userId: user2.id, storeId: createdStores[1].id },
        { rating: 5, userId: user3.id, storeId: createdStores[1].id },
        { rating: 4, userId: user5.id, storeId: createdStores[1].id },

        // Store 2: Powell's City of Rare Books (Average ~4.8)
        { rating: 5, userId: user1.id, storeId: createdStores[2].id },
        { rating: 5, userId: user4.id, storeId: createdStores[2].id },
        { rating: 4, userId: user5.id, storeId: createdStores[2].id },
        { rating: 5, userId: user3.id, storeId: createdStores[2].id },

        // Store 3: Daunt Books Marylebone (Average ~5.0)
        { rating: 5, userId: user1.id, storeId: createdStores[3].id },
        { rating: 5, userId: user2.id, storeId: createdStores[3].id },
        { rating: 5, userId: user4.id, storeId: createdStores[3].id },

        // Store 4: The Strand Book Stall (Average ~4.5)
        { rating: 5, userId: user3.id, storeId: createdStores[4].id },
        { rating: 4, userId: user5.id, storeId: createdStores[4].id },

        // Store 5: Livraria Lello (Average ~4.7)
        { rating: 5, userId: user2.id, storeId: createdStores[5].id },
        { rating: 5, userId: user4.id, storeId: createdStores[5].id },
        { rating: 4, userId: user1.id, storeId: createdStores[5].id },

        // Store 6: Atlantis Books Santorini (Average ~5.0)
        { rating: 5, userId: user3.id, storeId: createdStores[6].id },
        { rating: 5, userId: user5.id, storeId: createdStores[6].id },

        // Store 7: The Bookworm Literary Café (Average ~4.3)
        { rating: 4, userId: user1.id, storeId: createdStores[7].id },
        { rating: 5, userId: user4.id, storeId: createdStores[7].id },
        { rating: 4, userId: user2.id, storeId: createdStores[7].id },

        // Store 8: Foyles Charing Cross (Average ~4.5)
        { rating: 5, userId: user2.id, storeId: createdStores[8].id },
        { rating: 4, userId: user3.id, storeId: createdStores[8].id },

        // Store 9: Blackwell's Broad Street Oxford (Average ~4.7)
        { rating: 5, userId: user1.id, storeId: createdStores[9].id },
        { rating: 4, userId: user4.id, storeId: createdStores[9].id },
        { rating: 5, userId: user5.id, storeId: createdStores[9].id },
    ];

    await prisma.rating.createMany({
        data: ratingsData,
    });

    const usersCount = await prisma.user.count();
    const storesCount = await prisma.store.count();
    const ratingsCount = await prisma.rating.count();

    console.log("✅ Bookstore database seeded successfully!");
    console.log(`📚 Seeded counts: ${usersCount} users, ${storesCount} bookstores, ${ratingsCount} community ratings`);
    console.log("---------------------------------------------------------------");
    console.log("Demo Credentials:");
    console.log("👑 Admin:       admin@storerating.com  / Admin@12345");
    console.log("🏪 Owner (Paris): owner1@storerating.com / Owner@12345");
    console.log("🏪 Owner (SF):    owner2@storerating.com / Owner@12345");
    console.log("📖 Reader 1:    user1@storerating.com  / User@12345");
    console.log("📖 Reader 2:    user2@storerating.com  / User@12345");
    console.log("---------------------------------------------------------------");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
