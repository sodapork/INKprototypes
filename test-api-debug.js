// API Debug Script - Test the OpenAI endpoint
async function testOpenAIAPI() {
    console.log('Testing OpenAI API endpoint...');
    
    const testPrompt = "Hello, this is a test message.";
    
    try {
        // Test 1: Basic fetch with minimal headers
        console.log('Test 1: Basic fetch');
        const response1 = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: testPrompt })
        });
        
        console.log('Response 1 status:', response1.status);
        console.log('Response 1 headers:', Object.fromEntries(response1.headers.entries()));
        
        if (response1.ok) {
            const data1 = await response1.json();
            console.log('Response 1 data:', data1);
        } else {
            console.log('Response 1 error text:', await response1.text());
        }
        
    } catch (error) {
        console.error('Test 1 error:', error);
    }
    
    try {
        // Test 2: Fetch with additional headers
        console.log('\nTest 2: Fetch with additional headers');
        const response2 = await fetch('/api/openai', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            body: JSON.stringify({ prompt: testPrompt })
        });
        
        console.log('Response 2 status:', response2.status);
        console.log('Response 2 headers:', Object.fromEntries(response2.headers.entries()));
        
        if (response2.ok) {
            const data2 = await response2.json();
            console.log('Response 2 data:', data2);
        } else {
            console.log('Response 2 error text:', await response2.text());
        }
        
    } catch (error) {
        console.error('Test 2 error:', error);
    }
    
    try {
        // Test 3: Check if endpoint exists
        console.log('\nTest 3: Check endpoint existence');
        const response3 = await fetch('/api/openai', {
            method: 'GET'
        });
        
        console.log('GET Response status:', response3.status);
        console.log('GET Response headers:', Object.fromEntries(response3.headers.entries()));
        
    } catch (error) {
        console.error('Test 3 error:', error);
    }
    
    try {
        // Test 4: Check CORS preflight
        console.log('\nTest 4: CORS preflight check');
        const response4 = await fetch('/api/openai', {
            method: 'OPTIONS'
        });
        
        console.log('OPTIONS Response status:', response4.status);
        console.log('OPTIONS Response headers:', Object.fromEntries(response4.headers.entries()));
        
    } catch (error) {
        console.error('Test 4 error:', error);
    }
}

// Test WordPress API as well
async function testWordPressAPI() {
    console.log('\n\nTesting WordPress API endpoint...');
    
    try {
        const response = await fetch('/api/wordpress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                term: 'test', 
                definition: 'test definition' 
            })
        });
        
        console.log('WordPress API status:', response.status);
        console.log('WordPress API headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('WordPress API data:', data);
        } else {
            console.log('WordPress API error text:', await response.text());
        }
        
    } catch (error) {
        console.error('WordPress API error:', error);
    }
}

// Test the simple test endpoint
async function testTestAPI() {
    console.log('\n\nTesting Test API endpoint...');
    
    try {
        const response = await fetch('/api/test', {
            method: 'GET'
        });
        
        console.log('Test API status:', response.status);
        console.log('Test API headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('Test API data:', data);
        } else {
            console.log('Test API error text:', await response.text());
        }
        
    } catch (error) {
        console.error('Test API error:', error);
    }
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('API Debug Script Loaded');
    console.log('Current URL:', window.location.href);
    console.log('Current origin:', window.location.origin);
    
    // Add test buttons to the page
    const testDiv = document.createElement('div');
    testDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 10px; border-radius: 5px; z-index: 10000;';
    testDiv.innerHTML = `
        <div style="margin-bottom: 10px;">API Debug Tools</div>
        <button onclick="testOpenAIAPI()" style="margin: 2px; padding: 5px;">Test OpenAI</button>
        <button onclick="testWordPressAPI()" style="margin: 2px; padding: 5px;">Test WordPress</button>
        <button onclick="testTestAPI()" style="margin: 2px; padding: 5px;">Test API</button>
    `;
    document.body.appendChild(testDiv);
    
    // Auto-run tests after a delay
    setTimeout(() => {
        console.log('Auto-running API tests...');
        testOpenAIAPI();
        testWordPressAPI();
        testTestAPI();
    }, 2000);
});

// Make functions globally available
window.testOpenAIAPI = testOpenAIAPI;
window.testWordPressAPI = testWordPressAPI;
window.testTestAPI = testTestAPI;
