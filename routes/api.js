/**
 * Stayvia Backend API Routes
 * Tailored for students near Madhav Institute of Technology and Science (MITS), Gwalior
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// In-memory demonstration data for accommodations (fallback when MySQL is not connected)
const DEMO_ACCOMMODATIONS = [
  {
    id: 1,
    name: 'Sample Mandir View Student PG (Demo)',
    tagline: 'Sample boys PG accommodation in Gola Ka Mandir for MITS scholars',
    type: 'PG',
    gender: 'Boys',
    location: {
      address: 'Near Gola Ka Mandir Circle',
      locality: 'Gola Ka Mandir',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in Gola Ka Mandir (MITS Campus Area)'
    },
    pricing: {
      monthlyRent: 5500,
      currency: 'INR',
      depositMonths: 1,
      securityDeposit: 5500,
      depositNote: 'Illustrative 1 Month Deposit (Demo)',
      electricityExtra: false
    },
    occupancyTypes: ['Double Sharing', 'Triple Sharing'],
    facilities: ['High-speed Wi-Fi', 'Homestyle Food (2 Meals)', 'Power Backup', 'RO Water', 'Study Desk', 'CCTV Security'],
    rating: 4.5,
    reviewsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    availableRooms: 3,
    isDemo: true
  },
  {
    id: 2,
    name: 'Sample Anand Vihar Girls Residency (Demo)',
    tagline: 'Sample girls hostel residence in Anand Nagar with meal plans',
    type: 'Hostel',
    gender: 'Girls',
    location: {
      address: 'Main Road, Anand Nagar',
      locality: 'Anand Nagar',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in Anand Nagar, Gwalior'
    },
    pricing: {
      monthlyRent: 6800,
      currency: 'INR',
      depositMonths: 1,
      securityDeposit: 6800,
      depositNote: 'Illustrative 1 Month Deposit (Demo)',
      electricityExtra: true
    },
    occupancyTypes: ['Single', 'Double Sharing'],
    facilities: ['High-speed Wi-Fi', '3 Meals Daily', 'Air Cooler / AC Option', 'Power Backup', 'Biometric Entry', 'Laundromat Access'],
    rating: 4.7,
    reviewsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    availableRooms: 2,
    isDemo: true
  },
  {
    id: 3,
    name: 'Sample Thatipur Scholar Apartments (Demo)',
    tagline: 'Sample shared student flats in Thatipur for senior engineering students',
    type: 'Flat',
    gender: 'Co-ed',
    location: {
      address: 'Near Thatipur Commercial Center',
      locality: 'Thatipur',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in Thatipur, Gwalior'
    },
    pricing: {
      monthlyRent: 4800,
      currency: 'INR',
      depositMonths: 2,
      securityDeposit: 9600,
      depositNote: 'Illustrative 2 Months Deposit (Demo)',
      electricityExtra: true
    },
    occupancyTypes: ['Shared 2BHK Flat', 'Private Master Room'],
    facilities: ['High-speed Wi-Fi', 'Equipped Kitchen', 'Washing Machine', 'Power Backup', 'Attached Balcony', 'Parking Space'],
    rating: 4.4,
    reviewsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    availableRooms: 4,
    isDemo: true
  },
  {
    id: 4,
    name: 'Sample Campus Edge Hostel (Demo)',
    tagline: 'Sample air-conditioned boys hostel in Gola Ka Mandir hub',
    type: 'Hostel',
    gender: 'Boys',
    location: {
      address: 'Airport Road, Gola Ka Mandir',
      locality: 'Gola Ka Mandir',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in Gola Ka Mandir (MITS Campus Area)'
    },
    pricing: {
      monthlyRent: 7200,
      currency: 'INR',
      depositMonths: 1,
      securityDeposit: 7200,
      depositNote: 'Illustrative 1 Month Deposit (Demo)',
      electricityExtra: false
    },
    occupancyTypes: ['Single Room', 'Double Sharing'],
    facilities: ['High-speed Wi-Fi', '3 Meals Daily', 'Air Conditioned', 'Power Backup', 'Attached Bathroom', 'Study Hall'],
    rating: 4.6,
    reviewsCount: 26,
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    availableRooms: 3,
    isDemo: true
  },
  {
    id: 5,
    name: 'Sample Morar Greens PG (Demo)',
    tagline: 'Budget-conscious student PG listing in historic Morar',
    type: 'PG',
    gender: 'Boys',
    location: {
      address: 'Morar Main Bazar Road',
      locality: 'Morar',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in Morar, Gwalior'
    },
    pricing: {
      monthlyRent: 4200,
      currency: 'INR',
      depositMonths: 1,
      securityDeposit: 4200,
      depositNote: 'Illustrative 1 Month Deposit (Demo)',
      electricityExtra: false
    },
    occupancyTypes: ['Double Sharing', 'Triple Sharing'],
    facilities: ['High-speed Wi-Fi', 'Homestyle Food (2 Meals)', 'RO Water', 'Power Backup', 'Hot Water Geyser'],
    rating: 4.3,
    reviewsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    availableRooms: 5,
    isDemo: true
  },
  {
    id: 6,
    name: 'Sample City Center Student Suites (Demo)',
    tagline: 'Premium demonstration flat accommodation in City Center corridor',
    type: 'Flat',
    gender: 'Co-ed',
    location: {
      address: 'City Center Link Road',
      locality: 'City Center',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      localityNote: 'Located in City Center, Gwalior'
    },
    pricing: {
      monthlyRent: 8500,
      currency: 'INR',
      depositMonths: 2,
      securityDeposit: 17000,
      depositNote: 'Illustrative 2 Months Deposit (Demo)',
      electricityExtra: true
    },
    occupancyTypes: ['Private Room in 3BHK'],
    facilities: ['High-speed Wi-Fi', 'Air Conditioned', 'Equipped Kitchen', 'Power Backup', 'Daily Housekeeping', 'Lift & Security'],
    rating: 4.8,
    reviewsCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    availableRooms: 2,
    isDemo: true
  }
];

// In-memory demonstration data for Mess Providers (Gwalior)
const DEMO_MESS_SERVICES = [
  {
    id: 1,
    name: 'Sample Gwalior Tiffin & Homestyle Mess (Demo)',
    cuisine: 'North Indian / MP Thali Meals',
    dietType: 'Pure Vegetarian',
    deliveryToHostels: true,
    monthlyStartingPrice: 2800,
    trialMealAvailable: true,
    sampleMenu: ['Dal Tadka', 'Seasonal Subzi', '4 Phulkas', 'Rice', 'Salad'],
    rating: 4.7,
    reviewsCount: 34,
    coverage: 'Gola Ka Mandir, Anand Nagar & MITS area',
    city: 'Gwalior'
  },
  {
    id: 2,
    name: 'Sample Chambal Flavors Student Kitchen (Demo)',
    cuisine: 'MP Homestyle (Veg & Non-Veg Days)',
    dietType: 'Veg & Non-Veg (Wed & Sun)',
    deliveryToHostels: true,
    monthlyStartingPrice: 3200,
    trialMealAvailable: true,
    sampleMenu: ['Dal & Sambar', 'Steamed Rice', 'Special Chicken or Paneer', 'Roti', 'Salad'],
    rating: 4.6,
    reviewsCount: 28,
    coverage: 'Thatipur, Morar & Gola Ka Mandir',
    city: 'Gwalior'
  },
  {
    id: 3,
    name: 'Sample Shanti Student Dabba Service (Demo)',
    cuisine: 'Pure Veg Budget Daily Thali',
    dietType: 'Pure Vegetarian',
    deliveryToHostels: true,
    monthlyStartingPrice: 2500,
    trialMealAvailable: true,
    sampleMenu: ['Homestyle Yellow Dal', 'Dry Subzi', '4 Soft Rotis', 'Jeera Rice', 'Papad'],
    rating: 4.5,
    reviewsCount: 20,
    coverage: 'Gola Ka Mandir, Pinto Park & Anand Nagar',
    city: 'Gwalior'
  }
];

/**
 * GET /api/health
 * Primary health check endpoint for monitoring, uptime checks, and development validation.
 */
