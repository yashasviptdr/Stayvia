const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('assert');

const CHROME_PATH = "C:\\Users\\ratne\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = 9224;
const TEMP_USER_DATA = path.join(os.tmpdir(), 'chrome-real-test-' + Date.now());

async function getWsUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${DEBUG_PORT}/json/list`, (res) => {
          let str = '';
          res.on('data', d => str += d);
          res.on('end', () => resolve(JSON.parse(str)));
        }).on('error', reject);
      });
      if (Array.isArray(data)) {
        const pageTarget = data.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          return pageTarget.webSocketDebuggerUrl;
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  throw new Error('Chrome remote debugger did not find a page target');
}

async function waitForReady(cdp) {
  for (let i = 0; i < 50; i++) {
    const state = await cdp.eval('document.readyState');
    const auth = await cdp.eval('typeof window.StayviaAuth');
    if ((state === 'complete' || state === 'interactive') && auth === 'object') {
      return { state, auth, attempts: i };
    }
    await new Promise(r => setTimeout(r, 100));
  }
  const finalState = await cdp.eval('document.readyState');
  const finalAuth = await cdp.eval('typeof window.StayviaAuth');
  return { state: finalState, auth: finalAuth, timeout: true };
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.id = 1;
    this.callbacks = new Map();
    this.pageLoadResolve = null;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired' && this.pageLoadResolve) {
        this.pageLoadResolve();
        this.pageLoadResolve = null;
      }
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async navigate(url) {
    const loadPromise = new Promise(resolve => {
      this.pageLoadResolve = resolve;
    });
    await this.send('Page.navigate', { url });
    await Promise.race([loadPromise, new Promise(r => setTimeout(r, 4000))]);
    await waitForReady(this);
  }
}

async function runRealBrowserVerification() {
  console.log('=============================================================');
  console.log('🌐 Starting Real Headless Chrome Comprehensive Browser Suite');
  console.log('=============================================================\n');

  fs.mkdirSync(TEMP_USER_DATA, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-proxy-server',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    'about:blank'
  ]);

  const consoleErrors = [];

  try {
    const wsUrl = await getWsUrl();
    console.log('✅ Connected to Chrome CDP target:', wsUrl);

    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);
    const cdp = new CdpClient(ws);

    // Track console errors and CSP violations
    const originalOnMessage = ws.onmessage;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
        const text = msg.params.args.map(a => a.value).join(' ');
        if (text.includes('Content Security Policy') || text.includes('CSP') || text.includes('error')) {
          consoleErrors.push(text);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text);
      }
      originalOnMessage(event);
    };

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Security.enable');

    // -------------------------------------------------------------------------
    // Test 1: Clean Incognito Session on Homepage
    // -------------------------------------------------------------------------
    console.log('\n--- Test 1: Clean Session Load on Homepage (http://localhost:3000/) ---');
    await cdp.navigate('http://localhost:3000/');
    await new Promise(r => setTimeout(r, 1200));

    let title = await cdp.eval('document.title');
    let authHtml = await cdp.eval('document.getElementById("navAuthArea") ? document.getElementById("navAuthArea").innerHTML : ""');
    let localUser = await cdp.eval('localStorage.getItem("stayvia_demo_user")');
    let sessionUser = await cdp.eval('sessionStorage.getItem("stayvia_demo_user")');
    let ownerLinkDisplay = await cdp.eval('document.getElementById("navOwnerDashboardLink") ? window.getComputedStyle(document.getElementById("navOwnerDashboardLink")).display : ""');

    console.log('Page Title:', title);
    assert.ok(authHtml.includes('id="navLoginBtn"'), 'Navbar must show Login button for unauthenticated visitor');
    assert.ok(authHtml.includes('id="navSignupBtn"'), 'Navbar must show Sign Up button for unauthenticated visitor');
    assert.strictEqual(localUser, null, 'localStorage stayvia_demo_user must be null');
    assert.strictEqual(sessionUser, null, 'sessionStorage stayvia_demo_user must be null');
    assert.strictEqual(ownerLinkDisplay, 'none', 'Owner Dashboard link must be hidden in navbar for logged-out visitor');
    console.log('✅ Test 1 Passed: Fresh visit is unauthenticated. Login & Sign Up shown. Owner Dashboard link is hidden.');

    // -------------------------------------------------------------------------
    // Test 2: Direct Access to /owner-dashboard while Logged Out
    // -------------------------------------------------------------------------
    console.log('\n--- Test 2: Access Control on /owner-dashboard while Logged Out ---');
    await cdp.navigate('http://localhost:3000/owner-dashboard');
    await new Promise(r => setTimeout(r, 1000));

    let protectedHidden = await cdp.eval('document.getElementById("protectedDashboardContent") ? document.getElementById("protectedDashboardContent").classList.contains("d-none") : false');
    let restrictedVisible = await cdp.eval('document.getElementById("accessRestrictedContent") ? !document.getElementById("accessRestrictedContent").classList.contains("d-none") : false');
    let restrictedText = await cdp.eval('document.getElementById("accessRestrictedContent") ? document.getElementById("accessRestrictedContent").innerText : ""');

    assert.ok(protectedHidden, 'Protected owner dashboard content MUST be hidden for logged-out visitors');
    assert.ok(restrictedVisible, 'Access restriction card MUST be visible for logged-out visitors');
    assert.ok(restrictedText.includes('Owner Dashboard Access') || restrictedText.includes('Authentication Required'), 'Restriction card must explain owner authentication is required');
    console.log('✅ Test 2 Passed: /owner-dashboard is protected. Sensitive stats & listings are hidden from unauthenticated guests.');

    // -------------------------------------------------------------------------
    // Test 3: Navigate to /login and verify no silent session
    // -------------------------------------------------------------------------
    console.log('\n--- Test 3: Navigating to /login (No Silent Auto-Login) ---');
    await cdp.navigate('http://localhost:3000/login');
    await new Promise(r => setTimeout(r, 800));

    localUser = await cdp.eval('localStorage.getItem("stayvia_demo_user")');
    sessionUser = await cdp.eval('sessionStorage.getItem("stayvia_demo_user")');
    assert.strictEqual(localUser, null, 'Visiting /login must NOT create a session');
    assert.strictEqual(sessionUser, null, 'Visiting /login must NOT create a session');
    console.log('✅ Test 3 Passed: /login does not silently create or restore any demo session.');

    // -------------------------------------------------------------------------
    // Test 4: Real Owner Login via Quick Fill
    // -------------------------------------------------------------------------
    console.log('\n--- Test 4: Real Owner Login Workflow ---');
    const ownerNavPromise = new Promise(resolve => {
      cdp.pageLoadResolve = resolve;
    });
    await cdp.eval('document.getElementById("quickFillOwner").click()');
    await Promise.race([ownerNavPromise, new Promise(r => setTimeout(r, 5000))]);
    await waitForReady(cdp);
    await new Promise(r => setTimeout(r, 1000));

    let currentUrl = await cdp.eval('window.location.href');
    assert.ok(currentUrl.includes('/owner-dashboard'), `Must redirect to /owner-dashboard (got: ${currentUrl})`);

    let dashProfileName = await cdp.eval('document.getElementById("ownerDisplayName") ? document.getElementById("ownerDisplayName").innerText : ""');
    protectedHidden = await cdp.eval('document.getElementById("protectedDashboardContent") ? document.getElementById("protectedDashboardContent").classList.contains("d-none") : true');
    assert.ok(dashProfileName.includes('Rajesh Sharma'), `Dashboard navbar must show Rajesh Sharma (got: "${dashProfileName}")`);
    assert.strictEqual(protectedHidden, false, 'Protected dashboard content MUST be visible for authenticated owner');
    console.log(`✅ Test 4 Passed: Logged in and redirected to ${currentUrl} as ${dashProfileName}. Full dashboard unlocked.`);

    // -------------------------------------------------------------------------
    // Test 5: Navigate to Homepage as Authenticated Owner
    // -------------------------------------------------------------------------
    console.log('\n--- Test 5: Homepage Navbar for Authenticated Owner ---');
    await cdp.navigate('http://localhost:3000/');
    await new Promise(r => setTimeout(r, 1000));

    authHtml = await cdp.eval('document.getElementById("navAuthArea") ? document.getElementById("navAuthArea").innerHTML : ""');
    ownerLinkDisplay = await cdp.eval('document.getElementById("navOwnerDashboardLink") ? window.getComputedStyle(document.getElementById("navOwnerDashboardLink")).display : ""');

    assert.ok(authHtml.includes('Rajesh Sharma'), 'Navbar must show owner name Rajesh Sharma');
    assert.ok(authHtml.includes('Owner'), 'Navbar must show Owner badge');
    assert.strictEqual(ownerLinkDisplay, 'block', 'Owner Dashboard link MUST be visible in homepage navbar for authenticated owner');
    console.log('✅ Test 5 Passed: Owner Dashboard link is visible and owner identity displayed in homepage navbar.');

    // -------------------------------------------------------------------------
    // Test 6: Sign Out from Homepage Navbar Dropdown
    // -------------------------------------------------------------------------
    console.log('\n--- Test 6: Sign Out via Homepage Dropdown (Testing Real Click & CSP) ---');
    // Click user dropdown
    await cdp.eval('document.getElementById("userMenuBtn").click()');
    await new Promise(r => setTimeout(r, 300));

    // Actually trigger sign out link
    let signOutResult = await cdp.eval(`(() => {
      const links = Array.from(document.querySelectorAll('.dropdown-item'));
      const signOutLink = links.find(l => l.innerText.includes('Sign Out'));
      if (!signOutLink) return 'not found';
      signOutLink.click();
      return 'clicked';
    })()`);
    assert.strictEqual(signOutResult, 'clicked', 'Sign out link must be found and clicked');
    await new Promise(r => setTimeout(r, 800));

    authHtml = await cdp.eval('document.getElementById("navAuthArea") ? document.getElementById("navAuthArea").innerHTML : ""');
    localUser = await cdp.eval('localStorage.getItem("stayvia_demo_user")');
    sessionUser = await cdp.eval('sessionStorage.getItem("stayvia_demo_user")');
    ownerLinkDisplay = await cdp.eval('document.getElementById("navOwnerDashboardLink") ? window.getComputedStyle(document.getElementById("navOwnerDashboardLink")).display : ""');

    assert.ok(authHtml.includes('id="navLoginBtn"'), 'Navbar must revert to Login button after sign out');
    assert.ok(authHtml.includes('id="navSignupBtn"'), 'Navbar must revert to Sign Up button after sign out');
    assert.strictEqual(localUser, null, 'localStorage must be null after sign out');
    assert.strictEqual(sessionUser, null, 'sessionStorage must be null after sign out');
    assert.strictEqual(ownerLinkDisplay, 'none', 'Owner Dashboard link must be hidden after sign out');
    console.log('✅ Test 6 Passed: Sign out successfully executed without CSP blocking. Session cleared, navbar reverted.');

    // -------------------------------------------------------------------------
    // Test 7: Hard Refresh of Homepage Preserves Logged-Out State
    // -------------------------------------------------------------------------
    console.log('\n--- Test 7: Hard Refresh Simulation on Homepage ---');
    const refreshPromise = new Promise(resolve => {
      cdp.pageLoadResolve = resolve;
    });
    await cdp.send('Page.reload', { ignoreCache: true });
    await Promise.race([refreshPromise, new Promise(r => setTimeout(r, 4000))]);
    await new Promise(r => setTimeout(r, 800));

    authHtml = await cdp.eval('document.getElementById("navAuthArea") ? document.getElementById("navAuthArea").innerHTML : ""');
    localUser = await cdp.eval('localStorage.getItem("stayvia_demo_user")');
    ownerLinkDisplay = await cdp.eval('document.getElementById("navOwnerDashboardLink") ? window.getComputedStyle(document.getElementById("navOwnerDashboardLink")).display : ""');

    assert.ok(authHtml.includes('id="navLoginBtn"'), 'After hard refresh, navbar still shows Login');
    assert.strictEqual(localUser, null, 'After hard refresh, localStorage remains null');
    assert.strictEqual(ownerLinkDisplay, 'none', 'After hard refresh, Owner Dashboard link remains hidden');
    console.log('✅ Test 7 Passed: Hard reload preserves logged-out state with zero zombie revival.');

    // -------------------------------------------------------------------------
    // Test 8: Navigate to /login and /signup (Ensure No Silent Reactivation)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 8: Navigate to /login and /signup ---');
    await cdp.navigate('http://localhost:3000/login');
    await new Promise(r => setTimeout(r, 600));
    assert.strictEqual(await cdp.eval('localStorage.getItem("stayvia_demo_user")'), null, 'Login page must not set storage');

    await cdp.navigate('http://localhost:3000/signup');
    await new Promise(r => setTimeout(r, 600));
    assert.strictEqual(await cdp.eval('localStorage.getItem("stayvia_demo_user")'), null, 'Signup page must not set storage');

    await cdp.navigate('http://localhost:3000/');
    await new Promise(r => setTimeout(r, 600));
    assert.strictEqual(await cdp.eval('localStorage.getItem("stayvia_demo_user")'), null, 'Return to homepage remains clean');
    console.log('✅ Test 8 Passed: Navigation between login/signup/home does not re-authenticate the user.');

    // -------------------------------------------------------------------------
    // Test 9: Protected Owner Access Removed After Logout
    // -------------------------------------------------------------------------
    console.log('\n--- Test 9: Verify Protected Owner Access Removed on /owner-dashboard ---');
    await cdp.navigate('http://localhost:3000/owner-dashboard');
    await new Promise(r => setTimeout(r, 800));

    protectedHidden = await cdp.eval('document.getElementById("protectedDashboardContent").classList.contains("d-none")');
    restrictedVisible = await cdp.eval('!document.getElementById("accessRestrictedContent").classList.contains("d-none")');
    assert.ok(protectedHidden, 'Protected owner dashboard content MUST be locked after sign out');
    assert.ok(restrictedVisible, 'Access restricted card must be shown after sign out');
    console.log('✅ Test 9 Passed: Protected owner access is fully revoked upon sign out.');

    // -------------------------------------------------------------------------
    // Test 10: Quick Demo Owner Sign In from Access Card & Sign Out from Dashboard
    // -------------------------------------------------------------------------
    console.log('\n--- Test 10: Quick Sign In from Access Card & Sign Out from Dashboard ---');
    // Click Demo Owner Quick Sign In on the access restriction card
    await cdp.eval(`(() => {
      const btn = document.querySelector('[data-action="quick-demo-owner"]');
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    dashProfileName = await cdp.eval('document.getElementById("ownerDisplayName") ? document.getElementById("ownerDisplayName").innerText : ""');
    protectedHidden = await cdp.eval('document.getElementById("protectedDashboardContent").classList.contains("d-none")');
    assert.ok(dashProfileName.includes('Rajesh Sharma'), 'Dashboard must show Rajesh Sharma after quick sign in');
    assert.strictEqual(protectedHidden, false, 'Protected content must be unlocked after quick sign in');
    console.log('✅ Quick Demo Owner Sign In successfully unlocked the dashboard.');

    // Now test Sign Out from the Owner Dashboard
    const logoutNavPromise = new Promise(resolve => {
      cdp.pageLoadResolve = resolve;
    });
    await cdp.eval('handleOwnerSignOut()');
    await Promise.race([logoutNavPromise, new Promise(r => setTimeout(r, 4000))]);
    await waitForReady(cdp);
    await new Promise(r => setTimeout(r, 800));

    currentUrl = await cdp.eval('window.location.href');
    localUser = await cdp.eval('localStorage.getItem("stayvia_demo_user")');
    assert.strictEqual(new URL(currentUrl).pathname, '/', 'Sign out from dashboard must redirect to homepage /');
    assert.strictEqual(localUser, null, 'localStorage must be null after dashboard sign out');
    console.log('✅ Test 10 Passed: Quick sign in unlocked dashboard; dashboard sign out cleanly redirected to / and wiped session.');

    // -------------------------------------------------------------------------
    // Test 11: Student Login & Role Separation
    // -------------------------------------------------------------------------
    console.log('\n--- Test 11: Student Login & Role Separation ---');
    await cdp.navigate('http://localhost:3000/login');

    const studentNavPromise = new Promise(resolve => {
      cdp.pageLoadResolve = resolve;
    });
    await cdp.eval('document.getElementById("quickFillStudent").click()');
    await Promise.race([studentNavPromise, new Promise(r => setTimeout(r, 5000))]);
    await waitForReady(cdp);
    await new Promise(r => setTimeout(r, 800));

    currentUrl = await cdp.eval('window.location.href');
    assert.strictEqual(new URL(currentUrl).pathname, '/', 'Student must be redirected to homepage /');

    authHtml = await cdp.eval('document.getElementById("navAuthArea").innerHTML');
    ownerLinkDisplay = await cdp.eval('document.getElementById("navOwnerDashboardLink") ? window.getComputedStyle(document.getElementById("navOwnerDashboardLink")).display : ""');

    assert.ok(authHtml.includes('Aman Sharma'), 'Student name Aman Sharma must appear in navbar');
    assert.ok(authHtml.includes('Student'), 'Student badge must appear in navbar');
    assert.strictEqual(ownerLinkDisplay, 'none', 'Student MUST NOT see Owner Dashboard link in navbar');
    console.log('✅ Student signed in. Shown as Student Scholar. Owner Dashboard link is hidden.');

    // Attempt direct navigation to /owner-dashboard as Student
    await cdp.navigate('http://localhost:3000/owner-dashboard');
    await new Promise(r => setTimeout(r, 800));

    protectedHidden = await cdp.eval('document.getElementById("protectedDashboardContent").classList.contains("d-none")');
    restrictedVisible = await cdp.eval('!document.getElementById("accessRestrictedContent").classList.contains("d-none")');
    restrictedText = await cdp.eval('document.getElementById("accessRestrictedContent").innerText');

    assert.ok(protectedHidden, 'Protected owner content MUST be hidden from students');
    assert.ok(restrictedVisible, 'Student access restriction card must be visible');
    assert.ok(restrictedText.includes('Student Account Detected'), 'Must explicitly indicate Student Account Detected');
    console.log('✅ Student blocked from /owner-dashboard with Student Account Detected notice.');

    // Sign out student
    await cdp.eval('handleOwnerSignOut()');
    await new Promise(r => setTimeout(r, 800));
    console.log('✅ Test 11 Passed: Student login, role separation, and owner route protection verified.');

    // -------------------------------------------------------------------------
    // Test 12: Console Errors & Network Security Check
    // -------------------------------------------------------------------------
    console.log('\n--- Test 12: Console Errors & CSP Verification ---');
    const cspViolations = consoleErrors.filter(e => e.includes('Content Security Policy') || e.includes('script-src-attr'));
    assert.strictEqual(cspViolations.length, 0, `There must be ZERO CSP violations (found: ${JSON.stringify(cspViolations)})`);
    console.log('✅ Test 12 Passed: Zero CSP violations or security blocks recorded.');

    console.log('\n=============================================================');
    console.log('🎉 ALL 12 REAL CHROME BROWSER TESTS PASSED WITH 100% SUCCESS!');
    console.log('=============================================================\n');

    ws.close();
  } finally {
    chromeProc.kill();
    try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch (e) {}
  }
}

runRealBrowserVerification().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Real Browser Verification Failed:', err);
  process.exit(1);
});
