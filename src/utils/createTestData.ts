import { firebaseFirestore, firebaseAuth } from '../config/firebase';

/**
 * Script to populate Firestore with test data
 * Run this once to create sample businesses, services, marketplace items, and rooms
 */

const getCurrentUserId = () => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) {
        throw new Error('No user logged in. Please log in first.');
    }
    return currentUser.uid;
};

export const createTestBusinesses = async () => {
    const userId = getCurrentUserId();

    const businesses = [
        {
            name: 'Al-Zahra Restaurant',
            category: 'Food',
            description: 'Authentic Middle Eastern cuisine with halal certification. Family-friendly atmosphere.',
            tagline: 'Taste of Home',
            city: 'London',
            address: '123 High Street, London',
            images: ['https://images.unsplash.com/photo-1604908177520-4025a13da5b1?auto=format&fit=crop&w=600&q=80'],
            logoUrl: 'https://images.unsplash.com/photo-1604908177520-4025a13da5b1?auto=format&fit=crop&w=200&q=80',
            contactPerson: 'Ahmed Ali',
            whatsapp: '+447700900123',
            email: 'info@alzahra.com',
            phone: '+442071234567',
            website: 'https://alzahra.com',
            instagram: '@alzahra_restaurant',
            openingHours: 'Mon-Sun: 11:00 AM - 11:00 PM',
            tags: ['halal', 'middle-eastern', 'family-friendly'],
            rating: 4.8,
            reviewCount: 124,
            verified: true,
            status: 'approved',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Noor Grocery',
            category: 'Retail',
            description: 'Your one-stop shop for halal groceries, fresh produce, and Middle Eastern products.',
            tagline: 'Fresh & Halal',
            city: 'Birmingham',
            address: '456 Market Street, Birmingham',
            images: ['https://images.unsplash.com/photo-1515705576963-95cad62945b6?auto=format&fit=crop&w=600&q=80'],
            contactPerson: 'Fatima Hassan',
            whatsapp: '+447700900456',
            email: 'contact@noorgrocery.com',
            phone: '+441212345678',
            tags: ['halal', 'grocery', 'fresh-produce'],
            rating: 4.6,
            reviewCount: 89,
            verified: true,
            status: 'approved',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Al-Hadi Legal Services',
            category: 'Legal',
            description: 'Professional legal services specializing in family law, immigration, and business matters.',
            tagline: 'Your Trusted Legal Partner',
            city: 'Manchester',
            address: '789 Law Street, Manchester',
            images: ['https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80'],
            contactPerson: 'Omar Khan',
            whatsapp: '+447700900789',
            email: 'info@alhadilegal.com',
            phone: '+441612345678',
            website: 'https://alhadilegal.com',
            tags: ['legal', 'immigration', 'family-law'],
            rating: 4.9,
            reviewCount: 56,
            verified: true,
            status: 'approved',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Hussainiya Pharmacy',
            category: 'Healthcare',
            description: 'Community pharmacy offering prescription services, health advice, and wellness products.',
            city: 'Leeds',
            address: '321 Health Avenue, Leeds',
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'],
            contactPerson: 'Dr. Sarah Ahmed',
            whatsapp: '+447700900321',
            email: 'info@hussainiyapharmacy.com',
            phone: '+441132345678',
            tags: ['pharmacy', 'healthcare', 'wellness'],
            rating: 4.7,
            reviewCount: 72,
            verified: false,
            status: 'approved',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Madinah Islamic School',
            category: 'Education',
            description: 'Quality Islamic education for children aged 5-16. Quran, Arabic, and Islamic studies.',
            city: 'London',
            address: '555 Education Road, London',
            images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'],
            contactPerson: 'Sheikh Ibrahim',
            whatsapp: '+447700900555',
            email: 'admin@madinahschool.com',
            phone: '+442071234555',
            website: 'https://madinahschool.com',
            tags: ['education', 'islamic-studies', 'quran'],
            rating: 4.9,
            reviewCount: 145,
            verified: true,
            status: 'approved',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('Creating test businesses...');
    for (const business of businesses) {
        await firebaseFirestore.collection('businesses').add(business);
        console.log(`✓ Created: ${business.name}`);
    }
    console.log('✓ All businesses created!');
};

export const createTestServices = async () => {
    const userId = getCurrentUserId();

    const services = [
        {
            name: 'Fatima Ahmed',
            serviceType: 'Tutor',
            description: 'Experienced Quran teacher with Ijazah. Teaching Tajweed and memorization for all ages.',
            city: 'London',
            areasCovered: ['London', 'Greater London'],
            images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'],
            profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
            whatsapp: '+447700900111',
            email: 'fatima.ahmed@email.com',
            phone: '+442071234111',
            experience: '10 years teaching experience',
            tags: ['quran', 'tajweed', 'memorization', 'online-classes'],
            rating: 5.0,
            reviewCount: 42,
            verified: true,
            status: 'approved',
            providerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Hassan Ali',
            serviceType: 'Plumber',
            description: 'Professional plumbing services. Emergency repairs, installations, and maintenance.',
            city: 'Birmingham',
            areasCovered: ['Birmingham', 'West Midlands'],
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'],
            whatsapp: '+447700900222',
            email: 'hassan.plumbing@email.com',
            phone: '+441212345222',
            experience: '15 years in plumbing',
            tags: ['plumbing', 'emergency-repairs', '24-7-service'],
            rating: 4.8,
            reviewCount: 67,
            verified: true,
            status: 'approved',
            providerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Zahra Hussain',
            serviceType: 'Designer',
            description: 'Creative graphic designer specializing in branding, logos, and social media content.',
            city: 'Manchester',
            areasCovered: ['Manchester', 'UK-wide (remote)'],
            images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'],
            whatsapp: '+447700900333',
            email: 'zahra.design@email.com',
            experience: '8 years in graphic design',
            tags: ['graphic-design', 'branding', 'social-media', 'remote'],
            rating: 4.9,
            reviewCount: 38,
            verified: true,
            status: 'approved',
            providerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Ali Electrician Services',
            serviceType: 'Electrician',
            description: 'Certified electrician for residential and commercial electrical work.',
            city: 'London',
            areasCovered: ['London', 'Essex', 'Kent'],
            images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'],
            whatsapp: '+447700900444',
            email: 'ali.electric@email.com',
            phone: '+442071234444',
            experience: '12 years certified electrician',
            tags: ['electrician', 'certified', 'residential', 'commercial'],
            rating: 4.7,
            reviewCount: 54,
            verified: true,
            status: 'approved',
            providerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('Creating test services...');
    for (const service of services) {
        await firebaseFirestore.collection('services').add(service);
        console.log(`✓ Created: ${service.name}`);
    }
    console.log('✓ All services created!');
};

export const createTestMarketplaceItems = async () => {
    const userId = getCurrentUserId();

    const items = [
        {
            title: 'Modern Dining Table Set',
            description: '6-seater dining table with chairs. Solid wood, excellent condition. Selling due to moving.',
            category: 'Furniture',
            condition: 'good',
            price: 250,
            currency: 'GBP',
            location: 'East London',
            city: 'London',
            images: ['https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=600&q=80'],
            contactMethod: 'whatsapp',
            whatsapp: '+447700900777',
            status: 'active',
            views: 15,
            sellerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'iPhone 13 Pro - 256GB',
            description: 'Excellent condition iPhone 13 Pro. Battery health 95%. Includes box and charger.',
            category: 'Electronics',
            condition: 'like-new',
            price: 550,
            currency: 'GBP',
            location: 'Birmingham City Centre',
            city: 'Birmingham',
            images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80'],
            contactMethod: 'whatsapp',
            whatsapp: '+447700900888',
            status: 'active',
            views: 42,
            sellerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('Creating test marketplace items...');
    for (const item of items) {
        await firebaseFirestore.collection('marketplace').add(item);
        console.log(`✓ Created: ${item.title}`);
    }
    console.log('✓ All marketplace items created!');
};

export const createTestRooms = async () => {
    const userId = getCurrentUserId();

    const rooms = [
        {
            title: 'Cozy Single Room in Shared House',
            description: 'Comfortable single room in a friendly Muslim household. Close to mosque and halal shops.',
            type: 'single',
            city: 'London',
            locationLine1: 'East London',
            locationLine2: 'Zone 2',
            postcode: 'E1 4NS',
            price: 450,
            priceLabel: '£450/month',
            billsIncluded: true,
            availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Available in 7 days
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'],
            amenities: ['WiFi', 'Shared Kitchen', 'Shared Bathroom', 'Near Mosque'],
            whatsapp: '+447700900999',
            email: 'room.london@email.com',
            status: 'available',
            views: 28,
            posterId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Double Room - Bills Included',
            description: 'Spacious double room in modern house. Perfect for students or professionals.',
            type: 'double',
            city: 'Birmingham',
            locationLine1: 'Sparkhill',
            locationLine2: 'Near Green Lane Masjid',
            price: 550,
            priceLabel: '£550/month',
            billsIncluded: true,
            availableFrom: new Date().toISOString(), // Available now
            images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80'],
            amenities: ['WiFi', 'Shared Kitchen', 'Parking', 'Garden'],
            whatsapp: '+447700900101',
            status: 'available',
            views: 35,
            posterId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('Creating test rooms...');
    for (const room of rooms) {
        await firebaseFirestore.collection('rooms').add(room);
        console.log(`✓ Created: ${room.title}`);
    }
    console.log('✓ All rooms created!');
};

export const createTestProfessionals = async () => {
    const userId = getCurrentUserId();

    const professionals = [
        {
            fullName: 'Dr. Ahmed Hassan',
            profession: 'Senior Software Engineer',
            company: 'Google',
            industry: 'technology',
            location: 'London',
            bio: 'Experienced software engineer with 12+ years in the tech industry. Passionate about mentoring aspiring developers and helping them navigate their career paths in technology.',
            skills: ['Software Development', 'System Design', 'Mentorship', 'Career Guidance'],
            experience: '12 years',
            education: 'PhD in Computer Science, Imperial College London',
            profilePhoto: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/ahmed-hassan',
            email: 'ahmed.hassan@example.com',
            phone: '+447700900001',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Dr. Fatima Ali',
            profession: 'Consultant Cardiologist',
            company: 'NHS - Royal London Hospital',
            industry: 'healthcare',
            location: 'London',
            bio: 'Healthcare professional with deep experience in cardiology. Passionate about mentoring junior doctors and medical students, helping them navigate the complexities of medical training and career development.',
            skills: ['Cardiology', 'Clinical Training', 'NHS Career Path', 'Interview Preparation'],
            experience: '15 years',
            education: 'MBBS, MD Cardiology',
            profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/fatima-ali',
            email: 'fatima.ali@example.com',
            phone: '+447700900002',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Zahra Hussain',
            profession: 'Investment Banking Analyst',
            company: 'JPMorgan Chase',
            industry: 'finance',
            location: 'London',
            bio: 'Finance professional with expertise in investment banking. Keen to help students and young professionals interested in finance careers, offering guidance on breaking into the industry.',
            skills: ['Investment Banking', 'Financial Analysis', 'Finance Career Path', 'Interview Preparation'],
            experience: '6 years',
            education: 'BSc Economics, LSE',
            profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/zahra-hussain',
            email: 'zahra.hussain@example.com',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Mohammed Khan',
            profession: 'Head of Mathematics',
            company: 'Sixth Form College Birmingham',
            industry: 'education',
            location: 'Birmingham',
            bio: 'Experienced educator passionate about mathematics and helping students achieve their academic goals. Available for career guidance in education sector.',
            skills: ['Mathematics', 'Teaching', 'Curriculum Development', 'Student Mentoring'],
            experience: '10 years',
            education: 'MSc Mathematics, University of Birmingham',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
            email: 'mohammed.khan@example.com',
            phone: '+447700900003',
            verified: false,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Sarah Rahman',
            profession: 'Data Scientist',
            company: 'Amazon',
            industry: 'technology',
            location: 'Manchester',
            bio: 'Data scientist specializing in machine learning and AI. Happy to mentor those interested in data science careers and provide guidance on technical skills development.',
            skills: ['Machine Learning', 'Python', 'Data Analysis', 'Career Mentorship'],
            experience: '8 years',
            education: 'PhD in Data Science, University of Manchester',
            profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/sarah-rahman',
            website: 'https://sarahrahman.dev',
            email: 'sarah.rahman@example.com',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Ali Raza',
            profession: 'General Practitioner',
            company: 'NHS - Leeds Medical Centre',
            industry: 'healthcare',
            location: 'Leeds',
            bio: 'GP with experience in primary care and community health. Interested in supporting medical students and junior doctors in their career journey.',
            skills: ['General Practice', 'Primary Care', 'Patient Care', 'Medical Training'],
            experience: '9 years',
            education: 'MBBS, MRCGP',
            profilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
            email: 'ali.raza@example.com',
            phone: '+447700900004',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Amina Patel',
            profession: 'Financial Advisor',
            company: 'Barclays Wealth Management',
            industry: 'finance',
            location: 'Birmingham',
            bio: 'Financial advisor helping clients with wealth management and financial planning. Open to mentoring those interested in financial services careers.',
            skills: ['Wealth Management', 'Financial Planning', 'Client Relations', 'Career Guidance'],
            experience: '7 years',
            education: 'BSc Finance, University of Birmingham',
            profilePhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/amina-patel',
            email: 'amina.patel@example.com',
            verified: false,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            fullName: 'Hassan Malik',
            profession: 'Senior Lecturer in Engineering',
            company: 'University of Leeds',
            industry: 'education',
            location: 'Leeds',
            bio: 'Engineering lecturer and researcher with focus on sustainable energy systems. Passionate about inspiring the next generation of engineers.',
            skills: ['Engineering', 'Research', 'Teaching', 'Sustainable Energy'],
            experience: '11 years',
            education: 'PhD in Mechanical Engineering, University of Leeds',
            profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            linkedIn: 'https://linkedin.com/in/hassan-malik',
            website: 'https://hassanmalik.ac.uk',
            email: 'hassan.malik@example.com',
            phone: '+447700900005',
            verified: true,
            status: 'approved',
            userId,
            connections: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    console.log('Creating test professionals...');
    for (const professional of professionals) {
        await firebaseFirestore.collection('professionals').add(professional);
        console.log(`✓ Created: ${professional.fullName}`);
    }
    console.log('✓ All professionals created!');
};

export const createAllTestData = async () => {
    try {
        console.log('🚀 Starting test data creation...\n');

        await createTestBusinesses();
        console.log('');

        await createTestServices();
        console.log('');

        await createTestMarketplaceItems();
        console.log('');

        await createTestRooms();
        console.log('');

        await createTestProfessionals();
        console.log('');

        console.log('✅ All test data created successfully!');
        console.log('\nYou can now:');
        console.log('- View businesses in Directory');
        console.log('- View services in Services');
        console.log('- View marketplace items in Buy & Sell');
        console.log('- View rooms in Room Finder');
        console.log('- View professionals in Professional Network');

        return true;
    } catch (error) {
        console.error('❌ Error creating test data:', error);
        throw error;
    }
};

// Export individual functions for selective use
export default {
    createAllTestData,
    createTestBusinesses,
    createTestServices,
    createTestMarketplaceItems,
    createTestRooms,
    createTestProfessionals,
};