router.get('/health', async (req, res) => {
  const dbStatus = db.getStatus();

  res.status(200).json({
    status: 'ok',
    app: 'Stayvia - Student Accommodation & Mess Management Platform',
    campusFocus: 'MITS Gwalior (Madhya Pradesh)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    },
    database: {
      configured: db.isConfigured(),
      connected: dbStatus.connected,
      message: dbStatus.message
    }
  });
});

/**
 * GET /api/accommodations
 * Returns list of accommodations tailored for MITS Gwalior.
 * Supports filtering by keyword, locality, type, budget, and facility.
 */
router.get('/accommodations', async (req, res) => {
  try {
    const { query, type, locality, maxRent, facility } = req.query;

    let results = [...DEMO_ACCOMMODATIONS];

    // Filter by keyword query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.locality.toLowerCase().includes(q) ||
        item.location.localityNote.toLowerCase().includes(q) ||
        item.location.city.toLowerCase().includes(q) ||
        (item.facilities || []).some(f => f.toLowerCase().includes(q))
      );
    }

    // Filter by Gwalior Locality
    if (locality && locality.toLowerCase() !== 'all') {
      const loc = locality.toLowerCase().trim();
      results = results.filter(item =>
        item.location.locality.toLowerCase() === loc ||
        item.location.localityNote.toLowerCase().includes(loc)
      );
    }

    // Filter by Accommodation Type
    if (type && type.toLowerCase() !== 'all') {
      results = results.filter(item =>
        item.type.toLowerCase() === type.toLowerCase().trim()
      );
    }

    // Filter by Maximum Rent Budget
    if (maxRent && !isNaN(Number(maxRent))) {
      const budget = Number(maxRent);
      results = results.filter(item => item.pricing.monthlyRent <= budget);
    }

    // Filter by Facility
    if (facility && facility.toLowerCase() !== 'all') {
      const fac = facility.toLowerCase().trim();
      results = results.filter(item =>
        (item.facilities || []).some(f => {
          const fl = f.toLowerCase();
          if (fac === 'wi-fi') return fl.includes('wi-fi') || fl.includes('wifi');
          if (fac === 'food') return fl.includes('food') || fl.includes('meal') || fl.includes('mess');
          if (fac === 'air') return fl.includes('air condition') || fl.includes('air-condition') || fl.includes('cooler') || /\bac\b/i.test(fl);
          if (fac === 'power backup') return fl.includes('power backup') || fl.includes('backup');
          if (fac === 'attached bathroom') return fl.includes('attached bath');
          return fl.includes(fac);
        })
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      campusReference: 'MITS Gwalior',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      isDemonstrationData: true,
      dataNotice: 'Listing data is currently loaded from demonstration catalog tailored for MITS Gwalior students until live MySQL database is populated.',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accommodations',
      message: error.message
    });
  }
});

