/**
 * Stayvia Owner Dashboard & Storage Verification Test
 * 
 * Verifies:
 * 1. GET /owner-dashboard serves the Owner Dashboard HTML page with HTTP 200.
 * 2. GET /dashboard alias serves the Owner Dashboard HTML page with HTTP 200.
 * 3. window.StayviaStorage CRUD functions in client sample-data.js:
 *    - Initial state & photoPresets
 *    - Add new owner property (auto-generated ID, isOwnerListing flag)
 *    - Merged catalog (getAllAccommodations) placing owner listing first
 *    - Toggle property availability (available <-> occupied)
 *    - Edit/update property fields
 *    - Record and retrieve student walkthrough inquiries
 *    - Delete owner property cleanly without mutating default sample stays
 * 4. Backend REST API owner endpoints (/api/owner/properties)
 */

const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 3998;
process.env.PORT = TEST_PORT;
process.env.NODE_ENV = 'test';

const app = require('../server');

function makeRequest(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

function makeApiRequest(method, urlPath, payload = null) {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : null;
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path: urlPath,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Stayvia Owner Dashboard & Storage Verification Tests...\n');

  try {
    // -------------------------------------------------------------------------
    // Test 1: GET /owner-dashboard Delivery
    // -------------------------------------------------------------------------
    console.log('Test 1: GET /owner-dashboard (Dedicated Owner Dashboard Page)');
    const dashRes = await makeRequest('/owner-dashboard');
    assert.strictEqual(dashRes.statusCode, 200, 'Owner dashboard should return status 200');
    assert.ok(dashRes.body.includes('Owner Dashboard'), 'Dashboard should include header');
    assert.ok(dashRes.body.includes('Add New Property'), 'Dashboard should contain Add Property button');
    assert.ok(dashRes.body.includes('My Properties'), 'Dashboard should contain My Properties section');
    assert.ok(dashRes.body.includes('Gwalior'), 'Dashboard should reference Gwalior');
    console.log('  ✅ Passed: /owner-dashboard served successfully with HTML & UI components.\n');

    // -------------------------------------------------------------------------
    // Test 2: GET /dashboard Route Alias
    // -------------------------------------------------------------------------
    console.log('Test 2: GET /dashboard (Route Alias)');
    const aliasRes = await makeRequest('/dashboard');
    assert.strictEqual(aliasRes.statusCode, 200, 'Dashboard alias should return status 200');
    assert.ok(aliasRes.body.includes('Owner Dashboard'), 'Dashboard alias should serve the same dashboard page');
    console.log('  ✅ Passed: /dashboard alias served successfully.\n');

    // -------------------------------------------------------------------------
    // Test 3: StayviaStorage Client-side CRUD Simulation
    // -------------------------------------------------------------------------
    console.log('Test 3: Client-side StayviaStorage CRUD & Merged Catalog');
    
    // Setup Mock LocalStorage & Window
    const mockStorage = {};
    const mockLocalStorage = {
      getItem(key) { return mockStorage[key] || null; },
      setItem(key, value) { mockStorage[key] = String(value); },
      removeItem(key) { delete mockStorage[key]; },
      clear() { for (const k in mockStorage) delete mockStorage[k]; }
    };

    const mockWindow = {
      localStorage: mockLocalStorage
    };

    const sampleDataCode = fs.readFileSync(path.join(__dirname, '../public/js/sample-data.js'), 'utf8');
    const vm = require('vm');
    vm.runInNewContext(sampleDataCode, {
      window: mockWindow,
      localStorage: mockLocalStorage,
      console: console
    });

    const Storage = mockWindow.StayviaStorage;
    const Auth = mockWindow.StayviaAuth;

    assert.ok(Storage, 'window.StayviaStorage must be defined in sample-data.js');
    assert.ok(Auth, 'window.StayviaAuth must be defined in sample-data.js');
    assert.ok(Array.isArray(Storage.photoPresets), 'Storage should define photoPresets');
    assert.strictEqual(Storage.photoPresets.length, 5, 'Should have 5 photo presets');

    // -------------------------------------------------------------------------
    // Sub-test A: Demo Auth Session Verification
    // -------------------------------------------------------------------------
    console.log('  Sub-test A: StayviaAuth Demo Session Management');
    assert.strictEqual(Auth.isLoggedIn(), false, 'Should initially be logged out');

    // Owner Login Simulation
    Auth.setUser({
      name: 'Rajesh Sharma',
      email: 'rajesh.owner.gwl@stayvia.example.com',
      role: 'owner',
      college: 'MITS Gwalior Partner'
    });
    assert.strictEqual(Auth.isLoggedIn(), true, 'Should be logged in');
    assert.strictEqual(Auth.isOwner(), true, 'Should be recognized as owner');
    assert.strictEqual(Auth.isStudent(), false, 'Should NOT be recognized as student');
    assert.strictEqual(Auth.getUser().name, 'Rajesh Sharma');

    // Student Login Simulation (Role Distinction)
    Auth.setUser({
      name: 'Aman Sharma',
      email: 'aman@mitsgwalior.in',
      role: 'student',
      college: 'MITS Gwalior'
    });
    assert.strictEqual(Auth.isOwner(), false, 'Student must NOT be treated as owner');
    assert.strictEqual(Auth.isStudent(), true, 'Student must be recognized as student');

    // Initial state check
    const initialOwnerProps = Storage.getOwnerListings();
    assert.strictEqual(initialOwnerProps.length, 0, 'Initial owner listings should be empty');

    const initialMerged = Storage.getAllAccommodations();
    assert.strictEqual(initialMerged.length, 6, 'Merged accommodations should initially have the 6 default sample stays');

    // Add New Owner Listing
    const newProp = Storage.addOwnerListing({
      name: "Gwalior Royal Boys PG (Demo)",
      type: "PG",
      locality: "Gola Ka Mandir",
      localityNote: "Located near MITS Gwalior Main Gate",
      address: "Race Course Road, Gola Ka Mandir, Gwalior",
      monthlyRent: 5500,
      status: "available",
      gender: "Boys",
      occupancy: "Double Sharing",
      availableRooms: 3,
      facilities: ["High-speed Wi-Fi", "Homestyle Food", "Power Backup"]
    });

    assert.ok(newProp.id >= 101, 'Generated ID should be >= 101 to avoid colliding with default sample IDs');
    assert.strictEqual(newProp.isOwnerListing, true, 'isOwnerListing flag must be true');
    assert.strictEqual(newProp.name, 'Gwalior Royal Boys PG (Demo)');

    // Duplicate Listing Prevention
    assert.throws(() => {
      Storage.addOwnerListing({
        name: "Gwalior Royal Boys PG (Demo)",
        locality: "Gola Ka Mandir",
        monthlyRent: 5500
      });
    }, (err) => {
      return err.code === 'DUPLICATE_LISTING';
    }, 'Must reject duplicate property title in the same locality');

    // Sign Out Check: Does NOT remove listings or inquiries
    Auth.signOut();
    assert.strictEqual(Auth.isLoggedIn(), false, 'Should be logged out after signOut');
    assert.strictEqual(Storage.getOwnerListings().length, 1, 'Owner listings must NOT be deleted upon sign out');

    // Merged catalog check: owner listing should appear first
    const afterAddMerged = Storage.getAllAccommodations();
    assert.strictEqual(afterAddMerged.length, 7, 'Catalog should now contain 7 listings (1 owner + 6 default)');
    assert.strictEqual(afterAddMerged[0].id, newProp.id, 'New owner listing should be at the top of the catalog');

    // Lookup by ID
    const found = Storage.getAccommodationById(newProp.id);
    assert.ok(found, 'Should find accommodation by new ID');
    assert.strictEqual(found.name, 'Gwalior Royal Boys PG (Demo)');

    // Toggle Availability (available -> occupied)
    const toggled = Storage.toggleAvailability(newProp.id);
    assert.strictEqual(toggled.status, 'occupied', 'Status should change to occupied');
    assert.strictEqual(Storage.getAccommodationById(newProp.id).status, 'occupied');

    // Toggle back (occupied -> available)
    const toggledBack = Storage.toggleAvailability(newProp.id);
    assert.strictEqual(toggledBack.status, 'available', 'Status should toggle back to available');

    // Update Property Fields
    const updated = Storage.updateOwnerListing(newProp.id, {
      monthlyRent: 6000,
      occupancy: "Single Room"
    });
    assert.strictEqual(updated.monthlyRent, 6000);
    assert.strictEqual(updated.occupancy, "Single Room");

    // Inquiries Logging & Retrieval
    Storage.saveInquiry({
      propertyId: newProp.id,
      propertyName: newProp.name,
      studentName: "Rohan Verma",
      studentEmail: "rohan@mitsgwalior.in",
      studentPhone: "9876543210",
      preferredDate: "2026-11-01",
      occupancyType: "Single Room"
    });

    const inquiries = Storage.getInquiries();
    assert.strictEqual(inquiries.length, 1, 'Inquiries count should be 1');
    assert.strictEqual(inquiries[0].studentName, 'Rohan Verma');
    assert.ok(inquiries[0].referenceNumber.startsWith('STAY-GWL-'), 'Inquiry reference number should be formatted');

    // Delete Owner Listing
    const deleted = Storage.deleteOwnerListing(newProp.id);
    assert.strictEqual(deleted, true);
    assert.strictEqual(Storage.getOwnerListings().length, 0, 'Owner listings should be 0 after deletion');
    assert.strictEqual(Storage.getAllAccommodations().length, 6, 'Merged catalog should cleanly revert to 6 default listings');
    assert.strictEqual(Storage.getAccommodationById(newProp.id), null, 'Deleted ID should return null');

    console.log('  ✅ Passed: StayviaStorage Add, Read, Update, Toggle, Inquiries & Delete verified.\n');

    // -------------------------------------------------------------------------
    // Test 4: REST API Owner Endpoints
    // -------------------------------------------------------------------------
    console.log('Test 4: Backend REST API Owner Endpoints');
    const apiPropsRes = await makeApiRequest('GET', '/api/owner/properties');
    assert.strictEqual(apiPropsRes.statusCode, 200);
    const apiPropsData = JSON.parse(apiPropsRes.body);
    assert.strictEqual(apiPropsData.success, true);
    assert.ok(Array.isArray(apiPropsData.data), 'Should return list of properties');

    // POST /api/owner/properties
    const postPropRes = await makeApiRequest('POST', '/api/owner/properties', {
      name: 'API Test Hostel',
      type: 'Hostel',
      locality: 'Anand Nagar',
      monthlyRent: 4800,
      gender: 'Girls'
    });
    assert.strictEqual(postPropRes.statusCode, 201);
    const createdProp = JSON.parse(postPropRes.body).data;
    assert.strictEqual(createdProp.name, 'API Test Hostel');
    assert.ok(createdProp.id >= 100);

    // PATCH /api/owner/properties/:id/availability
    const patchRes = await makeApiRequest('PATCH', `/api/owner/properties/${createdProp.id}/availability`, {
      status: 'occupied'
    });
    if (patchRes.statusCode !== 200) {
      console.log('PATCH response:', patchRes.statusCode, patchRes.body);
    }
    assert.strictEqual(patchRes.statusCode, 200);
    assert.strictEqual(JSON.parse(patchRes.body).data.status, 'occupied');

    // DELETE /api/owner/properties/:id
    const deleteRes = await makeApiRequest('DELETE', `/api/owner/properties/${createdProp.id}`);
    assert.strictEqual(deleteRes.statusCode, 200);
    assert.strictEqual(JSON.parse(deleteRes.body).success, true);

    console.log('  ✅ Passed: REST API owner endpoints verified.\n');

    console.log('🎉 All Owner Dashboard & Storage automated tests passed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

setTimeout(runTests, 500);
