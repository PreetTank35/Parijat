"use strict";
// ============================================
// PARIJAT API — Comprehensive Database Seed
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const shared_1 = require("@parijat/shared");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('[SEED] Starting Parijat database seed...');
    // 1. Seed Villages
    console.log('[SEED] Seeding villages...');
    const villageMap = new Map();
    for (const v of shared_1.PILOT_VILLAGES) {
        const village = await prisma.village.upsert({
            where: { id: `village-${v.nameEn.toLowerCase()}` },
            update: {},
            create: {
                id: `village-${v.nameEn.toLowerCase()}`,
                nameEn: v.nameEn,
                nameMr: v.nameMr,
                nameHi: v.nameHi,
                taluka: v.taluka,
                district: v.district,
                state: v.state,
                pincode: v.pincode,
                latitude: v.latitude,
                longitude: v.longitude,
            },
        });
        villageMap.set(v.nameEn, village.id);
    }
    // 2. Seed Equipment Categories
    console.log('[SEED] Seeding equipment categories...');
    const categoryMap = new Map();
    for (const cat of shared_1.EQUIPMENT_CATEGORIES) {
        const category = await prisma.equipmentCategory.upsert({
            where: { code: cat.code },
            update: {
                nameEn: cat.nameEn,
                nameMr: cat.nameMr,
                nameHi: cat.nameHi,
                emoji: cat.emoji,
            },
            create: {
                code: cat.code,
                nameEn: cat.nameEn,
                nameMr: cat.nameMr,
                nameHi: cat.nameHi,
                emoji: cat.emoji,
            },
        });
        categoryMap.set(cat.code, category.id);
    }
    // 3. Seed Crops
    console.log('[SEED] Seeding crops...');
    const cropMap = new Map();
    for (const crop of shared_1.CROPS) {
        const c = await prisma.crop.upsert({
            where: { code: crop.code },
            update: {
                nameEn: crop.nameEn,
                nameMr: crop.nameMr,
                nameHi: crop.nameHi,
                category: crop.category,
                emoji: crop.emoji,
            },
            create: {
                code: crop.code,
                nameEn: crop.nameEn,
                nameMr: crop.nameMr,
                nameHi: crop.nameHi,
                category: crop.category,
                emoji: crop.emoji,
            },
        });
        cropMap.set(crop.code, c.id);
    }
    // 4. Seed Mandi Markets
    console.log('[SEED] Seeding mandis...');
    const marketMap = new Map();
    for (const m of shared_1.PILOT_MARKETS) {
        const market = await prisma.market.upsert({
            where: { id: `market-${m.nameEn.toLowerCase().replace(/\s+/g, '-')}` },
            update: {},
            create: {
                id: `market-${m.nameEn.toLowerCase().replace(/\s+/g, '-')}`,
                nameEn: m.nameEn,
                nameMr: m.nameMr,
                nameHi: m.nameHi,
                district: m.district,
                state: m.state,
                latitude: m.latitude,
                longitude: m.longitude,
            },
        });
        marketMap.set(m.nameEn, market.id);
    }
    // 5. Seed Users & Profiles (Realistic Maharashtra Farmers)
    console.log('[SEED] Seeding farmer users...');
    const usersData = [
        {
            phone: '9822012345',
            name: 'Ramesh Tukaram Shinde (रमेश शिंदे)',
            preferredLanguage: 'mr',
            villageName: 'Baramati',
            landAcreage: 8.5,
            primaryCrops: '["SUGARCANE", "WHEAT", "SOYBEAN"]',
            isOwner: true,
        },
        {
            phone: '9822023456',
            name: 'Sanjay Dattatray Patil (संजय पाटील)',
            preferredLanguage: 'mr',
            villageName: 'Junnar',
            landAcreage: 12.0,
            primaryCrops: '["ONION", "TOMATO", "SOYBEAN"]',
            isOwner: true,
        },
        {
            phone: '9822034567',
            name: 'Ananda Bhau Kadam (आनंदा कदम)',
            preferredLanguage: 'mr',
            villageName: 'Hinjewadi',
            landAcreage: 4.0,
            primaryCrops: '["WHEAT", "RICE"]',
            isOwner: true,
        },
        {
            phone: '9822045678',
            name: 'Dnyaneshwar Baban More (ज्ञानेश्वर मोरे)',
            preferredLanguage: 'mr',
            villageName: 'Shirur',
            landAcreage: 2.5,
            primaryCrops: '["BAJRA", "JOWAR"]',
            isOwner: false,
        },
        {
            phone: '9822056789',
            name: 'Sunita Ashok Gaikwad (सुनिता गायकवाड)',
            preferredLanguage: 'hi',
            villageName: 'Indapur',
            landAcreage: 3.0,
            primaryCrops: '["COTTON", "GRAM"]',
            isOwner: false,
        },
        {
            phone: '9822067890',
            name: 'Ganesh Pandurang Jagtap (गणेश जगताप)',
            preferredLanguage: 'en',
            villageName: 'Bhor',
            landAcreage: 6.0,
            primaryCrops: '["RICE", "TUR"]',
            isOwner: true,
        },
    ];
    const userMap = new Map();
    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { phone: u.phone },
            update: {
                name: u.name,
                preferredLanguage: u.preferredLanguage,
                isVerified: true,
            },
            create: {
                phone: u.phone,
                name: u.name,
                preferredLanguage: u.preferredLanguage,
                isVerified: true,
            },
        });
        userMap.set(u.phone, user.id);
        const vId = villageMap.get(u.villageName);
        await prisma.farmerProfile.upsert({
            where: { userId: user.id },
            update: {
                villageId: vId,
                landAcreage: u.landAcreage,
                primaryCrops: u.primaryCrops,
                isEquipmentOwner: u.isOwner,
            },
            create: {
                userId: user.id,
                villageId: vId,
                landAcreage: u.landAcreage,
                primaryCrops: u.primaryCrops,
                isEquipmentOwner: u.isOwner,
            },
        });
    }
    // 6. Seed Equipment Listings
    console.log('[SEED] Seeding equipment listings...');
    await prisma.review.deleteMany({});
    await prisma.bookingStatusHistory.deleteMany({});
    await prisma.equipmentBooking.deleteMany({});
    await prisma.equipmentImage.deleteMany({});
    await prisma.equipmentListing.deleteMany({});
    const rameshId = userMap.get('9822012345');
    const sanjayId = userMap.get('9822023456');
    const anandaId = userMap.get('9822034567');
    const ganeshId = userMap.get('9822067890');
    const listingsData = [
        {
            ownerId: rameshId,
            categoryCode: 'TRACTOR',
            villageName: 'Baramati',
            titleEn: 'Mahindra 575 DI 45HP Tractor with Driver',
            titleMr: 'महिंद्रा ५७५ डीआय ४५ एचपी ट्रॅक्टर (चालकासह)',
            titleHi: 'महिंद्रा 575 डीआई 45 एचपी ट्रैक्टर (चालक सहित)',
            description: 'Excellent condition heavy-duty tractor, ideal for ploughing, rotavator operations, and haulage in black soil. Experienced driver included.',
            rentalRate: 850,
            rentalUnit: 'HOURLY',
            securityDeposit: 1500,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmvn-ew7IxRrGV1zgNV_NPcmM5Lvt3YvSH8VzGqpSXU7uMcwVTZdukNOXFG4w8z0TPQUphAI8u3rO0GUtih7RgvVIODcuDTqQwI-0raP8YvQH8-_zB29o0mWSdVrPOtIQpP3sHc1GDWpUvUUGwCWKYuQ6NmdUVt08VSERes6CAtAYeZodF7W3NZ17QRS0LgHBCBoj2-FdgGP3g8KUvYrbAdte7G5f7yWEb_lDL0rgqrsAj5W33dM7Lw',
        },
        {
            ownerId: rameshId,
            categoryCode: 'ROTAVATOR',
            villageName: 'Baramati',
            titleEn: 'Shaktiman 6 Feet Rotary Tiller / Rotavator',
            titleMr: 'शक्तिमान ६ फूट रोटाव्हेटर (जमीन भुसभुशीत करण्यासाठी)',
            titleHi: 'शक्तिमान 6 फीट रोटावेटर (जुताई के लिए)',
            description: 'High-speed blades for fine seedbed preparation. Fits 40+ HP tractors.',
            rentalRate: 600,
            rentalUnit: 'HOURLY',
            securityDeposit: 1000,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFKqKL4Th61hGqAVIIR9LyKKewj3llLLlKflyAwqO5N8EM00_gvEnbQzx4sKpxIplPuI-A2bDHUhAgfVIbfTTQgTCNRskaKgpn6p8gi3wZJN7Le24AsbMMR2E5hk806PNdGzOhDV-MpmgSwphd7xVQ0B1KeLGWKs3HtS7SRFCr49e193MPU1nfYfHlqWHZ9Fjw_QAS7v80ynvIa8WQPKgVM8aPZLXXNgcxqVp1pXyGbdzzZ-mMxgg5IA',
        },
        {
            ownerId: sanjayId,
            categoryCode: 'HARVESTER',
            villageName: 'Junnar',
            titleEn: 'Preet 987 Self-Propelled Multi-Crop Combine Harvester',
            titleMr: 'प्रीत ९८७ कंबाईन हार्वेस्टर (सोयाबीन, गहू कापणी यंत्र)',
            titleHi: 'प्रीत 987 कंबाइन हार्वेस्टर (सोयाबीन व गेहूं)',
            description: 'Clean separation and low grain loss. Highly efficient for soybean, wheat, and gram harvest.',
            rentalRate: 2400,
            rentalUnit: 'HOURLY',
            securityDeposit: 5000,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBneCDE8mnrWDtIRmqNRNf-2JlPtfn0VyowRCSnGqhdHuksVQXqyVbTgEfOCQ0fumwTEUbPpPGP8KQraPLPl86Heq7Rd9AnId-5z-fAAUHf8neDy99m0m_jDYRzFYVnxnUTaqhtfxDUvL8sLHFKJm58bfrdS9E2Qi31QQD9Sw6zt3PCFl8uec357W08HJ0wWyuUto_e6sRUEQJeFYfaBp0k79LD5wpk93PL2QSg8Yp6gHBhCtNUC6mHOQ',
        },
        {
            ownerId: sanjayId,
            categoryCode: 'SPRAYER',
            villageName: 'Junnar',
            titleEn: 'Mitra Tractor-Mounted Boom Sprayer 400L',
            titleMr: 'मित्रा ट्रॅक्टर बूम स्प्रेयर ४०० लिटर (फळबाग व भाजीपाला)',
            titleHi: 'मित्रा ट्रैक्टर बूम स्प्रेयर 400 लीटर',
            description: 'Precision Italian nozzles, adjustable width up to 30 feet, ideal for onion and tomato pest control.',
            rentalRate: 1200,
            rentalUnit: 'DAILY',
            securityDeposit: 2000,
            status: 'ACTIVE',
            imageUrl: 'https://images.unsplash.com/photo-1595838725984-1d957df33d41?w=800&auto=format&fit=crop&q=80',
        },
        {
            ownerId: anandaId,
            categoryCode: 'TRACTOR',
            villageName: 'Hinjewadi',
            titleEn: 'Swaraj 744 FE 48HP Power Steering Tractor',
            titleMr: 'स्वराज ७४४ एफई ट्रॅक्टर (पॉवर स्टीअरिंग)',
            titleHi: 'स्वराज 744 एफई ट्रैक्टर',
            description: 'Very fuel-efficient Swaraj tractor, well maintained with hydraulic trolley hitch.',
            rentalRate: 900,
            rentalUnit: 'HOURLY',
            securityDeposit: 1500,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIvbDYezDnjU8L0BzEScBORjEk5_1wwvDeB4fP3kyyI5cbNqgJmY1wdkJCK9sDONZeZBSDldM6OKjL73kCzKTfjBntXsar3VptLZ3oMtxV-Nh9jqhSE8PBlwea-QfuM5OAISpzNo3VgPtGizGiruIrO1MycFuArw8ySVauAZYybLcNr9MaINzNRvLXVauO2n2BYAXouYLxtci3_KzJ-Nt1iCeXeLy2_WgrcbCxfJZhf_4noDLMLrkq9Q',
        },
        {
            ownerId: anandaId,
            categoryCode: 'WATER_PUMP',
            villageName: 'Hinjewadi',
            titleEn: 'Kirloskar 5HP Diesel Irrigation Water Pump Set',
            titleMr: 'किर्लोस्कर ५ एचपी डिझेल पाणी उपसा पंप',
            titleHi: 'किर्लोस्कर 5 एचपी डीजल सिंचाई पंप',
            description: 'Portable, comes with 100 feet delivery pipe and foot valve. Perfect for farm pond irrigation.',
            rentalRate: 500,
            rentalUnit: 'DAILY',
            securityDeposit: 1000,
            status: 'ACTIVE',
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
        },
        {
            ownerId: ganeshId,
            categoryCode: 'THRESHER',
            villageName: 'Bhor',
            titleEn: 'Dasmesh Multi-Crop Paddy and Grain Thresher',
            titleMr: 'दशमेश मळणी यंत्र (भात आणि ज्वारी मळणी)',
            titleHi: 'दशमेश मल्टीक्रॉप थ्रेशर',
            description: 'Heavy duty drum, dual blower for 99% grain purity without husk.',
            rentalRate: 700,
            rentalUnit: 'HOURLY',
            securityDeposit: 1200,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBneCDE8mnrWDtIRmqNRNf-2JlPtfn0VyowRCSnGqhdHuksVQXqyVbTgEfOCQ0fumwTEUbPpPGP8KQraPLPl86Heq7Rd9AnId-5z-fAAUHf8neDy99m0m_jDYRzFYVnxnUTaqhtfxDUvL8sLHFKJm58bfrdS9E2Qi31QQD9Sw6zt3PCFl8uec357W08HJ0wWyuUto_e6sRUEQJeFYfaBp0k79LD5wpk93PL2QSg8Yp6gHBhCtNUC6mHOQ',
        },
        {
            ownerId: ganeshId,
            categoryCode: 'PLOUGH',
            villageName: 'Bhor',
            titleEn: '2-Bottom Hydraulic Reversible Mould Board Plough',
            titleMr: '२-तवा रिव्हर्सिबल हायड्रॉलिक नांगर',
            titleHi: '2-बॉटम रिवर्सिबल हाइड्रोलिक हल',
            description: 'Deep tilling plough for breaking hardpan soil. Uniform inversion without clods.',
            rentalRate: 400,
            rentalUnit: 'HOURLY',
            securityDeposit: 800,
            status: 'ACTIVE',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFKqKL4Th61hGqAVIIR9LyKKewj3llLLlKflyAwqO5N8EM00_gvEnbQzx4sKpxIplPuI-A2bDHUhAgfVIbfTTQgTCNRskaKgpn6p8gi3wZJN7Le24AsbMMR2E5hk806PNdGzOhDV-MpmgSwphd7xVQ0B1KeLGWKs3HtS7SRFCr49e193MPU1nfYfHlqWHZ9Fjw_QAS7v80ynvIa8WQPKgVM8aPZLXXNgcxqVp1pXyGbdzzZ-mMxgg5IA',
        },
    ];
    const createdListings = [];
    for (const l of listingsData) {
        const catId = categoryMap.get(l.categoryCode);
        const vId = villageMap.get(l.villageName);
        if (!catId || !vId)
            continue;
        const listing = await prisma.equipmentListing.create({
            data: {
                ownerId: l.ownerId,
                categoryId: catId,
                villageId: vId,
                titleEn: l.titleEn,
                titleMr: l.titleMr,
                titleHi: l.titleHi,
                description: l.description,
                rentalRate: l.rentalRate,
                rentalUnit: l.rentalUnit,
                securityDeposit: l.securityDeposit,
                status: l.status,
                images: {
                    create: [
                        {
                            url: l.imageUrl,
                            isPrimary: true,
                            sortOrder: 0,
                        },
                    ],
                },
            },
        });
        createdListings.push(listing);
    }
    // 7. Seed Sample Booking & History
    console.log('[SEED] Seeding sample completed booking with review...');
    const dnyaneshwarId = userMap.get('9822045678');
    if (createdListings.length > 0) {
        const sampleListing = createdListings[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 5);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 4);
        const booking = await prisma.equipmentBooking.create({
            data: {
                bookingNumber: `PRJ-SEED-001`,
                listingId: sampleListing.id,
                renterId: dnyaneshwarId,
                startDate,
                endDate,
                totalUnits: 6,
                totalAmount: 6 * sampleListing.rentalRate,
                status: 'COMPLETED',
                paymentStatus: 'PAID_MOCK',
                notes: 'Ploughing 3 acres of sugarcane field before sowing.',
            },
        });
        await prisma.bookingStatusHistory.create({
            data: {
                bookingId: booking.id,
                fromStatus: 'ACCEPTED',
                toStatus: 'COMPLETED',
                changedById: sampleListing.ownerId,
                reason: 'Equipment returned in good condition',
            },
        });
        await prisma.review.create({
            data: {
                bookingId: booking.id,
                reviewerId: dnyaneshwarId,
                revieweeId: sampleListing.ownerId,
                listingId: sampleListing.id,
                rating: 5,
                comment: 'ट्रॅक्टर खूप चांगल्या कंडिशनमध्ये होता. चालक वेळेवर आला आणि काम उत्तम झाले!',
            },
        });
    }
    // 8. Seed Mandi Price Observations (Realistic Pune APMC & Baramati Rates)
    console.log('[SEED] Seeding mandi price observations...');
    const puneMarketId = marketMap.get('Pune Market Yard');
    const baramatiMarketId = marketMap.get('Baramati Mandi');
    const junnarMarketId = marketMap.get('Junnar Mandi');
    const priceObservations = [
        { cropCode: 'ONION', marketId: puneMarketId, min: 1400, max: 2800, modal: 2200 },
        { cropCode: 'ONION', marketId: junnarMarketId, min: 1300, max: 2600, modal: 2050 },
        { cropCode: 'TOMATO', marketId: puneMarketId, min: 1100, max: 2100, modal: 1650 },
        { cropCode: 'TOMATO', marketId: junnarMarketId, min: 1000, max: 1950, modal: 1500 },
        { cropCode: 'SOYBEAN', marketId: baramatiMarketId, min: 4200, max: 4850, modal: 4600 },
        { cropCode: 'SOYBEAN', marketId: puneMarketId, min: 4300, max: 4900, modal: 4680 },
        { cropCode: 'WHEAT', marketId: puneMarketId, min: 2500, max: 3100, modal: 2850 },
        { cropCode: 'WHEAT', marketId: baramatiMarketId, min: 2450, max: 3000, modal: 2780 },
        { cropCode: 'COTTON', marketId: baramatiMarketId, min: 6800, max: 7600, modal: 7250 },
        { cropCode: 'SUGARCANE', marketId: baramatiMarketId, min: 310, max: 340, modal: 325, unit: 'TONNE' },
        { cropCode: 'GRAM', marketId: puneMarketId, min: 5400, max: 6200, modal: 5800 },
    ];
    for (const obs of priceObservations) {
        const cropId = cropMap.get(obs.cropCode);
        if (!cropId || !obs.marketId)
            continue;
        // Create 3 historical dates for ticker / trends
        for (let daysAgo = 2; daysAgo >= 0; daysAgo--) {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const delta = (Math.random() - 0.5) * 50;
            await prisma.marketPriceObservation.create({
                data: {
                    cropId,
                    marketId: obs.marketId,
                    date,
                    minPrice: Math.round(obs.min + delta),
                    maxPrice: Math.round(obs.max + delta),
                    modalPrice: Math.round(obs.modal + delta),
                    unit: obs.unit || 'QUINTAL',
                    sourceName: 'MSAMB (Maharashtra State Agricultural Marketing Board)',
                    isVerified: true,
                },
            });
        }
    }
    // 9. Seed Suppliers and Farm Inputs
    console.log('[SEED] Seeding suppliers & farm inputs...');
    const supplier1 = await prisma.supplier.create({
        data: {
            name: 'Krishi Vikas Seva Kendra (कृषी विकास सेवा केंद्र)',
            contactPhone: '9822112233',
            village: 'Baramati',
            district: 'Pune',
            rating: 4.8,
            verified: true,
        },
    });
    const supplier2 = await prisma.supplier.create({
        data: {
            name: 'Kisan Bio-Agri Solutions (किसान बायो-अ‍ॅग्री)',
            contactPhone: '9822445566',
            village: 'Junnar',
            district: 'Pune',
            rating: 4.6,
            verified: true,
        },
    });
    const inputProducts = [
        {
            supplierId: supplier1.id,
            category: 'SEEDS',
            nameEn: 'Mahyco JS-335 Certified Soybean Seeds',
            nameMr: 'माहिको जेएस-३३५ प्रमाणित सोयाबीन बियाणे (३० किलो)',
            nameHi: 'माहिको जेएस-335 प्रमाणित सोयाबीन बीज',
            packSize: '30 kg Bag',
            price: 2650,
            mrp: 3100,
            imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
        },
        {
            supplierId: supplier1.id,
            category: 'FERTILIZERS',
            nameEn: 'IFFCO 10:26:26 NPK Complex Fertilizer',
            nameMr: 'इफको १०:२६:२६ एनपीके खत (५० किलो)',
            nameHi: 'इफको 10:26:26 एनपीके खाद',
            packSize: '50 kg Bag',
            price: 1470,
            mrp: 1650,
            imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
        },
        {
            supplierId: supplier2.id,
            category: 'PESTICIDES',
            nameEn: 'Bio-Neem 10,000 PPM Organic Insecticide',
            nameMr: 'बायो-कडुलिंब अर्क कीटकनाशक (१ लिटर)',
            nameHi: 'बायो-नीम जैविक कीटनाशक',
            packSize: '1 Litre Bottle',
            price: 680,
            mrp: 850,
            imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80',
        },
        {
            supplierId: supplier2.id,
            category: 'TOOLS',
            nameEn: 'Balwan 16L Battery Operated Knapsack Sprayer',
            nameMr: 'बलवान १६ लिटर बॅटरीवर चालणारा स्प्रे पंप',
            nameHi: 'बलवान 16 लीटर बैटरी स्प्रे पंप',
            packSize: '1 Unit',
            price: 2450,
            mrp: 3200,
            imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
        },
    ];
    const createdProducts = [];
    for (const p of inputProducts) {
        const prod = await prisma.farmInputProduct.create({ data: p });
        createdProducts.push(prod);
    }
    // 10. Seed Group Purchase with Participants
    console.log('[SEED] Seeding village group purchase with active pledges...');
    const baramatiVillageId = villageMap.get('Baramati');
    if (createdProducts.length > 0 && baramatiVillageId) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14);
        const groupPurchase = await prisma.groupPurchaseRequest.create({
            data: {
                productId: createdProducts[1].id, // IFFCO Fertilizer
                villageId: baramatiVillageId,
                targetQuantity: 100,
                currentQuantity: 45,
                unit: 'Bags',
                targetDate,
                discountPercent: 12.5,
                status: 'OPEN',
            },
        });
        // Pledges by Ramesh and Dnyaneshwar
        await prisma.groupPurchaseParticipant.create({
            data: {
                groupPurchaseId: groupPurchase.id,
                userId: rameshId,
                quantity: 25,
            },
        });
        await prisma.groupPurchaseParticipant.create({
            data: {
                groupPurchaseId: groupPurchase.id,
                userId: dnyaneshwarId,
                quantity: 20,
            },
        });
    }
    // 11. Seed Welcome Notifications
    console.log('[SEED] Seeding notifications...');
    for (const [phone, uId] of userMap.entries()) {
        await prisma.notification.create({
            data: {
                userId: uId,
                titleEn: 'Welcome to Parijat!',
                titleMr: 'पारिजात मध्ये आपले स्वागत आहे!',
                titleHi: 'पारिजात में आपका स्वागत है!',
                messageEn: 'Rent equipment, check verified mandi prices, and join group purchases nearby.',
                messageMr: 'शेतीची अवजारे भाड्याने घ्या, बाजार भाव पहा आणि सामूहिक खरेदीत बचत करा.',
                messageHi: 'कृषि उपकरण किराए पर लें, मंडी भाव देखें और सामूहिक खरीद में बचत करें।',
                type: 'SYSTEM',
                linkUrl: '/',
            },
        });
    }
    console.log('[SEED] Database seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('[SEED] Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map