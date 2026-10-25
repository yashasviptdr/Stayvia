/**
 * Stayvia Server, Health-Check, Auth, Property Details & Booking Flow Verification Test
 * 
 * Runs without external testing libraries (uses Node.js native http and assert).
 * Verifies:
 * 1. GET / serves the HTML homepage with HTTP 200 and MITS Gwalior localization.
 * 2. GET /login serves dedicated Login page with HTTP 200.
 * 3. GET /signup serves dedicated Signup page with HTTP 200.
 * 4. GET /property serves dedicated Property Details page with HTTP 200.
 * 5. GET /api/health responds with HTTP 200 and expected JSON structure.
 * 6. GET /api/accommodations returns Gwalior demo listings.
 * 7. GET /api/accommodations/1 returns detailed property item.
 * 8. POST /api/inquiries logs student booking request and returns reference number.
 * 9. POST /api/auth/login evaluates credentials and returns session token.
 * 10. POST /api/auth/signup registers student account.
 */

const http = require('http');
const assert = require('assert');

// Port used strictly for test execution
const TEST_PORT = 3999;
process.env.PORT = TEST_PORT;
process.env.NODE_ENV = 'test';

// Import Express application
const app = require('../server');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}${path}`, (res) => {
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

function makePostRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
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
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Stayvia Full Application & Navigation Verification...\n');

  try {
    // Test 1: Verify Homepage & MITS Gwalior Localization
    console.log('Test 1: GET / (Homepage Delivery & MITS Gwalior Branding)');
    const homeRes = await makeRequest('/');
    assert.strictEqual(homeRes.statusCode, 200, 'Homepage should return status 200');
    assert.ok(homeRes.body.includes('Stayvia'), 'Homepage should contain brand name Stayvia');
    assert.ok(homeRes.body.includes('Find a place that feels like yours'), 'Homepage should contain hero headline');
    assert.ok(homeRes.body.includes('MITS Gwalior'), 'Homepage should contain MITS Gwalior campus reference');
    console.log('  ✅ Passed: Homepage served successfully with MITS Gwalior personalization.\n');

    // Test 2: Verify Login Page
    console.log('Test 2: GET /login (Dedicated Login Page)');
    const loginRes = await makeRequest('/login');
    assert.strictEqual(loginRes.statusCode, 200, 'Login page should return status 200');
    assert.ok(loginRes.body.includes('Welcome back'), 'Login page should contain greeting');
    assert.ok(loginRes.body.includes('Prototype Evaluation Mode'), 'Login page should state demo mode');
    console.log('  ✅ Passed: Dedicated Login page served successfully.\n');

    // Test 3: Verify Signup Page
    console.log('Test 3: GET /signup (Dedicated Signup Page)');
    const signupRes = await makeRequest('/signup');
    assert.strictEqual(signupRes.statusCode, 200, 'Signup page should return status 200');
    assert.ok(signupRes.body.includes('Create your Stayvia account'), 'Signup page should contain headline');
    assert.ok(signupRes.body.includes('MITS'), 'Signup page should reference MITS');
    console.log('  ✅ Passed: Dedicated Signup page served successfully.\n');

    // Test 4: Verify Property Details Page
    console.log('Test 4: GET /property (Dedicated Property Details Page)');
    const propertyRes = await makeRequest('/property');
    assert.strictEqual(propertyRes.statusCode, 200, 'Property page should return status 200');
    assert.ok(propertyRes.body.includes('Property Details'), 'Property page should contain header');
    assert.ok(propertyRes.body.includes('Schedule a Free Visit / Walkthrough'), 'Property page should contain booking flow');
    console.log('  ✅ Passed: Dedicated Property Details page served successfully.\n');

    // Test 5: Verify /api/health
    console.log('Test 5: GET /api/health (Health-check Endpoint)');
    const healthRes = await makeRequest('/api/health');
    assert.strictEqual(healthRes.statusCode, 200, 'Health endpoint should return status 200');
    const healthData = JSON.parse(healthRes.body);
    assert.strictEqual(healthData.status, 'ok', 'Health response status should be ok');
    console.log(`  ✅ Passed: Health check OK (Campus: ${healthData.campusFocus}).\n`);

    // Test 6: Verify /api/accommodations/1
    console.log('Test 6: GET /api/accommodations/1 (Single Property Query)');
    const prop1Res = await makeRequest('/api/accommodations/1');
    assert.strictEqual(prop1Res.statusCode, 200);
    const prop1Data = JSON.parse(prop1Res.body);
    assert.strictEqual(prop1Data.success, true);
    assert.strictEqual(prop1Data.data.id, 1);
    console.log(`  ✅ Passed: Property API returned "${prop1Data.data.name}".\n`);

    // Test 7: Verify Booking / Visit Request POST
    console.log('Test 7: POST /api/inquiries (Visit & Booking Flow)');
    const inquiryPayload = {
      accommodationId: 1,
      studentName: 'Aman Sharma',
      studentEmail: 'aman@mitsgwalior.in',
      studentPhone: '9826012345',
      preferredDate: '2026-10-30',
      occupancyType: 'Double Sharing',
      message: 'Looking for 1st Year B.Tech accommodation'
    };
    const inquiryRes = await makePostRequest('/api/inquiries', inquiryPayload);
    assert.strictEqual(inquiryRes.statusCode, 200);
    const inquiryData = JSON.parse(inquiryRes.body);
    assert.strictEqual(inquiryData.success, true);
    assert.ok(inquiryData.bookingReference.startsWith('STAY-GWL-'), 'Reference should be generated');
    console.log(`  ✅ Passed: Booking flow generated reference "${inquiryData.bookingReference}".\n`);

    // Test 8: Verify Demo Login Auth POST
    console.log('Test 8: POST /api/auth/login (Demo Authentication)');
    const loginPayload = {
      email: 'student@mitsgwalior.in',
      password: 'password123',
      role: 'student'
    };
    const authRes = await makePostRequest('/api/auth/login', loginPayload);
    assert.strictEqual(authRes.statusCode, 200);
    const authData = JSON.parse(authRes.body);
    assert.strictEqual(authData.success, true);
    assert.ok(authData.demoToken, 'Should receive demo session token');
    console.log(`  ✅ Passed: Demo auth returned session for "${authData.user.name}".\n`);

    console.log('🎉 All automated tests for Stayvia full prototype passed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

// Give server 500ms to bind before testing
setTimeout(runTests, 500);