/**
 * GET /api/accommodations/:id
 * Returns a single demonstration accommodation by ID.
 */
router.get('/accommodations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const property = DEMO_ACCOMMODATIONS.find(item => item.id === id);

  if (!property) {
    return res.status(404).json({
      success: false,
      error: 'Property Not Found',
      message: `No accommodation exists with ID ${req.params.id}.`
    });
  }

  res.status(200).json({
    success: true,
    isDemonstrationData: true,
    data: property
  });
});

/**
 * POST /api/inquiries
 * Records a student visit or booking request in demonstration mode.
 */
router.post('/inquiries', (req, res) => {
  const { accommodationId, studentName, studentEmail, studentPhone, preferredDate, occupancyType, message } = req.body;

  if (!studentName || !studentEmail || !studentPhone) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Student name, email, and phone number are required.'
    });
  }

  const property = DEMO_ACCOMMODATIONS.find(item => item.id === parseInt(accommodationId, 10));
  const referenceNumber = `STAY-GWL-${Math.floor(10000 + Math.random() * 90000)}`;

  res.status(200).json({
    success: true,
    isDemonstrationData: true,
    message: 'Visit and booking inquiry submitted successfully (Demonstration Mode).',
    bookingReference: referenceNumber,
    timestamp: new Date().toISOString(),
    inquiryDetails: {
      referenceNumber,
      propertyName: property ? property.name : 'MITS Gwalior Student Residency (Demo)',
      propertyLocality: property ? property.location.locality : 'Gola Ka Mandir',
      studentName,
      studentEmail,
      studentPhone,
      preferredDate: preferredDate || 'Flexible / To be confirmed',
      occupancyType: occupancyType || 'Double Sharing',
      message: message || '',
      status: 'Inquiry Logged (Demo)'
    }
  });
});

/**
 * POST /api/auth/login
 * Evaluates demo user credentials and returns active session data.
 */
