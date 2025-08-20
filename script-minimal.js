// Minimal test script for modal functionality
console.log('Script loaded successfully');

// Global variables
let currentTool = null;

// Modal functionality
const modal = document.getElementById('tool-modal');
const closeBtn = document.querySelector('.close');
const toolContainer = document.getElementById('tool-container');

// Close modal when clicking X or outside modal
closeBtn.onclick = function() {
    modal.style.display = "none";
    resetTool();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        resetTool();
    }
}

// Tool opening function
function openTool(toolName) {
    console.log('Opening tool:', toolName);
    currentTool = toolName;
    
    const toolContent = getToolContent(toolName);
    console.log('Tool content length:', toolContent.length);
    toolContainer.innerHTML = toolContent;
    modal.style.display = "block";
    
    // Initialize tool-specific functionality
    initializeTool(toolName);
}

function resetTool() {
    currentTool = null;
    toolContainer.innerHTML = '';
}

function initializeTool(toolName) {
    switch(toolName) {
        case 'glossary-creator':
            // Already initialized in HTML
            break;
    }
}

function getToolContent(toolName) {
    const tools = {
        'glossary-creator': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Glossary Entry Creator</h2>
                    <p>Enter a term and let AI generate a professional definition, then publish to WordPress Glossary.</p>
                </div>
                <div id="glossary-content">
                    <div class="input-group">
                        <label for="glossary-term">Term <span style="color:red">*</span></label>
                        <input type="text" id="glossary-term" placeholder="Enter the term to define..." required>
                    </div>
                    <div class="input-group">
                        <label for="glossary-category">Category (optional)</label>
                        <input type="text" id="glossary-category" placeholder="e.g., Marketing, Technology, Business Strategy...">
                    </div>
                    <div class="input-group">
                        <label for="glossary-related-terms">Synonyms (optional)</label>
                        <input type="text" id="glossary-related-terms" placeholder="e.g., Industry analyst outreach, Analyst engagement, AR">
                    </div>
                    <div class="input-group">
                        <label for="glossary-author">Author (optional)</label>
                        <input type="text" id="glossary-author" placeholder="Your name or team">
                    </div>
                    <button class="btn" onclick="generateGlossaryDefinition()">Generate Definition with AI</button>
                    
                    <div id="glossary-definition-section" style="display: none; margin-top: 2rem;">
                        <div class="input-group">
                            <label for="glossary-definition">Definition <span style="color:red">*</span></label>
                            <textarea id="glossary-definition" rows="6" placeholder="AI-generated definition will appear here. You can edit it before publishing..." required></textarea>
                        </div>
                        <div style="margin-top: 1rem;">
                            <button class="btn" onclick="createGlossaryEntry()">Create Glossary Entry</button>
                            <button class="btn btn-secondary" onclick="regenerateDefinition()" style="margin-left: 0.5rem;">Regenerate Definition</button>
                        </div>
                    </div>
                    
                    <div id="glossary-result" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `
    };
    
    return tools[toolName] || '<div class="tool-container"><p>Tool not found.</p></div>';
}

// --- AI-Powered Glossary Definition Generation ---
async function generateGlossaryDefinition() {
    const term = document.getElementById('glossary-term').value.trim();
    const category = document.getElementById('glossary-category').value.trim();
    const relatedTerms = document.getElementById('glossary-related-terms').value.trim();
    
    // Validate required fields
    if (!term) {
        showGlossaryResult('Please enter a term to define.', 'error');
        return;
    }
    
    // Show loading state
    showGlossaryResult('Generating definition with AI...', 'loading');
    
    try {
        // Build the prompt for AI
        let prompt = `Create a professional glossary definition for the term "${term}" in the context of marketing, communications, and business strategy. `;
        
        if (category) {
            prompt += `Category: ${category}. `;
        }
        
        if (relatedTerms) {
            prompt += `Related terms/synonyms: ${relatedTerms}. `;
        }
        
        prompt += `The definition should be clear, concise, and professional. Write it in a way that would be suitable for a business glossary. Keep it to 1-2 sentences maximum.`;
        
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        if (response.ok && data.choices && data.choices[0] && data.choices[0].message) {
            const generatedDefinition = data.choices[0].message.content.trim();
            
            // Show the definition section and populate it
            document.getElementById('glossary-definition-section').style.display = 'block';
            document.getElementById('glossary-definition').value = generatedDefinition;
            
            showGlossaryResult(`
                <div style="color: #28a745; font-weight: 600; margin-bottom: 0.5rem;">✅ Definition generated successfully!</div>
                <div style="margin-bottom: 1rem;">Review and edit the definition above, then click "Create Glossary Entry" when ready.</div>
            `, 'success');
            
            // Scroll to the definition section
            document.getElementById('glossary-definition').scrollIntoView({ behavior: 'smooth' });
        } else {
            showGlossaryResult('Error: Could not generate definition. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error generating definition:', error);
        showGlossaryResult('Network error. Please check your connection and try again.', 'error');
    }
}

async function regenerateDefinition() {
    // Clear the current definition and regenerate
    document.getElementById('glossary-definition').value = '';
    await generateGlossaryDefinition();
}

async function createGlossaryEntry() {
    const term = document.getElementById('glossary-term').value.trim();
    const definition = document.getElementById('glossary-definition').value.trim();
    const category = document.getElementById('glossary-category').value.trim();
    const relatedTerms = document.getElementById('glossary-related-terms').value.trim();
    const author = document.getElementById('glossary-author').value.trim();
    
    // Validate required fields
    if (!term || !definition) {
        showGlossaryResult('Please fill in both the term and definition fields.', 'error');
        return;
    }
    
    // Show loading state
    showGlossaryResult('Creating glossary entry...', 'loading');
    
    try {
        const response = await fetch('/api/wordpress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                term,
                definition,
                category,
                relatedTerms,
                author
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showGlossaryResult(`
                <div style="color: #28a745; font-weight: 600; margin-bottom: 0.5rem;">✅ Glossary entry created successfully!</div>
                <div style="margin-bottom: 0.5rem;"><strong>Glossary ID:</strong> ${data.post.id}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${data.post.status}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Type:</strong> Glossary Entry</div>
                <div style="margin-bottom: 1rem;"><strong>Link:</strong> <a href="${data.post.link}" target="_blank">View in WordPress Glossary</a></div>
                <button class="btn btn-secondary" onclick="clearGlossaryForm()">Create Another Entry</button>
            `, 'success');
        } else {
            showGlossaryResult(`Error: ${data.error || 'Failed to create glossary entry'}`, 'error');
        }
    } catch (error) {
        console.error('Error creating glossary entry:', error);
        showGlossaryResult('Network error. Please check your connection and try again.', 'error');
    }
}

function showGlossaryResult(message, type) {
    const resultDiv = document.getElementById('glossary-result');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = message;
    resultDiv.className = `glossary-result ${type}`;
    
    // Add some basic styling
    if (type === 'error') {
        resultDiv.style.color = '#dc3545';
        resultDiv.style.fontWeight = '600';
    } else if (type === 'success') {
        resultDiv.style.color = '#28a745';
    } else if (type === 'loading') {
        resultDiv.style.color = '#007bff';
        resultDiv.style.fontStyle = 'italic';
    }
}

function clearGlossaryForm() {
    document.getElementById('glossary-term').value = '';
    document.getElementById('glossary-definition').value = '';
    document.getElementById('glossary-category').value = '';
    document.getElementById('glossary-related-terms').value = '';
    document.getElementById('glossary-author').value = '';
    document.getElementById('glossary-result').innerHTML = '';
    document.getElementById('glossary-definition-section').style.display = 'none';
}

console.log('openTool function defined:', typeof openTool);