router.post('/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Email and password are required.'
    });
  }

  // Derive friendly display name from email or defaults
  let displayName = 'MITS Scholar';
  const cleanEmail = (email || '').toLowerCase().trim();
  if (cleanEmail === 'rajesh.owner.gwl@stayvia.example.com') {
    displayName = 'Rajesh Sharma';
  } else if (cleanEmail === 'aman.sharma@mitsgwalior.in') {
    displayName = 'Aman Sharma';
  } else if (cleanEmail === 'rohan.verma@mitsgwalior.in') {
    displayName = 'Rohan Verma';
  } else if (cleanEmail === 'vikram.hostels.gwl@stayvia.example.com') {
    displayName = 'Vikram Singhal';
  } else if (email.includes('@')) {
    const raw = email.split('@')[0];
    displayName = raw.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  res.status(200).json({
    success: true,
    isDemonstrationMode: true,
    message: 'Signed in successfully in prototype mode.',
    user: {
      name: displayName,
      email,
      role: role || (email.includes('owner') ? 'owner' : 'student'),
      college: 'MITS Gwalior'
    },
    demoToken: `demo_jwt_token_${Date.now()}`
  });
});

/**
 * POST /api/auth/signup
 * Creates a prototype user account for evaluation.
 */
router.post('/auth/signup', (req, res) => {
  const { fullName, email, phone, college, role, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Full name, email, and password are required.'
    });
  }

  res.status(201).json({
    success: true,
    isDemonstrationMode: true,
    message: 'Account created successfully in prototype mode.',
    user: {
      name: fullName,
      email,
      phone: phone || '',
      college: college || 'MITS Gwalior',
      role: role || 'student'
    },
    demoToken: `demo_jwt_token_${Date.now()}`
  });
});

/**
 * In-memory store for owner properties (demonstration mode backend sync)
 */
let OWNER_PROPERTIES = [];

/**
 * GET /api/owner/properties
 * Returns all properties created by owners
 */
router.get('/owner/properties', (req, res) => {
  res.status(200).json({
    success: true,
    count: OWNER_PROPERTIES.length,
    isDemonstrationMode: true,
    data: OWNER_PROPERTIES
  });
});

/**
 * POST /api/owner/properties
 * Creates a new property listing
 */
router.post('/owner/properties', (req, res) => {
  const data = req.body;
  if (!data.name || !data.type || !data.locality || !data.monthlyRent) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Title, property type, locality, and monthly rent are required.'
    });
  }

  const nextId = 100 + OWNER_PROPERTIES.length + 1;
  const newProperty = {
    id: nextId,
    isOwnerListing: true,
    createdAt: new Date().toISOString(),
    status: data.status || 'available',
    rating: 4.8,
    reviewsCount: 0,
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    campusReference: 'MITS Gwalior',
    ...data
  };

  OWNER_PROPERTIES.unshift(newProperty);

  res.status(201).json({
    success: true,
    isDemonstrationMode: true,
    message: 'Property listing created successfully.',
    data: newProperty
  });
});

/**
 * PUT /api/owner/properties/:id
 * Updates an existing owner property listing
 */
router.put('/owner/properties/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = OWNER_PROPERTIES.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'NotFound',
      message: `Property with ID ${id} not found in owner listings.`
    });
  }

  OWNER_PROPERTIES[index] = {
    ...OWNER_PROPERTIES[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    isDemonstrationMode: true,
    message: 'Property updated successfully.',
    data: OWNER_PROPERTIES[index]
  });
});

/**
 * PATCH /api/owner/properties/:id/availability
 * Toggles availability status
 */
router.patch('/owner/properties/:id/availability', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const property = OWNER_PROPERTIES.find(p => p.id === id);

  if (!property) {
    return res.status(404).json({
      success: false,
      error: 'NotFound',
      message: `Property with ID ${id} not found.`
    });
  }

  property.status = (property.status === 'occupied') ? 'available' : 'occupied';
  property.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: `Availability updated to ${property.status}.`,
    status: property.status,
    data: property
  });
});

/**
 * DELETE /api/owner/properties/:id
 * Deletes an owner property listing
 */
router.delete('/owner/properties/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialCount = OWNER_PROPERTIES.length;
  OWNER_PROPERTIES = OWNER_PROPERTIES.filter(p => p.id !== id);

  res.status(200).json({
    success: true,
    message: `Property with ID ${id} deleted successfully.`,
    deleted: OWNER_PROPERTIES.length < initialCount
  });
});

/**
 * GET /api/mess-services
 * Returns list of mess and meal subscription providers in Gwalior.
 */
router.get('/mess-services', (req, res) => {
  res.status(200).json({
    success: true,
    count: DEMO_MESS_SERVICES.length,
    city: 'Gwalior',
    isDemonstrationData: true,
    data: DEMO_MESS_SERVICES
  });
});

module.exports = router;
