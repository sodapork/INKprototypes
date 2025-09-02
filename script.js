// Global variables
let currentTool = null;
let currentQuestion = 0;
let answers = {};

// Check for URL parameters to show specific tool
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    
    if (toolParam) {
        // Add embedded attribute to body for CSS styling
        document.body.setAttribute('data-embedded', 'true');
        
        // Hide the main page content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        
        // Hide the header and footer for clean embedding
        const header = document.querySelector('header');
        const footer = document.querySelector('.footer');
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        // Show only the requested tool
        openTool(toolParam);
        
        // Prevent modal behavior - show tool directly in page
        if (modal) {
            modal.style.display = 'block';
            modal.style.position = 'static';
            modal.style.backgroundColor = 'transparent';
            modal.style.padding = '0';
        }
        
        // Adjust modal content styling for embedded view
        if (toolContainer) {
            toolContainer.style.maxWidth = 'none';
            toolContainer.style.margin = '0';
            toolContainer.style.padding = '0';
        }
        
        // Hide the close button in embedded mode
        if (closeBtn) {
            closeBtn.style.display = 'none';
        }
    }
}

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
    currentQuestion = 0;
    answers = {};
    
    const toolContent = getToolContent(toolName);
    console.log('Tool content length:', toolContent.length);
    toolContainer.innerHTML = toolContent;
    modal.style.display = "block";
    
    // Initialize tool-specific functionality
    initializeTool(toolName);
}

function resetTool() {
    currentTool = null;
    currentQuestion = 0;
    answers = {};
    toolContainer.innerHTML = '';
}

function getToolContent(toolName) {
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/index.html$/, '/');
    const toolUrls = {
        'brand-alignment': baseUrl + '?tool=brand-alignment',
        'pov-builder': baseUrl + '?tool=pov-builder',
        'roi-calculator': baseUrl + '?tool=roi-calculator',
        'channel-optimizer': baseUrl + '?tool=channel-optimizer',
        'customer-quiz': baseUrl + '?tool=customer-quiz',
        'glossary-creator': baseUrl + '?tool=glossary-creator'
    };
    const iframeSnippet = `<iframe src=\"${toolUrls[toolName]}\" width=\"100%\" height=\"700\" style=\"border:none;\"></iframe>`;
    const embedSection = `
        <div class="embed-snippet" style="margin-top:2rem; background:#f8f9fa; border-radius:8px; padding:1.5rem; border:1px solid #e9ecef;">
            <div style="font-weight:600; margin-bottom:0.5rem;">Embed this tool on your site:</div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <input id="iframe-snippet" type="text" value="${iframeSnippet}" readonly style="flex:1; font-family:monospace; font-size:0.95rem; padding:0.5rem; border-radius:6px; border:1px solid #ccc; background:#fff;">
                <button class="btn" style="padding:0.5rem 1rem; font-size:0.95rem;" onclick="copyIframeSnippet()">Copy</button>
            </div>
            <div id="copy-confirm" style="color:#28a745; font-size:0.95rem; margin-top:0.5rem; display:none;">Copied!</div>
        </div>
    `;
    const tools = {
        'brand-alignment': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Brand Alignment Quiz</h2>
                    <p>In today's rapidly changing landscape, brands face constant pressure to take stands on issues. But not every issue deserves your brand's voice. This quiz helps you think strategically about when and how to engage with current issues that matter to your stakeholders.</p>
                </div>
                <div id="quiz-content"></div>
            </div>
        `,
        
        'pov-builder': `
            <div class="tool-container">
                <div class="tool-header" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h2>Issues Management Builder</h2>
                        <p>Develop your brand's strategic approach to managing and responding to current issues. Powered by AI.</p>
                    </div>
                    <span class="ai-tag">AI enabled</span>
                </div>
                <div id="pov-content">
                    <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #2196f3;">
                        <h4 style="margin-top: 0; color: #1976d2;">🎯 POV Builder Questions</h4>
                        <p style="margin-bottom: 0; color: #1976d2; font-size: 0.9rem;">Answer these strategic questions to build your comprehensive issues management strategy. Required fields are marked with an asterisk (*).</p>
                    </div>
                    
                    <div class="input-group">
                        <label for="thought-leadership-area">What do you want to be a thought leader on? <span style="color:red">*</span></label>
                        <textarea id="thought-leadership-area" rows="3" placeholder="Describe the specific area, topic, or issue where you want to establish thought leadership..." required></textarea>
                    </div>
                    <div class="input-group">
                        <label for="company-background">Who are you and what do you do? <span style="color:red">*</span></label>
                        <textarea id="company-background" rows="3" placeholder="Describe your company, your role, and your organization's mission..." required></textarea>
                    </div>
                    <div class="input-group">
                        <label for="specialization">What do you specialize in? <span style="color:red">*</span></label>
                        <textarea id="specialization" rows="2" placeholder="Describe your areas of expertise, unique capabilities, or specialized knowledge..." required></textarea>
                    </div>
                    <div class="input-group">
                        <label for="keyword-relevance">How relevant is this keyword or topic to your business?</label>
                        <textarea id="keyword-relevance" rows="2" placeholder="Explain how this topic connects to your business operations, values, or stakeholder interests..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="white-space">Where is the white space? (Market gap analysis)</label>
                        <textarea id="white-space" rows="3" placeholder="Describe the gap in the market of ideas, what's missing from current conversations, and your unique perspective that could fill this void..."></textarea>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                            <strong>Objective:</strong> Help you understand where the gap in the market of ideas is + your perspective to create something that is unique. Think about: What conversations are missing? What angles aren't being covered? What unique viewpoint could you bring that others aren't addressing?
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="term-assessment">Term assessment</label>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                            <strong>Assessment:</strong> The AI will analyze your inputs and determine how crowded this topic/term is on a scale of 1-10 (1 = not crowded, 10 = very crowded).
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem; color: #666;">
                                <span>1 - Not crowded</span>
                                <span>10 - Very crowded</span>
                            </div>
                            <div style="background: #e9ecef; height: 8px; border-radius: 4px; position: relative;">
                                <div id="crowding-scale" style="background: #007bff; height: 100%; border-radius: 4px; width: 0%; transition: width 0.3s ease;"></div>
                            </div>
                            <div id="crowding-score" style="text-align: center; margin-top: 0.5rem; font-weight: 600; color: #007bff;">AI will determine</div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="sme">Who is your SME (Subject Matter Expert)?</label>
                        <textarea id="sme" rows="2" placeholder="Identify the person or team with the deepest expertise on this topic within your organization..."></textarea>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                            <strong>Purpose:</strong> This helps us understand how to leverage your internal expertise and position them effectively in your thought leadership strategy.
                        </div>
                    </div>
                    <button class="btn" onclick="generateIssuesManagementStrategy()">Generate Issues Management Strategy</button>
                </div>
            </div>
        `,
        
        'roi-calculator': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>ROI Calculator</h2>
                    <p>Estimate potential returns from PR, content, and brand marketing investments.</p>
                </div>
                <div id="roi-content">
                    <div class="input-group">
                        <label for="budget">Marketing Budget ($)</label>
                        <input type="number" id="budget" placeholder="Enter your budget amount">
                    </div>
                    <div class="input-group">
                        <label for="campaign-type">Campaign Type</label>
                        <select id="campaign-type">
                            <option value="">Select campaign type...</option>
                            <option value="pr">Public Relations</option>
                            <option value="content">Content Marketing</option>
                            <option value="brand">Brand Awareness</option>
                            <option value="integrated">Integrated Campaign</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="industry">Industry</label>
                        <select id="industry">
                            <option value="">Select your industry...</option>
                            <option value="tech">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Financial Services</option>
                            <option value="retail">Retail & E-commerce</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="nonprofit">Nonprofit</option>
                            <option value="education">Education</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="food-beverage">Food & Beverage</option>
                            <option value="automotive">Automotive</option>
                            <option value="fashion-beauty">Fashion & Beauty</option>
                            <option value="travel-hospitality">Travel & Hospitality</option>
                            <option value="energy">Energy & Utilities</option>
                            <option value="legal">Legal Services</option>
                            <option value="consulting">Consulting</option>
                            <option value="media-entertainment">Media & Entertainment</option>
                            <option value="sports-fitness">Sports & Fitness</option>
                            <option value="pharmaceuticals">Pharmaceuticals</option>
                            <option value="logistics">Logistics & Transportation</option>
                            <option value="construction">Construction</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="government">Government & Public Sector</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="campaign-duration">Campaign Duration (months)</label>
                        <input type="number" id="campaign-duration" min="1" max="24" value="3">
                    </div>
                    <button class="btn" onclick="calculateROI()">Calculate ROI</button>
                </div>
            </div>
        `,
        
        'channel-optimizer': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Campaign Channel Optimizer</h2>
                    <p>Find the optimal mix of marketing channels for your specific goals and industry. This tool helps you allocate your marketing budget and resources across the most effective channels based on your objectives, audience, and industry context.</p>
                </div>
                
                <div class="context-section" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #007bff;">
                    <h4 style="margin-top: 0; color: #007bff;">🎯 Campaign Objectives Overview</h4>
                    <p style="margin-bottom: 1rem; color: #333;"><strong style="color: #333;">Brand Awareness:</strong> Reach new audiences and build recognition</p>
                    <p style="margin-bottom: 1rem; color: #333;"><strong style="color: #333;">Lead Generation:</strong> Capture qualified prospects for your sales funnel</p>
                    <p style="margin-bottom: 1rem; color: #333;"><strong style="color: #333;">Direct Sales:</strong> Drive immediate conversions and revenue</p>
                    <p style="margin-bottom: 1rem; color: #333;"><strong style="color: #333;">Audience Engagement:</strong> Build relationships and community</p>
                    <p style="margin-bottom: 0; color: #333;"><strong style="color: #333;">Thought Leadership:</strong> Position your brand as an industry expert</p>
                </div>
                
                <div id="channel-content">
                    <div class="input-group">
                        <label for="campaign-goal">Primary Campaign Goal <span style="color: #007bff;">*</span></label>
                        <select id="campaign-goal" onchange="updateGoalContext()">
                            <option value="">Select your primary goal...</option>
                            <option value="awareness">Brand Awareness</option>
                            <option value="leads">Lead Generation</option>
                            <option value="sales">Direct Sales</option>
                            <option value="engagement">Audience Engagement</option>
                            <option value="thought-leadership">Thought Leadership</option>
                        </select>
                        <div id="goal-context" style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; display: none;"></div>
                    </div>
                    
                    <div class="input-group">
                        <label for="target-audience-size">Target Audience Size <span style="color: #007bff;">*</span></label>
                        <select id="target-audience-size">
                            <option value="">Select audience size...</option>
                            <option value="local">Local/Regional</option>
                            <option value="national">National</option>
                            <option value="global">Global</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label for="budget-range">Budget Range <span style="color: #007bff;">*</span></label>
                        <select id="budget-range">
                            <option value="">Select budget range...</option>
                            <option value="low">Under $10K</option>
                            <option value="medium">$10K - $50K</option>
                            <option value="high">$50K - $200K</option>
                            <option value="enterprise">$200K+</option>
                        </select>
                    </div>
                    
                    <div class="input-group">
                        <label for="industry-focus">Industry Focus <span style="color: #007bff;">*</span></label>
                        <select id="industry-focus" onchange="updateIndustryContext()">
                            <option value="">Select your industry...</option>
                            <option value="tech">Technology</option>
                            <option value="energy">Energy & Utilities</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Financial Services</option>
                            <option value="retail">Retail & E-commerce</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="b2b">B2B Services</option>
                            <option value="b2c">B2C Consumer</option>
                            <option value="nonprofit">Nonprofit</option>
                            <option value="government">Government</option>
                            <option value="education">Education</option>
                            <option value="real-estate">Real Estate</option>
                            <option value="food-beverage">Food & Beverage</option>
                            <option value="automotive">Automotive</option>
                            <option value="fashion-beauty">Fashion & Beauty</option>
                            <option value="travel-hospitality">Travel & Hospitality</option>
                            <option value="legal">Legal Services</option>
                            <option value="consulting">Consulting</option>
                            <option value="media-entertainment">Media & Entertainment</option>
                            <option value="sports-fitness">Sports & Fitness</option>
                            <option value="pharmaceuticals">Pharmaceuticals</option>
                            <option value="logistics">Logistics & Transportation</option>
                            <option value="construction">Construction</option>
                            <option value="agriculture">Agriculture</option>
                        </select>
                        <div id="industry-context" style="font-size: 0.9rem; color: #666; margin-top: 0.5rem; display: none;"></div>
                    </div>
                    
                    <button class="btn" onclick="optimizeChannels()">Optimize Channel Mix</button>
                </div>
            </div>
        `,
        
        'customer-quiz': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Customer Knowledge Quiz</h2>
                    <p>Test how well you understand your target audience and identify knowledge gaps.</p>
                </div>
                <div id="customer-quiz-content">
                    <div class="question-container">
                        <div class="question">Select your target demographic:</div>
                        <div class="options">
                            <div class="option" onclick="selectOption('demographic', 'millennials')">Millennials (25-40)</div>
                            <div class="option" onclick="selectOption('demographic', 'gen-z')">Gen Z (16-24)</div>
                            <div class="option" onclick="selectOption('demographic', 'gen-x')">Gen X (41-56)</div>
                            <div class="option" onclick="selectOption('demographic', 'boomers')">Baby Boomers (57-75)</div>
                        </div>
                    </div>
                    <button class="btn" onclick="startCustomerQuiz()" id="start-quiz-btn" style="display: none;">Start Quiz</button>
                </div>
            </div>
        `,
        'pov-builder-2': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>POV Builder 2.0 <span class="ai-tag">Chatbot</span></h2>
                    <p>Chat with an AI to get tailored perspective and messaging guidance for your company on any current issue.</p>
                </div>
                <div id="pov2-chat" class="chatbot-container" style="background:#f8f9fa; border-radius:12px; padding:1.5rem; min-height:320px; margin-bottom:1.5rem; max-width:600px; margin-left:auto; margin-right:auto; box-shadow:0 2px 12px rgba(0,0,0,0.04);">
                    <!-- Chat bubbles will be rendered here -->
                </div>
                <div id="pov2-input-area" style="max-width:600px; margin:0 auto; display:flex; gap:0.5rem;">
                    <input id="pov2-user-input" type="text" class="chat-input" placeholder="Type your answer..." style="flex:1; padding:0.75rem; border-radius:6px; border:1.5px solid #ccc; font-size:1rem;">
                    <button class="btn" id="pov2-send-btn" onclick="pov2HandleUserInput()">Send</button>
                </div>
                <div style="text-align:center; margin-top:1.5rem;">
                    <button class="btn btn-secondary" onclick="pov2Restart()">Restart Conversation</button>
                </div>
            </div>
        `,
        
        'glossary-creator': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Glossary Entry Creator</h2>
                    <p>Enter a term and let AI generate a professional definition following INK's glossary format, then publish to WordPress Glossary.</p>
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
                    <div class="input-group">
                        <label for="glossary-notes">Notes for AI (optional)</label>
                        <textarea id="glossary-notes" rows="3" placeholder="Provide additional context, specific direction, or examples to help the AI generate a more accurate definition. For example: 'Focus on B2B marketing context' or 'Include examples of how companies use this technology'"></textarea>
                    </div>
                    <button class="btn" onclick="generateGlossaryDefinition()">Generate Definition with AI</button>
                    
                    <div id="glossary-definition-section" style="display: none; margin-top: 2rem;">
                        <div class="input-group">
                            <label for="glossary-definition">Definition <span style="color:red">*</span></label>
                            <textarea id="glossary-definition" rows="6" placeholder="AI-generated definition will appear here. You can edit it before publishing..." required></textarea>
                        </div>
                        
                        <div class="input-group" style="margin-top: 1rem;">
                            <label for="glossary-why-matters">Why it matters</label>
                            <textarea id="glossary-why-matters" rows="4" placeholder="AI-generated explanation of why this matters to businesses/marketers..."></textarea>
                        </div>
                        
                        <div class="input-group" style="margin-top: 1rem;">
                            <label for="glossary-ink-role">INK's role</label>
                            <textarea id="glossary-ink-role" rows="4" placeholder="AI-generated explanation of how INK helps companies with this..."></textarea>
                        </div>
                        
                        <div class="input-group" style="margin-top: 1rem;">
                            <label for="glossary-challenges">Challenges</label>
                            <textarea id="glossary-challenges" rows="4" placeholder="AI-generated list of challenges..."></textarea>
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

function initializeTool(toolName) {
    switch(toolName) {
        case 'brand-alignment':
            startBrandAlignmentQuiz();
            break;
        case 'pov-builder':
            // Already initialized in HTML
            break;
        case 'roi-calculator':
            // Already initialized in HTML
            break;
        case 'channel-optimizer':
            // Already initialized in HTML
            break;
        case 'customer-quiz':
            // Already initialized in HTML
            break;
        case 'pov-builder-2':
            // Already initialized in HTML
            break;
        case 'glossary-creator':
            // Already initialized in HTML
            break;
    }
}

// Brand Alignment Quiz Functions
function startBrandAlignmentQuiz() {
    currentQuestion = 0;
    answers = {};
    showIssueSelectionStep();
}

function showIssueSelectionStep() {
    const issueSelectionHTML = `
        <div class="issue-selection-container">
            <div class="step-indicator">
                <span class="step active">1. Select Issue</span>
                <span class="step">2. Assess Alignment</span>
                <span class="step">3. Get Results</span>
            </div>
            <div class="issue-selection-content">
                <h3>What issue are you considering?</h3>
                <p class="context-text">Before diving into alignment questions, let's identify the specific issue you're thinking about. This helps us provide more targeted guidance for your brand's unique situation.</p>
                
                <div class="input-group">
                    <label for="issue-category">Issue Category</label>
                    <select id="issue-category" onchange="updateIssueContext()">
                        <option value="">Select a category...</option>
                        <option value="cultural-movements">Cultural Movements</option>
                        <option value="geopolitical-crises">Geopolitical Crises and War</option>
                        <option value="climate-weather">Climate and Extreme Weather Events</option>
                        <option value="violence-terrorism">National and Domestic Violence, Terrorist Attacks</option>
                        <option value="political-infrastructure">Political, Infrastructure Issues</option>
                        <option value="health-community">Health and Community Crises</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="specific-issue">Describe the specific issue</label>
                    <textarea id="specific-issue" rows="3" placeholder="Describe the current issue, event, or topic you're considering commenting on..."></textarea>
                </div>
                
                <div class="input-group">
                    <label for="brand-context">Why are you considering this issue?</label>
                    <textarea id="brand-context" rows="2" placeholder="What's driving your interest in this issue? (e.g., stakeholder pressure, business impact, values alignment)"></textarea>
                </div>
                
                <button class="btn" onclick="proceedToAlignmentQuestions()">Continue to Alignment Assessment</button>
            </div>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = issueSelectionHTML;
}

function updateIssueContext() {
    const category = document.getElementById('issue-category').value;
    const contextText = document.querySelector('.context-text');
    
    const categoryContexts = {
        'cultural-movements': 'Cultural movements around gender, sexuality, and racial issues require brands to demonstrate genuine understanding and authentic commitment. Consider your brand\'s track record and whether you can contribute meaningfully to the conversation.',
        'geopolitical-crises': 'Geopolitical crises and war require extreme sensitivity and careful consideration. Assess whether your brand has relevant expertise or if commenting could be seen as opportunistic or insensitive.',
        'climate-weather': 'Climate and extreme weather events demand long-term commitment and action, not just statements. Consider whether your brand can demonstrate meaningful progress and ongoing dedication to environmental issues.',
        'violence-terrorism': 'Violence and terrorism issues require the highest level of sensitivity and care. Consider whether your brand has a legitimate role in this conversation or if staying silent might be more appropriate.',
        'political-infrastructure': 'Political and infrastructure issues like union strikes, political unrest, and transportation crises directly impact your customers and stakeholders. Focus on how the issue affects your community.',
        'health-community': 'Health and community crises like pandemics and poverty require brands to demonstrate genuine care and support. Consider your brand\'s role in the community and how you can provide real value.',
        'other': 'For other issues, focus on the direct connection to your brand\'s mission, values, and stakeholder interests.'
    };
    
    if (category && contextText) {
        contextText.innerHTML = categoryContexts[category] || 'Consider how this issue connects to your brand\'s core mission, values, and stakeholder interests.';
    }
}

function proceedToAlignmentQuestions() {
    const category = document.getElementById('issue-category').value;
    const specificIssue = document.getElementById('specific-issue').value.trim();
    const brandContext = document.getElementById('brand-context').value.trim();
    
    if (!category || !specificIssue) {
        alert('Please select an issue category and describe the specific issue.');
        return;
    }
    
    // Store the issue information
    answers['issue-category'] = category;
    answers['specific-issue'] = specificIssue;
    answers['brand-context'] = brandContext;
    
    // Proceed to alignment questions
    currentQuestion = 0;
    showBrandAlignmentQuestion();
}

function showBrandAlignmentQuestion() {
    const questions = getIssueQuestions();
    if (currentQuestion >= questions.length) {
        showBrandAlignmentResults();
        return;
    }
    const q = questions[currentQuestion];
    let optionsHTML = q.options.map((option, idx) => `
        <div class="option${answers[`question-${currentQuestion}`] === option.value ? ' selected' : ''}" data-value="${option.value}" data-idx="${idx}" onclick="selectSingleOption(${currentQuestion}, '${option.value}')">${option.text}</div>
    `).join('');
    const questionHTML = `
        <div class="question-container">
            <div class="step-indicator">
                <span class="step completed">1. Select Issue</span>
                <span class="step active">2. Assess Alignment</span>
                <span class="step">3. Get Results</span>
            </div>
            <div class="question">${q.question}</div>
            <div class="options">${optionsHTML}</div>
        </div>
    `;
    document.getElementById('quiz-content').innerHTML = questionHTML;
}

function selectSingleOption(questionIndex, value) {
    answers[`question-${questionIndex}`] = value;
    // Remove selected class from all options in this question
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
        if (currentQuestion < getIssueQuestions().length - 1) {
            nextBrandAlignmentQuestion();
        } else {
            // If it's the last question, show results
            showBrandAlignmentResults();
        }
    }, 500);
}

function nextBrandAlignmentQuestion() {
    currentQuestion++;
    showBrandAlignmentQuestion();
}

function getIssueQuestions() {
    // Only use universal questions for alignment
    return [
        {
            question: "How closely does this issue relate to your brand's core mission or values?",
            options: [
                { value: 'direct', text: 'Directly related' },
                { value: 'somewhat', text: 'Somewhat related' },
                { value: 'not', text: 'Not related' }
            ]
        },
        {
            question: "Do your customers or stakeholders expect your brand to take a stand on this issue?",
            options: [
                { value: 'expect', text: 'Yes, they expect it' },
                { value: 'maybe', text: 'Maybe, but not sure' },
                { value: 'no', text: 'No, they don\'t expect it' }
            ]
        },
        {
            question: "Has your brand previously addressed this issue or similar topics publicly?",
            options: [
                { value: 'frequent', text: 'Yes, frequently' },
                { value: 'occasional', text: 'Occasionally' },
                { value: 'never', text: 'Never' }
            ]
        },
        {
            question: "Does your brand have credible expertise or experience with this issue?",
            options: [
                { value: 'expert', text: 'Yes, we\'re recognized experts' },
                { value: 'some', text: 'Some experience' },
                { value: 'none', text: 'No expertise' }
            ]
        },
        {
            question: "Could commenting on this issue create significant risk or backlash for your brand?",
            options: [
                { value: 'low', text: 'Low risk' },
                { value: 'moderate', text: 'Moderate risk' },
                { value: 'high', text: 'High risk' }
            ]
        },
        {
            question: "Would your audience view your comment as authentic and consistent with your brand?",
            options: [
                { value: 'authentic', text: 'Definitely' },
                { value: 'maybe', text: 'Maybe' },
                { value: 'not', text: 'Probably not' }
            ]
        }
    ];
}

function showBrandAlignmentResults() {
    const issueCategory = answers['issue-category'];
    const specificIssue = answers['specific-issue'];
    const brandContext = answers['brand-context'];
    const results = calculateBrandAlignmentScore();
    
    const resultsHTML = `
        <div class="results">
            <div class="step-indicator">
                <span class="step completed">1. Select Issue</span>
                <span class="step completed">2. Assess Alignment</span>
                <span class="step active">3. Get Results</span>
            </div>
            
            <div class="issue-summary">
                <h4>Your Issue Analysis</h4>
                <p><strong>Category:</strong> ${getCategoryDisplayName(issueCategory)}</p>
                <p><strong>Specific Issue:</strong> ${specificIssue}</p>
                ${brandContext ? `<p><strong>Your Context:</strong> ${brandContext}</p>` : ''}
            </div>
            
            <h3>Your Brand Alignment Assessment</h3>
            <div class="score ${results.level}">${results.score}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${results.score}%"></div>
            </div>
            <p class="results-highlight"><strong>${results.title}</strong></p>
            <p class="results-highlight">${results.description}</p>
            
            <h4>Key Areas to Address:</h4>
            <ul>
                ${results.recommendations.map(rec => `<li class="results-highlight">${rec}</li>`).join('')}
            </ul>
            
            <div class="next-steps">
                <h4>Next Steps</h4>
                <p>Ready to develop your brand's stance on this issue? Download our comprehensive worksheet to guide your strategic thinking and action planning.</p>
                <div class="cta-buttons">
                    <button class="btn btn-primary" onclick="downloadWorksheet()">Download Strategic Issues Worksheet</button>
                    <button class="btn btn-secondary" onclick="window.open('https://ink-co.com/contact', '_blank')">Schedule a Consultation</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('quiz-content').innerHTML = resultsHTML;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'cultural-movements': 'Cultural Movements',
        'geopolitical-crises': 'Geopolitical Crises and War',
        'climate-weather': 'Climate and Extreme Weather Events',
        'violence-terrorism': 'National and Domestic Violence, Terrorist Attacks',
        'political-infrastructure': 'Political, Infrastructure Issues',
        'health-community': 'Health and Community Crises',
        'other': 'Other'
    };
    return categoryNames[category] || category;
}

function downloadWorksheet() {
    // Download the PDF worksheet
    const a = document.createElement('a');
    a.href = 'brand-issue-management-worksheet.pdf';
    a.download = 'INK_Brand_Issue_Management_Worksheet.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function calculateBrandAlignmentScore() {
    let score = 0;
    let totalQuestions = 0;
    let advice = [];
    let shouldComment = true;
    let maxScore = 0;

    // Define scoring for each answer type
    const answerScores = {
        best: [
            'direct', 'expect', 'frequent', 'expert', 'low', 'authentic'
        ],
        middle: [
            'somewhat', 'maybe', 'occasional', 'some', 'moderate'
        ],
        worst: [
            'not', 'no', 'never', 'none', 'high'
        ]
    };

    Object.keys(answers).forEach(key => {
        if (key.startsWith('question-')) {
            totalQuestions++;
            const answer = answers[key];
            if (answerScores.best.includes(answer)) {
                score += 2;
            } else if (answerScores.middle.includes(answer)) {
                score += 1;
            } // worst gets 0
            maxScore += 2;
            // Advice logic
            if (answer === 'not') advice.push('The issue is not closely related to your brand\'s core mission.');
            if (answer === 'no') advice.push('Your audience may not expect you to comment.');
            if (answer === 'never') advice.push('You have no track record on this issue.');
            if (answer === 'none') advice.push('You lack expertise on this issue.');
            if (answer === 'high') advice.push('There is a high risk of backlash.');
            if (answer === 'not') advice.push('Your comment may not be seen as authentic.');
        }
    });
    // Normalize score to 100%
    const finalScore = Math.round((score / maxScore) * 100);
    // Decision logic
    if (advice.length > 2 || finalScore < 40) {
        shouldComment = false;
    }
    let resultTitle, resultDesc, recommendations;
    if (shouldComment && finalScore >= 70) {
        resultTitle = 'Yes, you should comment.';
        resultDesc = 'Your brand is well-aligned with this issue. Proceed with a thoughtful, authentic statement.';
        recommendations = advice.length ? advice : ['No major gaps identified.'];
    } else if (shouldComment && finalScore >= 40) {
        resultTitle = 'Proceed with caution.';
        resultDesc = 'There are some alignment gaps. Address them before making a public statement.';
        recommendations = advice.length ? advice : ['Review your brand\'s alignment before commenting.'];
    } else {
        resultTitle = 'It may be best to stay silent.';
        resultDesc = 'Your brand is not well-aligned with this issue. Consider focusing on issues more relevant to your brand.';
        recommendations = advice.length ? advice : ['Significant gaps exist; commenting may not be advisable.'];
    }
    return {
        score: finalScore,
        level: finalScore >= 70 ? 'excellent' : finalScore >= 40 ? 'fair' : 'poor',
        title: resultTitle,
        description: resultDesc,
        recommendations
    };
}

// Issues Management Builder Functions (AI-powered)
async function generateIssuesManagementStrategy() {
    const thoughtLeadershipArea = document.getElementById('thought-leadership-area').value.trim();
    const companyBackground = document.getElementById('company-background').value.trim();
    const specialization = document.getElementById('specialization').value.trim();
    const keywordRelevance = document.getElementById('keyword-relevance').value.trim();
    const whiteSpace = document.getElementById('white-space').value.trim();
    const sme = document.getElementById('sme').value.trim();

    if (!thoughtLeadershipArea || !companyBackground || !specialization) {
        let missingFields = [];
        if (!thoughtLeadershipArea) missingFields.push('Thought Leadership Area');
        if (!companyBackground) missingFields.push('Company Background');
        if (!specialization) missingFields.push('Specialization');
        
        document.getElementById('pov-content').insertAdjacentHTML('beforeend', `
            <div class="results" style="color:red; margin-top:1rem; background: #fff5f5; padding: 1rem; border-radius: 6px; border: 1px solid #fed7d7;">
                <strong>Please fill in these required fields:</strong><br>
                ${missingFields.join(', ')}
            </div>
        `);
        return;
    }

    // Show loading spinner
    document.getElementById('pov-content').innerHTML = `
        <div style="text-align:center; padding:2rem;">
            <div class="loader" style="margin-bottom:1rem;"></div>
            <p style="color: #333; font-weight: 500;">Generating your issues management strategy...</p>
        </div>
    `;

    // Build the OpenAI prompt
    let prompt = `You are an issues management and thought leadership strategist. Based on the following information, provide a comprehensive issues management strategy that directly addresses each of these key areas:

1. **Thought Leadership Positioning**: How to establish authority in the specified area
2. **White Space Analysis**: How to identify and fill market gaps based on the white space analysis provided
3. **Content Strategy**: What types of content to create to establish thought leadership
4. **Messaging Framework**: Key talking points and positioning that leverage your specialization
5. **Stakeholder Engagement**: How to engage with different audiences based on your company background
6. **Risk Management**: Potential challenges and how to address them
7. **SME Utilization**: How to leverage your subject matter expert effectively
8. **Term Assessment Strategy**: How to approach the term based on whether it's a great term or crowded term

Company Background: ${companyBackground}
Thought Leadership Area: ${thoughtLeadershipArea}
Specialization: ${specialization}`;

    if (keywordRelevance) prompt += `\nKeyword Relevance: ${keywordRelevance}`;
    if (whiteSpace) prompt += `\nWhite Space Analysis: ${whiteSpace}`;
    if (sme) prompt += `\nSME: ${sme}`;

    prompt += `\n\nIMPORTANT: At the end of your response, provide a "Topic Crowding Assessment" with a score from 1-10 (1 = not crowded, 10 = very crowded) based on your analysis of the thought leadership area and market conditions. Explain your reasoning for this score.

Please structure your response to directly address how each of these inputs should inform the strategy. For each section, reference the specific information provided and explain how it shapes the recommendations. Format your response with clear sections and actionable recommendations. Focus on strategic guidance rather than tactical execution.`;

    try {
        // Call the Vercel serverless function instead of OpenAI directly
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        let strategy = '';
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            // Format the response with proper HTML structure and beautiful formatting
            strategy = data.choices[0].message.content
                // Convert markdown headers to styled HTML
                .replace(/^#\s+(.+)$/gm, '<h2 style="color: #2F2F2E; font-size: 1.8rem; font-weight: 700; margin: 2rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 3px solid #23B280; text-align: left;">$1</h2>')
                .replace(/^##\s+(.+)$/gm, '<h3 style="color: #007bff; font-size: 1.4rem; font-weight: 600; margin: 1.5rem 0 1rem 0; padding-left: 1rem; border-left: 4px solid #007bff;">$1</h3>')
                .replace(/^###\s+(.+)$/gm, '<h4 style="color: #2F2F2E; font-size: 1.2rem; font-weight: 600; margin: 1rem 0 0.5rem 0;">$1</h4>')
                // Convert bullet points to styled lists
                .replace(/^\s*-\s+\*\*(.+?)\*\*:\s*(.+)$/gm, '<div style="background: #f8f9fa; border-left: 4px solid #23B280; padding: 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0;"><strong style="color: #23B280; font-size: 1.1rem; display: block; margin-bottom: 0.5rem;">$1</strong><span style="color: #555; line-height: 1.6;">$2</span></div>')
                .replace(/^\s*-\s+(.+)$/gm, '<div style="background: #f8f9fa; border-left: 4px solid #dee2e6; padding: 0.75rem; margin: 0.5rem 0; border-radius: 0 6px 6px 0;"><span style="color: #555; line-height: 1.6;">$1</span></div>')
                // Convert bold text
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2F2F2E; font-weight: 600;">$1</strong>')
                // Convert line breaks to proper spacing
                .replace(/\n\n/g, '</div><div style="margin: 1rem 0;">')
                .replace(/\n/g, '<br>');
            
            // Wrap in a container with proper styling
            strategy = '<div style="color: #333; line-height: 1.7; font-size: 1rem;">' + strategy + '</div>';
        } else {
            strategy = '<span style="color:red;">No response from OpenAI. Please try again.</span>';
        }
        // Extract crowding score from AI response
        let crowdingScore = 'AI will determine';
        let crowdingPercentage = 0;
        
        // Look for crowding score in the AI response - be more specific about finding a 1-10 score
        const crowdingMatch = strategy.match(/Topic Crowding Assessment.*?(\d{1,2})\/10/i);
        if (crowdingMatch) {
            const score = parseInt(crowdingMatch[1]);
            // Ensure the score is within 1-10 range
            if (score >= 1 && score <= 10) {
                crowdingScore = score.toString();
                crowdingPercentage = (score / 10) * 100;
            } else {
                crowdingScore = 'AI will determine';
                crowdingPercentage = 0;
            }
        } else {
            // Try alternative patterns if the first one doesn't work
            const altMatch = strategy.match(/crowding.*?(\d{1,2})\s*out\s*of\s*10/i) || 
                           strategy.match(/score.*?(\d{1,2})\/10/i) ||
                           strategy.match(/crowding.*?(\d{1,2})/i);
            
            if (altMatch) {
                const score = parseInt(altMatch[1]);
                if (score >= 1 && score <= 10) {
                    crowdingScore = score.toString();
                    crowdingPercentage = (score / 10) * 100;
                }
            }
        }
        
        // Debug logging
        console.log('Crowding score extraction:', {
            originalStrategy: strategy.substring(0, 200) + '...',
            finalScore: crowdingScore,
            percentage: crowdingPercentage,
            isValid: parseInt(crowdingScore) >= 1 && parseInt(crowdingScore) <= 10
        });
        
        document.getElementById('pov-content').innerHTML = `
            <div class="results">
                <h3 style="color: #333;">Your Issues Management Strategy</h3>
                <div class="strategy-content" style="margin-bottom:2rem; padding: 2rem; background: white; border-radius: 12px; border: 1px solid #e9ecef; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">${strategy}</div>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #007bff;">
                    <h4 style="margin-top: 0; color: #007bff;">📋 POV Builder Inputs Summary</h4>
                    <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">These are the key inputs that shaped your strategy. Each answer directly influenced the recommendations above.</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">🎯 Thought Leadership Area:</strong><br>
                            <span style="color: #333;">${thoughtLeadershipArea}</span>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">🏢 Company Background:</strong><br>
                            <span style="color: #333;">${companyBackground}</span>
                        </div>
                        <div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">💡 Specialization:</strong><br>
                            <span style="color: #333;">${specialization}</span>
                        </div>
                        ${keywordRelevance ? `<div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">🔗 Keyword Relevance:</strong><br>
                            <span style="color: #333;">${keywordRelevance}</span>
                        </div>` : ''}
                        ${whiteSpace ? `<div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">⚪ White Space Analysis:</strong><br>
                            <span style="color: #333;">${whiteSpace}</span>
                        </div>` : ''}
                        <div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">📊 Topic Crowding Assessment:</strong><br>
                            <div style="margin-top: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem; color: #666;">
                                    <span>1 - Not crowded</span>
                                    <span>10 - Very crowded</span>
                                </div>
                                <div style="background: #e9ecef; height: 8px; border-radius: 4px; position: relative;">
                                    <div style="background: #007bff; height: 100%; border-radius: 4px; width: ${crowdingPercentage}%; transition: width 0.3s ease;"></div>
                                </div>
                                <div style="text-align: center; margin-top: 0.5rem; font-weight: 600; color: #007bff;">Score: ${crowdingScore}/10</div>
                            </div>
                        </div>
                        ${sme ? `<div style="background: white; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;">
                            <strong style="color: #007bff;">👨‍💼 SME:</strong><br>
                            <span style="color: #333;">${sme}</span>
                        </div>` : ''}
                    </div>
                </div>
                
                <div style="text-align:center;">
                    <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Professional Strategy Support</button>
                </div>
            </div>
        `;
    } catch (err) {
        document.getElementById('pov-content').innerHTML = `<div class="results"><p style="color:red;">Error generating strategy. Please try again later.</p></div>`;
    }
}

// ROI Calculator Functions
function calculateROI() {
    const budget = parseFloat(document.getElementById('budget').value);
    const campaignType = document.getElementById('campaign-type').value;
    const industry = document.getElementById('industry').value;
    const duration = parseInt(document.getElementById('campaign-duration').value);
    
    if (!budget || !campaignType || !industry || !duration) {
        alert('Please fill in all fields to calculate ROI.');
        return;
    }
    
    const roi = calculateROIEstimates(budget, campaignType, industry, duration);
    
    const resultsHTML = `
        <div class="results">
            <h3>ROI Projections</h3>
            <p><em>*All results are conservative estimates based on industry benchmarks. Actual results may vary based on campaign execution, market conditions, and other factors.</em></p>
            
            <div class="roi-metrics">
                <div class="metric">
                    <h4>Media Impressions</h4>
                    <div class="metric-value">${roi.impressions.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <h4>Website Traffic Uplift</h4>
                    <div class="metric-value">+${roi.trafficUplift}%</div>
                </div>
                <div class="metric">
                    <h4>Lead Generation</h4>
                    <div class="metric-value">${roi.leads.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <h4>Estimated Value</h4>
                    <div class="metric-value">$${roi.estimatedValue.toLocaleString()}</div>
                </div>
            </div>
            
            <h4>Key Success Factors:</h4>
            <ul>
                ${roi.successFactors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
            
            <div class="industry-insight" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4>Industry Insight:</h4>
                <p>${roi.industryInsights}</p>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Detailed Strategy</button>
            </div>
        </div>
    `;
    
    document.getElementById('roi-content').innerHTML = resultsHTML;
}

function calculateROIEstimates(budget, campaignType, industry, duration) {
    // Campaign type multipliers (realistic industry benchmarks)
    const campaignMultipliers = {
        'pr': { impressions: 25, traffic: 8, leads: 0.02, value: 2.5 },
        'content': { impressions: 15, traffic: 12, leads: 0.03, value: 3.2 },
        'brand': { impressions: 35, traffic: 6, leads: 0.01, value: 1.8 },
        'integrated': { impressions: 45, traffic: 15, leads: 0.04, value: 4.0 }
    };
    
    // Industry-specific multipliers based on typical marketing effectiveness
    // These multipliers reflect relative performance compared to average across industries
    const industryMultipliers = {
        'tech': { impressions: 1.3, traffic: 1.4, leads: 1.5, value: 1.6 },
        'healthcare': { impressions: 0.8, traffic: 0.7, leads: 1.2, value: 1.3 },
        'finance': { impressions: 0.7, traffic: 0.6, leads: 1.1, value: 1.4 },
        'retail': { impressions: 1.2, traffic: 1.3, leads: 1.4, value: 1.2 },
        'manufacturing': { impressions: 0.6, traffic: 0.5, leads: 0.9, value: 1.0 },
        'nonprofit': { impressions: 0.9, traffic: 0.8, leads: 0.8, value: 0.9 },
        'education': { impressions: 1.0, traffic: 1.1, leads: 1.0, value: 1.1 },
        'real-estate': { impressions: 1.1, traffic: 1.0, leads: 1.3, value: 1.2 },
        'food-beverage': { impressions: 1.4, traffic: 1.5, leads: 1.2, value: 1.1 },
        'automotive': { impressions: 1.0, traffic: 1.1, leads: 1.0, value: 1.2 },
        'fashion-beauty': { impressions: 1.5, traffic: 1.6, leads: 1.3, value: 1.2 },
        'travel-hospitality': { impressions: 1.3, traffic: 1.4, leads: 1.2, value: 1.1 },
        'energy': { impressions: 0.5, traffic: 0.4, leads: 0.8, value: 0.9 },
        'legal': { impressions: 0.8, traffic: 0.7, leads: 1.0, value: 1.2 },
        'consulting': { impressions: 0.9, traffic: 0.8, leads: 1.1, value: 1.3 },
        'media-entertainment': { impressions: 1.6, traffic: 1.7, leads: 1.4, value: 1.3 },
        'sports-fitness': { impressions: 1.3, traffic: 1.4, leads: 1.2, value: 1.1 },
        'pharmaceuticals': { impressions: 0.6, traffic: 0.5, leads: 0.9, value: 1.1 },
        'logistics': { impressions: 0.7, traffic: 0.6, leads: 1.0, value: 1.1 },
        'construction': { impressions: 0.5, traffic: 0.4, leads: 0.8, value: 0.9 },
        'agriculture': { impressions: 0.6, traffic: 0.5, leads: 0.9, value: 1.0 },
        'government': { impressions: 0.4, traffic: 0.3, leads: 0.7, value: 0.8 }
    };
    
    const campaignMult = campaignMultipliers[campaignType];
    const industryMult = industryMultipliers[industry] || { impressions: 1.0, traffic: 1.0, leads: 1.0, value: 1.0 };
    const durationMultiplier = duration / 3; // Normalize to 3 months
    
    return {
        impressions: Math.round(budget * campaignMult.impressions * industryMult.impressions * durationMultiplier),
        trafficUplift: Math.round(campaignMult.traffic * industryMult.traffic * durationMultiplier),
        leads: Math.round(budget * campaignMult.leads * industryMult.leads * durationMultiplier),
        estimatedValue: Math.round(budget * campaignMult.value * industryMult.value * durationMultiplier),
        successFactors: getIndustrySuccessFactors(industry),
        industryInsights: getIndustryInsights(industry)
    };
}

// Helper functions for industry-specific insights
function getIndustrySuccessFactors(industry) {
    const successFactors = {
        'tech': [
            'Thought leadership content and technical expertise',
            'Social media presence on LinkedIn and Twitter',
            'Product demos and case studies',
            'Participation in industry events and conferences'
        ],
        'healthcare': [
            'Educational content and patient-focused messaging',
            'Compliance with healthcare regulations',
            'Trust-building through expert credentials',
            'Community engagement and health awareness'
        ],
        'finance': [
            'Regulatory compliance and security messaging',
            'Educational financial content',
            'Trust and credibility building',
            'Professional networking and referrals'
        ],
        'retail': [
            'Visual content and product showcases',
            'Customer reviews and testimonials',
            'Seasonal and trend-based campaigns',
            'Social commerce and influencer partnerships'
        ],
        'manufacturing': [
            'Technical specifications and quality content',
            'B2B networking and trade shows',
            'Case studies and ROI demonstrations',
            'Industry certifications and standards'
        ],
        'nonprofit': [
            'Storytelling and impact narratives',
            'Donor engagement and transparency',
            'Community partnerships and events',
            'Social media advocacy campaigns'
        ],
        'education': [
            'Student success stories and testimonials',
            'Educational content and thought leadership',
            'Community engagement and partnerships',
            'Digital marketing and social media presence'
        ],
        'real-estate': [
            'Property showcases and virtual tours',
            'Local market insights and trends',
            'Client testimonials and referrals',
            'Community involvement and networking'
        ],
        'food-beverage': [
            'Visual content and food photography',
            'Customer reviews and social proof',
            'Local partnerships and events',
            'Social media engagement and user-generated content'
        ],
        'automotive': [
            'Vehicle showcases and specifications',
            'Customer reviews and testimonials',
            'Service and maintenance content',
            'Local community engagement'
        ],
        'fashion-beauty': [
            'Visual content and lifestyle imagery',
            'Influencer partnerships and collaborations',
            'Trend forecasting and style guides',
            'Social media engagement and user-generated content'
        ],
        'travel-hospitality': [
            'Destination photography and videos',
            'Customer reviews and travel stories',
            'Local partnerships and experiences',
            'Social media engagement and travel inspiration'
        ],
        'energy': [
            'Sustainability and environmental messaging',
            'Technical expertise and innovation',
            'Regulatory compliance and safety',
            'Community engagement and education'
        ],
        'legal': [
            'Expert legal insights and thought leadership',
            'Client testimonials and case studies',
            'Professional networking and referrals',
            'Educational content and legal updates'
        ],
        'consulting': [
            'Thought leadership and industry expertise',
            'Case studies and client success stories',
            'Professional networking and speaking engagements',
            'Educational content and white papers'
        ],
        'media-entertainment': [
            'Content creation and storytelling',
            'Celebrity partnerships and collaborations',
            'Social media engagement and viral content',
            'Event marketing and experiential campaigns'
        ],
        'sports-fitness': [
            'Athlete partnerships and endorsements',
            'Community engagement and events',
            'Educational fitness content',
            'Social media challenges and user engagement'
        ],
        'pharmaceuticals': [
            'Educational health content',
            'Regulatory compliance and safety messaging',
            'Healthcare professional partnerships',
            'Patient education and support programs'
        ],
        'logistics': [
            'Efficiency and reliability messaging',
            'Technology and innovation content',
            'Customer testimonials and case studies',
            'Industry partnerships and trade shows'
        ],
        'construction': [
            'Project showcases and before/after content',
            'Safety and quality messaging',
            'Client testimonials and referrals',
            'Industry certifications and partnerships'
        ],
        'agriculture': [
            'Sustainability and environmental messaging',
            'Educational farming content',
            'Community partnerships and local engagement',
            'Technology and innovation in agriculture'
        ],
        'government': [
            'Transparency and public service messaging',
            'Community engagement and outreach',
            'Educational content and public awareness',
            'Partnerships with local organizations'
        ]
    };
    
    return successFactors[industry] || [
        'Consistent messaging across all channels',
        'Regular measurement and optimization',
        'Strong content quality and relevance',
        'Active engagement with target audience'
    ];
}

function getIndustryInsights(industry) {
    const insights = {
        'tech': 'Technology companies typically see higher engagement on LinkedIn and Twitter, with thought leadership content driving the most leads.',
        'healthcare': 'Healthcare marketing requires careful compliance with regulations while building trust through educational content.',
        'finance': 'Financial services benefit from educational content that builds trust and demonstrates expertise.',
        'retail': 'Retail and e-commerce thrive on visual content and social proof, with Instagram and TikTok being key channels.',
        'manufacturing': 'B2B manufacturing companies often see better results from trade shows and technical content.',
        'nonprofit': 'Nonprofits benefit most from storytelling and impact narratives that connect emotionally with donors.',
        'education': 'Educational institutions see success through student testimonials and thought leadership content.',
        'real-estate': 'Real estate marketing is highly visual and local, with virtual tours and market insights driving engagement.',
        'food-beverage': 'Food and beverage companies excel with visual content and user-generated content on social media.',
        'automotive': 'Automotive marketing benefits from vehicle showcases and customer testimonials.',
        'fashion-beauty': 'Fashion and beauty brands thrive on visual content and influencer partnerships.',
        'travel-hospitality': 'Travel companies benefit from destination content and customer travel stories.',
        'energy': 'Energy companies focus on sustainability messaging and technical expertise.',
        'legal': 'Legal services benefit from thought leadership and client testimonials.',
        'consulting': 'Consulting firms excel with case studies and thought leadership content.',
        'media-entertainment': 'Media and entertainment companies thrive on content creation and celebrity partnerships.',
        'sports-fitness': 'Sports and fitness brands benefit from athlete partnerships and community engagement.',
        'pharmaceuticals': 'Pharmaceutical companies require careful regulatory compliance while educating patients.',
        'logistics': 'Logistics companies focus on efficiency and reliability messaging.',
        'construction': 'Construction companies benefit from project showcases and safety messaging.',
        'agriculture': 'Agriculture companies emphasize sustainability and innovation in their marketing.',
        'government': 'Government agencies focus on transparency and public service messaging.'
    };
    
    return insights[industry] || 'Focus on consistent messaging, quality content, and audience engagement for best results.';
}

// Channel Optimizer Functions
function updateGoalContext() {
    const goal = document.getElementById('campaign-goal').value;
    const contextDiv = document.getElementById('goal-context');
    
    const goalContexts = {
        'awareness': 'Focus on broad reach channels like social media, PR, and content marketing. Prioritize platforms where your target audience spends time.',
        'leads': 'Emphasize content marketing, email campaigns, and targeted social advertising. Focus on lead capture and nurturing strategies.',
        'sales': 'Prioritize direct response channels like paid advertising, email marketing, and sales enablement content. Focus on conversion optimization.',
        'engagement': 'Build community through social media, events, and interactive content. Focus on two-way communication and relationship building.',
        'thought-leadership': 'Leverage PR, content marketing, speaking opportunities, and industry publications. Focus on demonstrating expertise and authority.'
    };
    
    if (goal && contextDiv) {
        contextDiv.innerHTML = goalContexts[goal] || '';
        contextDiv.style.display = 'block';
    } else if (contextDiv) {
        contextDiv.style.display = 'none';
    }
}

function updateIndustryContext() {
    const industry = document.getElementById('industry-focus').value;
    const contextDiv = document.getElementById('industry-context');
    
    const industryContexts = {
        'tech': 'Technology companies excel with thought leadership content, LinkedIn marketing, and industry events. Focus on innovation and technical expertise.',
        'energy': 'Energy companies benefit from sustainability messaging, regulatory compliance content, and community engagement. Focus on trust and environmental responsibility.',
        'healthcare': 'Healthcare marketing requires compliance with regulations, educational content, and trust-building. Focus on patient education and professional credentials.',
        'finance': 'Financial services benefit from educational content, regulatory compliance, and trust-building. Focus on security and expertise.',
        'retail': 'Retail thrives on visual content, social proof, and e-commerce optimization. Focus on customer reviews and social commerce.',
        'manufacturing': 'B2B manufacturing benefits from technical content, trade shows, and case studies. Focus on quality and ROI demonstrations.',
        'b2b': 'B2B services excel with thought leadership, LinkedIn marketing, and industry publications. Focus on expertise and relationship building.',
        'b2c': 'B2C consumer brands benefit from social media, influencer partnerships, and emotional storytelling. Focus on brand personality and engagement.',
        'nonprofit': 'Nonprofits excel with storytelling, community engagement, and social media advocacy. Focus on impact and donor relationships.',
        'government': 'Government agencies focus on transparency, public service messaging, and community engagement. Focus on accessibility and trust.',
        'education': 'Educational institutions benefit from student success stories, thought leadership, and community partnerships. Focus on outcomes and innovation.',
        'real-estate': 'Real estate marketing is highly visual and local. Focus on property showcases, market insights, and community involvement.',
        'food-beverage': 'Food and beverage brands excel with visual content, user-generated content, and local partnerships. Focus on experience and community.',
        'automotive': 'Automotive marketing benefits from vehicle showcases, customer testimonials, and service content. Focus on reliability and innovation.',
        'fashion-beauty': 'Fashion and beauty brands thrive on visual content, influencer partnerships, and trend forecasting. Focus on lifestyle and aspiration.',
        'travel-hospitality': 'Travel companies benefit from destination content, customer stories, and experiential marketing. Focus on adventure and relaxation.',
        'legal': 'Legal services benefit from thought leadership, client testimonials, and educational content. Focus on expertise and trust.',
        'consulting': 'Consulting firms excel with case studies, thought leadership, and speaking engagements. Focus on results and expertise.',
        'media-entertainment': 'Media and entertainment companies thrive on content creation, celebrity partnerships, and social media. Focus on entertainment and engagement.',
        'sports-fitness': 'Sports and fitness brands benefit from athlete partnerships, community events, and motivational content. Focus on performance and community.',
        'pharmaceuticals': 'Pharmaceutical companies require regulatory compliance, educational content, and healthcare partnerships. Focus on safety and innovation.',
        'logistics': 'Logistics companies focus on efficiency, reliability, and technology innovation. Focus on operational excellence and customer service.',
        'construction': 'Construction companies benefit from project showcases, safety messaging, and client testimonials. Focus on quality and reliability.',
        'agriculture': 'Agriculture companies emphasize sustainability, innovation, and community partnerships. Focus on environmental responsibility and technology.'
    };
    
    if (industry && contextDiv) {
        contextDiv.innerHTML = industryContexts[industry] || '';
        contextDiv.style.display = 'block';
    } else if (contextDiv) {
        contextDiv.style.display = 'none';
    }
}

function optimizeChannels() {
    const goal = document.getElementById('campaign-goal').value;
    const audienceSize = document.getElementById('target-audience-size').value;
    const budgetRange = document.getElementById('budget-range').value;
    const industry = document.getElementById('industry-focus').value;
    
    if (!goal || !audienceSize || !budgetRange || !industry) {
        alert('Please fill in all fields to optimize your channel mix.');
        return;
    }
    
    const optimization = getChannelOptimization(goal, audienceSize, budgetRange, industry);
    
    const resultsHTML = `
        <div class="results">
            <div class="results-header" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.8rem;">Your Optimal Channel Mix</h3>
                <p style="margin: 0; font-size: 1.1rem; opacity: 0.9;">Based on your ${goal} objectives, ${industry} industry focus, and ${budgetRange} budget</p>
            </div>
            
            <div class="strategy-summary" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid #28a745;">
                <h4 style="margin-top: 0; color: #28a745;">📊 Strategy Overview</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #007bff;">${goal.charAt(0).toUpperCase() + goal.slice(1)}</div>
                        <div style="font-size: 0.9rem; color: #666;">Primary Goal</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #007bff;">${industry.charAt(0).toUpperCase() + industry.slice(1)}</div>
                        <div style="font-size: 0.9rem; color: #666;">Industry Focus</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #007bff;">${budgetRange.charAt(0).toUpperCase() + budgetRange.slice(1)}</div>
                        <div style="font-size: 0.9rem; color: #666;">Budget Range</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #007bff;">${audienceSize.charAt(0).toUpperCase() + audienceSize.slice(1)}</div>
                        <div style="font-size: 0.9rem; color: #666;">Audience Size</div>
                    </div>
                </div>
            </div>
            
            <div class="chart-container" style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <h4 style="margin-top: 0; color: #333; text-align: center;">Channel Allocation Breakdown</h4>
                <canvas id="channelChart" style="max-height: 400px;"></canvas>
            </div>
            
            <div class="channel-breakdown" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                ${optimization.channels.map((channel, index) => `
                    <div class="channel-item" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid ${getChannelColor(index)};">
                        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${getChannelColor(index)}; margin-right: 0.75rem;"></div>
                            <h4 style="margin: 0; color: #333;">${channel.name} (${channel.percentage}%)</h4>
                        </div>
                        <p style="color: #666; margin-bottom: 1rem; font-style: italic;">${channel.description}</p>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
                            <h5 style="margin: 0 0 0.5rem 0; color: #333; font-size: 0.9rem;">Key Activities:</h5>
                            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem;">
                                ${channel.activities.map(activity => `<li style="margin-bottom: 0.25rem; color: #333;">${activity}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="recommendations-section" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h4 style="margin-top: 0; color: #333; text-align: center;">🎯 Strategic Recommendations</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${optimization.recommendations.map((rec, index) => `
                        <div style="background: white; padding: 1rem; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
                            <div style="display: flex; align-items: flex-start;">
                                <span style="background: #007bff; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; margin-right: 0.75rem; flex-shrink: 0;">${index + 1}</span>
                                <span style="color: #333; font-size: 0.95rem;">${rec}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="next-steps" style="background: #e8f4fd; padding: 2rem; border-radius: 12px; text-align: center; border: 2px solid #007bff;">
                <h4 style="margin-top: 0; color: #007bff;">🚀 Ready to Execute Your Strategy?</h4>
                <p style="color: #333; margin-bottom: 1.5rem;">Get expert guidance to implement this channel mix and maximize your campaign performance.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')" style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Get Custom Strategy</button>
                    <button class="btn btn-secondary" onclick="downloadChannelStrategy()" style="background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer;">Download Strategy PDF</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('channel-content').innerHTML = resultsHTML;
    
    // Create chart
    createChannelChart(optimization.channels);
}

function getChannelColor(index) {
    const colors = [
        '#007bff', // Blue
        '#28a745', // Green
        '#ffc107', // Yellow
        '#dc3545', // Red
        '#6f42c1', // Purple
        '#fd7e14', // Orange
        '#20c997', // Teal
        '#e83e8c', // Pink
        '#6c757d', // Gray
        '#17a2b8'  // Cyan
    ];
    return colors[index % colors.length];
}

function downloadChannelStrategy() {
    // Create a simple text-based strategy document
    const goal = document.getElementById('campaign-goal').value;
    const audienceSize = document.getElementById('target-audience-size').value;
    const budgetRange = document.getElementById('budget-range').value;
    const industry = document.getElementById('industry-focus').value;
    
    const optimization = getChannelOptimization(goal, audienceSize, budgetRange, industry);
    
    let content = `CHANNEL CAMPAIGN STRATEGY\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `CAMPAIGN PARAMETERS:\n`;
    content += `Primary Goal: ${goal.charAt(0).toUpperCase() + goal.slice(1)}\n`;
    content += `Industry: ${industry.charAt(0).toUpperCase() + industry.slice(1)}\n`;
    content += `Budget Range: ${budgetRange.charAt(0).toUpperCase() + budgetRange.slice(1)}\n`;
    content += `Audience Size: ${audienceSize.charAt(0).toUpperCase() + audienceSize.slice(1)}\n\n`;
    
    content += `OPTIMAL CHANNEL MIX:\n`;
    optimization.channels.forEach(channel => {
        content += `\n${channel.name} (${channel.percentage}%)\n`;
        content += `Description: ${channel.description}\n`;
        content += `Key Activities:\n`;
        channel.activities.forEach(activity => {
            content += `  • ${activity}\n`;
        });
    });
    
    content += `\nSTRATEGIC RECOMMENDATIONS:\n`;
    optimization.recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec}\n`;
    });
    
    content += `\n---\nGenerated by INK's Channel Campaign Optimizer\nFor professional strategy support, visit: https://ink-co.com/contact`;
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `channel-strategy-${goal}-${industry}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function getChannelOptimization(goal, audienceSize, budgetRange, industry) {
    const channelMixes = {
        'awareness': {
            channels: [
                { name: 'Social Media', percentage: 35, description: 'Build brand awareness through engaging content', activities: ['Organic social posts', 'Influencer partnerships', 'Social advertising', 'Community building'] },
                { name: 'PR & Media', percentage: 25, description: 'Earned media coverage and thought leadership', activities: ['Press releases', 'Media outreach', 'Thought leadership articles', 'Industry publications'] },
                { name: 'Content Marketing', percentage: 25, description: 'Educational and engaging content', activities: ['Blog posts', 'Infographics', 'Video content', 'SEO optimization'] },
                { name: 'Events', percentage: 15, description: 'Direct audience engagement', activities: ['Webinars', 'Industry events', 'Brand activations', 'Networking'] }
            ]
        },
        'leads': {
            channels: [
                { name: 'Content Marketing', percentage: 30, description: 'Lead generation through valuable content', activities: ['Gated content', 'Email newsletters', 'SEO optimization', 'Case studies'] },
                { name: 'Social Media', percentage: 25, description: 'Social selling and lead nurturing', activities: ['LinkedIn outreach', 'Social advertising', 'Community building', 'Lead magnets'] },
                { name: 'Email Marketing', percentage: 20, description: 'Direct lead nurturing', activities: ['Email campaigns', 'Lead scoring', 'Automation', 'Drip campaigns'] },
                { name: 'PR & Media', percentage: 15, description: 'Credibility and trust building', activities: ['Industry publications', 'Expert quotes', 'Case studies', 'Media interviews'] },
                { name: 'Events', percentage: 10, description: 'Direct lead capture', activities: ['Webinars', 'Trade shows', 'Networking events', 'Workshops'] }
            ]
        },
        'sales': {
            channels: [
                { name: 'Paid Advertising', percentage: 35, description: 'Direct response and conversion optimization', activities: ['Google Ads', 'Social advertising', 'Retargeting', 'Display ads'] },
                { name: 'Email Marketing', percentage: 25, description: 'Sales nurturing and conversion', activities: ['Sales emails', 'Promotional campaigns', 'Abandoned cart', 'Product launches'] },
                { name: 'Content Marketing', percentage: 20, description: 'Sales enablement content', activities: ['Product demos', 'Case studies', 'ROI calculators', 'Comparison guides'] },
                { name: 'Social Media', percentage: 15, description: 'Social selling and community', activities: ['Social selling', 'Customer testimonials', 'Product showcases', 'Live demos'] },
                { name: 'Events', percentage: 5, description: 'Direct sales opportunities', activities: ['Sales events', 'Product launches', 'Customer meetings', 'Trade shows'] }
            ]
        },
        'engagement': {
            channels: [
                { name: 'Social Media', percentage: 40, description: 'Community building and engagement', activities: ['Community management', 'User-generated content', 'Live streaming', 'Interactive posts'] },
                { name: 'Content Marketing', percentage: 25, description: 'Engaging and interactive content', activities: ['Interactive content', 'Polls and surveys', 'User-generated content', 'Behind-the-scenes'] },
                { name: 'Events', percentage: 20, description: 'Direct community engagement', activities: ['Community events', 'Meetups', 'Workshops', 'Networking'] },
                { name: 'Email Marketing', percentage: 15, description: 'Personalized engagement', activities: ['Personalized emails', 'Community newsletters', 'Feedback requests', 'Exclusive content'] }
            ]
        },
        'thought-leadership': {
            channels: [
                { name: 'PR & Media', percentage: 35, description: 'Industry authority and credibility', activities: ['Industry publications', 'Expert quotes', 'Media interviews', 'Press releases'] },
                { name: 'Content Marketing', percentage: 30, description: 'Thought leadership content', activities: ['White papers', 'Industry reports', 'Expert blogs', 'Research studies'] },
                { name: 'Events', percentage: 20, description: 'Speaking and networking', activities: ['Conference speaking', 'Industry panels', 'Webinars', 'Workshops'] },
                { name: 'Social Media', percentage: 15, description: 'Thought leadership sharing', activities: ['LinkedIn articles', 'Industry insights', 'Expert commentary', 'Professional networking'] }
            ]
        }
    };
    
    const mix = channelMixes[goal] || channelMixes['awareness'];
    
    // Industry-specific adjustments
    const industryAdjustments = getIndustryAdjustments(industry, goal);
    
    // Apply industry adjustments to channel mix
    const adjustedChannels = mix.channels.map(channel => {
        const adjustment = industryAdjustments[channel.name] || 0;
        return {
            ...channel,
            percentage: Math.max(5, Math.min(50, channel.percentage + adjustment))
        };
    });
    
    // Normalize percentages to total 100%
    const totalPercentage = adjustedChannels.reduce((sum, channel) => sum + channel.percentage, 0);
    adjustedChannels.forEach(channel => {
        channel.percentage = Math.round((channel.percentage / totalPercentage) * 100);
    });
    
    return {
        channels: adjustedChannels,
        recommendations: getIndustryRecommendations(industry, goal, budgetRange, audienceSize)
    };
}

function getIndustryAdjustments(industry, goal) {
    const adjustments = {
        'tech': {
            'Social Media': 5, // Tech companies excel on social
            'PR & Media': 3,  // Strong PR presence
            'Content Marketing': 2,
            'Events': 0,
            'Paid Advertising': -2,
            'Email Marketing': -2
        },
        'energy': {
            'PR & Media': 5,  // Energy companies need strong PR
            'Content Marketing': 3, // Educational content important
            'Events': 2,      // Community engagement
            'Social Media': -2,
            'Paid Advertising': -3,
            'Email Marketing': -2
        },
        'healthcare': {
            'PR & Media': 5,  // Trust and credibility crucial
            'Content Marketing': 3, // Educational content
            'Events': 2,      // Professional events
            'Social Media': -3,
            'Paid Advertising': -2,
            'Email Marketing': -2
        },
        'finance': {
            'PR & Media': 5,  // Trust and compliance
            'Content Marketing': 3, // Educational content
            'Email Marketing': 2,   // Direct communication
            'Social Media': -3,
            'Paid Advertising': -2,
            'Events': -2
        },
        'retail': {
            'Social Media': 5, // Visual and social commerce
            'Paid Advertising': 3, // Direct response
            'Email Marketing': 2,  // Promotional
            'PR & Media': -2,
            'Content Marketing': -3,
            'Events': -2
        },
        'manufacturing': {
            'Content Marketing': 5, // Technical content
            'Events': 3,      // Trade shows
            'PR & Media': 2,  // Industry publications
            'Social Media': -3,
            'Paid Advertising': -2,
            'Email Marketing': -2
        }
    };
    
    return adjustments[industry] || {};
}

function getIndustryRecommendations(industry, goal, budgetRange, audienceSize) {
    const baseRecommendations = [
        'Start with high-impact, low-cost channels',
        'Focus on consistent messaging across all touchpoints',
        'Measure performance and adjust allocation monthly',
        'Consider seasonal trends and industry events'
    ];
    
    const industrySpecific = {
        'tech': [
            'Prioritize LinkedIn for B2B tech marketing',
            'Focus on thought leadership and innovation content',
            'Leverage industry events and conferences',
            'Use case studies and technical demonstrations'
        ],
        'energy': [
            'Emphasize sustainability and environmental messaging',
            'Focus on regulatory compliance and safety',
            'Build community trust through local engagement',
            'Use educational content to explain complex topics'
        ],
        'healthcare': [
            'Ensure all content complies with healthcare regulations',
            'Focus on patient education and trust-building',
            'Leverage professional credentials and expertise',
            'Use case studies and patient success stories'
        ],
        'finance': [
            'Emphasize security, trust, and compliance',
            'Focus on educational content about financial topics',
            'Use testimonials and case studies carefully',
            'Maintain professional tone across all channels'
        ],
        'retail': [
            'Prioritize visual content and social commerce',
            'Focus on customer reviews and testimonials',
            'Use seasonal and trend-based campaigns',
            'Leverage influencer partnerships and user-generated content'
        ],
        'manufacturing': [
            'Focus on technical specifications and quality content',
            'Leverage trade shows and industry events',
            'Use case studies and ROI demonstrations',
            'Emphasize certifications and industry standards'
        ]
    };
    
    const budgetRecommendations = {
        'low': [
            'Focus on organic social media and content marketing',
            'Leverage free industry events and networking',
            'Use email marketing for cost-effective lead nurturing',
            'Prioritize high-ROI channels like SEO and PR'
        ],
        'medium': [
            'Balance organic and paid channels',
            'Invest in targeted social advertising',
            'Consider industry-specific events and sponsorships',
            'Allocate budget for content creation and tools'
        ],
        'high': [
            'Implement comprehensive multi-channel strategy',
            'Invest in premium content and creative assets',
            'Consider high-profile events and sponsorships',
            'Allocate budget for advanced analytics and tools'
        ],
        'enterprise': [
            'Execute enterprise-level integrated campaigns',
            'Invest in custom content and premium placements',
            'Consider global events and major sponsorships',
            'Allocate significant budget for technology and analytics'
        ]
    };
    
    const audienceRecommendations = {
        'local': [
            'Focus on local SEO and community engagement',
            'Leverage local events and partnerships',
            'Use local media and community publications',
            'Emphasize local customer testimonials'
        ],
        'national': [
            'Balance national and regional strategies',
            'Use national media and industry publications',
            'Consider national events and conferences',
            'Leverage national influencer partnerships'
        ],
        'global': [
            'Develop multi-region content and campaigns',
            'Use global platforms and international media',
            'Consider global events and virtual experiences',
            'Adapt messaging for different cultural contexts'
        ]
    };
    
    return [
        ...baseRecommendations,
        ...(industrySpecific[industry] || []),
        ...(budgetRecommendations[budgetRange] || []),
        ...(audienceRecommendations[audienceSize] || [])
    ].slice(0, 8); // Limit to 8 recommendations
}

function createChannelChart(channels) {
    const ctx = document.getElementById('channelChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: channels.map(c => c.name),
            datasets: [{
                data: channels.map(c => c.percentage),
                backgroundColor: channels.map((c, index) => getChannelColor(index)),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Customer Quiz Functions
function selectOption(key, value) {
    answers[key] = value;
    
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    // Show the start quiz button
    document.getElementById('start-quiz-btn').style.display = 'block';
}

function startCustomerQuiz() {
    const demographic = answers['demographic'];
    const questions = getCustomerQuestions(demographic);
    
    let questionsHTML = '';
    questions.forEach((q, index) => {
        questionsHTML += `
            <div class="question-container">
                <div class="question">${q.question}</div>
                <div class="options">
                    ${q.options.map(option => `
                        <div class="option" onclick="selectCustomerAnswer(${index}, '${option.value}')">${option.text}</div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    questionsHTML += '<button class="btn" onclick="showCustomerQuizResults()">Get Your Score</button>';
    
    document.getElementById('customer-quiz-content').innerHTML = questionsHTML;
}

function getCustomerQuestions(demographic) {
    const questionSets = {
        'millennials': [
            {
                question: "What social media platform do Millennials prefer for brand discovery?",
                options: [
                    { value: 'instagram', text: 'Instagram' },
                    { value: 'tiktok', text: 'TikTok' },
                    { value: 'facebook', text: 'Facebook' },
                    { value: 'linkedin', text: 'LinkedIn' }
                ]
            },
            {
                question: "What's the most important factor for Millennials when choosing a brand?",
                options: [
                    { value: 'values', text: 'Brand values and purpose' },
                    { value: 'price', text: 'Price and affordability' },
                    { value: 'quality', text: 'Product quality' },
                    { value: 'convenience', text: 'Convenience' }
                ]
            },
            {
                question: "How do Millennials prefer to research products before purchasing?",
                options: [
                    { value: 'social', text: 'Social media and peer reviews' },
                    { value: 'google', text: 'Google search and reviews' },
                    { value: 'direct', text: 'Direct brand websites' },
                    { value: 'influencer', text: 'Influencer recommendations' }
                ]
            }
        ],
        'gen-z': [
            {
                question: "What content format do Gen Z consumers prefer?",
                options: [
                    { value: 'video', text: 'Short-form video' },
                    { value: 'images', text: 'Images and memes' },
                    { value: 'text', text: 'Text posts' },
                    { value: 'audio', text: 'Audio content' }
                ]
            },
            {
                question: "What's most important to Gen Z when engaging with brands?",
                options: [
                    { value: 'authenticity', text: 'Authenticity and transparency' },
                    { value: 'trends', text: 'Following trends' },
                    { value: 'influence', text: 'Influencer endorsements' },
                    { value: 'discounts', text: 'Discounts and deals' }
                ]
            },
            {
                question: "Which platform do Gen Z users spend the most time on daily?",
                options: [
                    { value: 'tiktok', text: 'TikTok' },
                    { value: 'instagram', text: 'Instagram' },
                    { value: 'youtube', text: 'YouTube' },
                    { value: 'snapchat', text: 'Snapchat' }
                ]
            }
        ],
        'gen-x': [
            {
                question: "What's the primary way Gen X consumers discover new products?",
                options: [
                    { value: 'search', text: 'Online search engines' },
                    { value: 'social', text: 'Social media' },
                    { value: 'email', text: 'Email marketing' },
                    { value: 'traditional', text: 'Traditional advertising' }
                ]
            },
            {
                question: "What matters most to Gen X when making purchasing decisions?",
                options: [
                    { value: 'quality', text: 'Product quality and reliability' },
                    { value: 'price', text: 'Price and value' },
                    { value: 'convenience', text: 'Convenience and ease' },
                    { value: 'trust', text: 'Brand trust and reputation' }
                ]
            },
            {
                question: "How do Gen X consumers prefer to interact with brands?",
                options: [
                    { value: 'email', text: 'Email communication' },
                    { value: 'phone', text: 'Phone calls' },
                    { value: 'social', text: 'Social media' },
                    { value: 'website', text: 'Brand websites' }
                ]
            }
        ],
        'boomers': [
            {
                question: "What's the most trusted source of information for Baby Boomers?",
                options: [
                    { value: 'traditional', text: 'Traditional media (TV, newspapers)' },
                    { value: 'word', text: 'Word of mouth recommendations' },
                    { value: 'online', text: 'Online reviews' },
                    { value: 'direct', text: 'Direct brand communication' }
                ]
            },
            {
                question: "What's most important to Baby Boomers when choosing a brand?",
                options: [
                    { value: 'trust', text: 'Trust and reliability' },
                    { value: 'quality', text: 'Quality and durability' },
                    { value: 'service', text: 'Customer service' },
                    { value: 'price', text: 'Price and value' }
                ]
            },
            {
                question: "How do Baby Boomers prefer to make purchases?",
                options: [
                    { value: 'in-person', text: 'In-person at physical stores' },
                    { value: 'phone', text: 'Over the phone' },
                    { value: 'online', text: 'Online with customer service' },
                    { value: 'self-service', text: 'Self-service online' }
                ]
            }
        ]
    };
    
    return questionSets[demographic] || questionSets['millennials'];
}

function selectCustomerAnswer(questionIndex, value) {
    answers[`customer-question-${questionIndex}`] = value;
    
    // Remove selected class from all options in this question
    const questionContainer = document.querySelectorAll('.question-container')[questionIndex];
    questionContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
}

function showCustomerQuizResults() {
    const demographic = answers['demographic'];
    const results = calculateCustomerQuizScore();
    const demographicInsights = getDemographicInsights(demographic);
    
    const resultsHTML = `
        <div class="results">
            <h3>Your Customer Knowledge Score</h3>
            <div class="score ${results.level}">${results.score}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${results.score}%"></div>
            </div>
            <p><strong>${results.title}</strong></p>
            <p>${results.description}</p>
            
            <div class="industry-insight">
                <h4>${demographic.charAt(0).toUpperCase() + demographic.slice(1)} Consumer Insights:</h4>
                <p>${demographicInsights}</p>
            </div>
            
            ${results.score >= 70 ? `
                <div style="margin-top: 2rem; text-align: center;">
                    <p><strong>Nice work! Ready to start reaching them?</strong></p>
                    <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Strategic Support</button>
                </div>
            ` : `
                <div style="margin-top: 2rem; text-align: center;">
                    <p><strong>Better luck next time! Want help getting to know your customers better?</strong></p>
                    <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Customer Research Support</button>
                </div>
            `}
        </div>
    `;
    
    document.getElementById('customer-quiz-content').innerHTML = resultsHTML;
}

function getDemographicInsights(demographic) {
    const insights = {
        'millennials': 'Millennials value authenticity, social responsibility, and experiences over material possessions. They prefer brands that align with their values and use social media extensively for discovery and research. Mobile-first experiences and personalized content resonate strongly with this demographic.',
        'gen-z': 'Gen Z consumers are digital natives who prioritize authenticity, diversity, and social causes. They prefer short-form video content, value transparency from brands, and are heavily influenced by social media and peer recommendations. They expect brands to take stands on social issues.',
        'gen-x': 'Gen X consumers are practical and value quality, reliability, and good customer service. They research thoroughly before purchasing and prefer email communication. They appreciate brands that understand their busy lifestyles and provide straightforward, no-nonsense experiences.',
        'boomers': 'Baby Boomers value trust, quality, and personal relationships with brands. They prefer traditional media and in-person interactions, though many are increasingly comfortable with online shopping. They appreciate clear communication, excellent customer service, and brands that respect their experience and wisdom.'
    };
    
    return insights[demographic] || 'Understanding your target demographic is crucial for effective marketing. Consider conducting customer research to better understand their preferences and behaviors.';
}

function calculateCustomerQuizScore() {
    let score = 0;
    let totalQuestions = 0;
    const demographic = answers['demographic'];
    
    // Define correct answers based on demographic research
    const correctAnswers = {
        'millennials': {
            'instagram': true, // Instagram is preferred for brand discovery
            'values': true,    // Brand values are most important
            'social': true     // Social media and peer reviews for research
        },
        'gen-z': {
            'video': true,     // Short-form video is preferred
            'authenticity': true, // Authenticity is most important
            'tiktok': true     // TikTok is most used platform
        },
        'gen-x': {
            'search': true,    // Online search is primary discovery method
            'quality': true,   // Quality matters most
            'email': true      // Email is preferred interaction method
        },
        'boomers': {
            'traditional': true, // Traditional media is most trusted
            'trust': true,     // Trust is most important
            'in-person': true  // In-person purchases preferred
        }
    };
    
    Object.keys(answers).forEach(key => {
        if (key.startsWith('customer-question-')) {
            totalQuestions++;
            const answer = answers[key];
            const correctAnswersForDemo = correctAnswers[demographic] || {};
            
            if (correctAnswersForDemo[answer]) {
                score += 100; // Full points for correct answer
            } else {
                score += 25;  // Partial points for any answer (shows some knowledge)
            }
        }
    });
    
    const finalScore = Math.round(score / totalQuestions);
    
    if (finalScore >= 80) {
        return {
            score: finalScore,
            level: 'excellent',
            title: 'Excellent Customer Knowledge',
            description: `You have a deep understanding of ${demographic} consumers. You're well-positioned to create meaningful connections and campaigns that resonate with this audience.`
        };
    } else if (finalScore >= 60) {
        return {
            score: finalScore,
            level: 'good',
            title: 'Good Customer Knowledge',
            description: `You have a solid understanding of ${demographic} consumers, but there's room to deepen your insights. Consider conducting more targeted research to better understand their preferences and behaviors.`
        };
    } else {
        return {
            score: finalScore,
            level: 'poor',
            title: 'Needs Improvement',
            description: `Your knowledge of ${demographic} consumers could benefit from deeper research. Understanding your audience is crucial for effective marketing - consider investing in customer research and persona development.`
        };
    }
} 

// --- POV Builder 2.0 Chatbot Logic ---
let pov2State = {
    step: 0,
    answers: {},
    chat: []
};
const pov2Questions = [
    { key: 'issue', text: "What current issue or event are you considering making a public statement about?" },
    { key: 'company', text: "What is your company's name and industry?" },
    { key: 'values', text: "What are your company's core values?" },
    { key: 'audience', text: "Who is your primary audience for this statement? (e.g., customers, employees, media, public)" },
    { key: 'goal', text: "What is your main goal with this statement? (e.g., show support, clarify position, respond to criticism, etc.)" },
    { key: 'risks', text: "Are there any risks or sensitivities you're concerned about?" }
];
function pov2RenderChat() {
    const chatDiv = document.getElementById('pov2-chat');
    if (!chatDiv) return;
    chatDiv.innerHTML = pov2State.chat.map(msg => `
        <div class="chat-bubble ${msg.from}">
            ${msg.text}
        </div>
    `).join('');
}
function pov2AskNext() {
    if (pov2State.step < pov2Questions.length) {
        pov2State.chat.push({ from: 'bot', text: pov2Questions[pov2State.step].text });
        pov2RenderChat();
    } else {
        // All questions answered, show Get Perspective button
        pov2State.chat.push({ from: 'bot', text: `<button class='btn' onclick='pov2GetPerspective()'>Get Perspective</button>` });
        pov2RenderChat();
        document.getElementById('pov2-input-area').style.display = 'none';
    }
}
function pov2HandleUserInput() {
    const input = document.getElementById('pov2-user-input');
    const value = input.value.trim();
    if (!value) return;
    // Add user message
    pov2State.chat.push({ from: 'user', text: value });
    pov2State.answers[pov2Questions[pov2State.step].key] = value;
    pov2State.step++;
    input.value = '';
    pov2RenderChat();
    setTimeout(pov2AskNext, 400);
}
function pov2Restart() {
    pov2State = { step: 0, answers: {}, chat: [] };
    pov2RenderChat();
    document.getElementById('pov2-input-area').style.display = 'flex';
    setTimeout(pov2AskNext, 400);
}
async function pov2GetPerspective() {
    pov2State.chat.push({ from: 'bot', text: '<span style="color:#888;">Thinking...</span>' });
    pov2RenderChat();
    // Build prompt
    const { issue, company, values, audience, goal, risks } = pov2State.answers;
    let prompt = `You are a senior PR strategist chatbot. A user is considering making a public statement on behalf of their company about a current issue.\n\n` +
        `Issue/Event: ${issue}\nCompany: ${company}\nCore Values: ${values}\nAudience: ${audience}\nGoal: ${goal}\nRisks/Sensitivities: ${risks}\n\n` +
        `Should this company make a public statement? If so, what should the tone, content, and approach be? What are the key risks and best practices? Provide a PR-focused, actionable recommendation in a short paragraph.`;
    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        pov2State.chat.pop(); // remove 'Thinking...'
        let answer = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content : 'Sorry, I could not generate a perspective at this time.';
        pov2State.chat.push({ from: 'bot', text: answer });
        pov2RenderChat();
    } catch (err) {
        pov2State.chat.pop();
        pov2State.chat.push({ from: 'bot', text: 'Sorry, there was an error. Please try again.' });
        pov2RenderChat();
    }
}
// Chatbot bubble styles
const style = document.createElement('style');
style.innerHTML = `
.chatbot-container { min-height: 320px; }
.chat-bubble { max-width: 80%; margin-bottom: 1rem; padding: 1rem 1.25rem; border-radius: 18px; font-size: 1.05rem; line-height: 1.6; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.chat-bubble.bot { background: #e9ecef; color: #222; align-self: flex-start; }
.chat-bubble.user { background: #007bff; color: #fff; align-self: flex-end; margin-left:auto; }
#pov2-input-area { margin-top: 1rem; }
`;
document.head.appendChild(style);
// Hook up chatbot when modal opens
const origOpenTool = window.openTool;
window.openTool = function(toolName) {
    origOpenTool(toolName);
    if (toolName === 'pov-builder-2') {
        pov2Restart();
    }
};

// Copy iframe snippet to clipboard
function copyIframeSnippet() {
    const input = document.getElementById('iframe-snippet');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile
    document.execCommand('copy');
    const confirm = document.getElementById('copy-confirm');
    if (confirm) {
        confirm.style.display = 'block';
        setTimeout(() => { confirm.style.display = 'none'; }, 1500);
    }
} 

// --- Glossary Entry Creator Functions ---
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
        // Get the content from the form fields
        const whyMatters = document.getElementById('glossary-why-matters').value.trim();
        const inkRole = document.getElementById('glossary-ink-role').value.trim();
        const challenges = document.getElementById('glossary-challenges').value.trim();
        
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
                author,
                whyMatters,
                inkRole,
                challenges
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showGlossaryResult(`
                <div style="color: #28a745; font-weight: 600; margin-bottom: 0.5rem;">✅ Glossary entry created successfully!</div>
                <div style="margin-bottom: 0.5rem;"><strong>Glossary ID:</strong> ${data.post.id}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${data.post.status}</div>
                <div style="margin-bottom: 0.5rem;"><strong>Type:</strong> ${data.post.type === 'glossary' ? 'Glossary Entry' : 'Post'}</div>
                <div style="margin-bottom: 1rem;"><strong>Link:</strong> <a href="${data.post.link}" target="_blank">View in WordPress</a></div>
                <div style="margin-bottom: 1rem; color: #17a2b8;"><em>${data.message}</em></div>
                <button class="btn btn-secondary" onclick="clearGlossaryForm()">Create Another Entry</button>
            `, 'success');
        } else {
            let errorMessage = data.error || 'Failed to create glossary entry';
            if (data.details) {
                errorMessage += `<br><br><strong>Details:</strong> ${data.details}`;
            }
            if (data.debug) {
                errorMessage += `<br><br><strong>Debug Info:</strong><br>`;
                errorMessage += `URL: ${data.debug.wpUrl}<br>`;
                errorMessage += `Credentials: ${data.debug.hasCredentials ? 'Configured' : 'Missing'}<br>`;
                errorMessage += `Timestamp: ${data.debug.timestamp}`;
            }
            showGlossaryResult(`Error: ${errorMessage}`, 'error');
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

// --- AI-Powered Glossary Definition Generation ---
async function generateGlossaryDefinition() {
    const term = document.getElementById('glossary-term').value.trim();
    const category = document.getElementById('glossary-category').value.trim();
    const relatedTerms = document.getElementById('glossary-related-terms').value.trim();
    const notes = document.getElementById('glossary-notes').value.trim();
    
    // Validate required fields
    if (!term) {
        showGlossaryResult('Please enter a term to define.', 'error');
        return;
    }
    
    // Show loading state
    showGlossaryResult('Generating definition with AI...', 'loading');
    
    try {
        // Build the prompt for AI with INK formatting instructions
        let prompt = `Create a glossary entry for "${term}" following this exact format:

DEFINITION: [1-2 sentence definition in business context]

SYNONYMS: [2-3 related terms, comma-separated]

WHY_MATTERS: [Why this matters to businesses/marketers]

INK_ROLE: [How INK helps companies with this]

CHALLENGES: [3 bullet points of challenges]

Example for "Analyst Relations":
DEFINITION: Analyst relations is the practice of building relationships with industry analysts who influence buyers, market categories, and company reputation—especially important for B2B companies in complex or emerging sectors.

SYNONYMS: Industry analyst outreach, Analyst engagement, AR

WHY_MATTERS: Analyst relations is a strategic effort to engage with analysts at firms like Gartner, Forrester, and IDC. These analysts advise buyers, define categories, and publish research that can shape perception and influence decisions.

INK_ROLE: INK supports companies' analyst relations through analyst briefings, evaluations, and long‑term engagement to build credibility and stay visible in key research cycles.

CHALLENGES: - Aligning company messaging with analyst expectations
- Navigating pay‑to‑play programs with limited resources
- Meeting deadlines tied to analyst research schedules

Now create the entry for "${term}" following the exact same format:`;
        
        if (category) {
            prompt += `\n\nCategory: ${category}`;
        }
        
        if (relatedTerms) {
            prompt += `\n\nUser-provided synonyms: ${relatedTerms}`;
        } else {
            prompt += `\n\nPlease generate 2-3 relevant synonyms for this term.`;
        }
        
        if (notes) {
            prompt += `\n\nAdditional context and direction: ${notes}`;
        }
        
        prompt += `\n\nFormat your response as: DEFINITION: [definition] SYNONYMS: [synonyms] WHY_MATTERS: [why it matters section] INK_ROLE: [INK's role section] CHALLENGES: [challenges section]`;
        
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        console.log('=== DEBUGGING START ===');
        console.log('OpenAI Response:', data); // Debug logging
        console.log('Response status:', response.ok);
        console.log('Data choices:', data.choices);
        console.log('First choice:', data.choices?.[0]);
        console.log('Message:', data.choices?.[0]?.message);
        console.log('Content:', data.choices?.[0]?.message?.content);
        console.log('Content type:', typeof data.choices?.[0]?.message?.content);
        console.log('Content length:', data.choices?.[0]?.message?.content?.length);
        
        // Debug each condition separately
        console.log('Condition checks:');
        console.log('- response.ok:', response.ok);
        console.log('- data.choices exists:', !!data.choices);
        console.log('- data.choices[0] exists:', !!data.choices?.[0]);
        console.log('- data.choices[0].message exists:', !!data.choices?.[0]?.message);
        console.log('- data.choices[0].message.content exists:', !!data.choices?.[0]?.message?.content);
        console.log('=== DEBUGGING END ===');
        console.log('Timestamp:', new Date().toISOString());
        
        if (response.ok && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            const aiResponse = data.choices[0].message.content ? data.choices[0].message.content.trim() : '';
            
            // Parse the structured AI response
            let generatedDefinition = aiResponse;
            let generatedSynonyms = '';
            let generatedWhyMatters = '';
            let generatedInkRole = '';
            let generatedChallenges = '';
            
            // Parse the structured response
            if (aiResponse.includes('DEFINITION:')) {
                const definitionMatch = aiResponse.match(/DEFINITION:\s*(.*?)(?=\s*SYNONYMS:|$)/s);
                if (definitionMatch && definitionMatch[1]) {
                    generatedDefinition = definitionMatch[1].trim();
                }
            }
            
            if (aiResponse.includes('SYNONYMS:')) {
                const synonymsMatch = aiResponse.match(/SYNONYMS:\s*(.*?)(?=\s*WHY_MATTERS:|$)/s);
                if (synonymsMatch && synonymsMatch[1]) {
                    generatedSynonyms = synonymsMatch[1].trim();
                }
            }
            
            if (aiResponse.includes('WHY_MATTERS:')) {
                const whyMattersMatch = aiResponse.match(/WHY_MATTERS:\s*(.*?)(?=\s*INK_ROLE:|$)/s);
                if (whyMattersMatch && whyMattersMatch[1]) {
                    generatedWhyMatters = whyMattersMatch[1].trim();
                }
            }
            
            if (aiResponse.includes('INK_ROLE:')) {
                const inkRoleMatch = aiResponse.match(/INK_ROLE:\s*(.*?)(?=\s*CHALLENGES:|$)/s);
                if (inkRoleMatch && inkRoleMatch[1]) {
                    generatedInkRole = inkRoleMatch[1].trim();
                }
            }
            
            if (aiResponse.includes('CHALLENGES:')) {
                const challengesMatch = aiResponse.match(/CHALLENGES:\s*(.*?)$/s);
                if (challengesMatch && challengesMatch[1]) {
                    generatedChallenges = challengesMatch[1].trim();
                }
            }
            
            // Show the definition section and populate it
            document.getElementById('glossary-definition-section').style.display = 'block';
            document.getElementById('glossary-definition').value = generatedDefinition;
            
            // Populate the additional fields with generated content
            if (generatedWhyMatters) {
                document.getElementById('glossary-why-matters').value = generatedWhyMatters;
            }
            if (generatedInkRole) {
                document.getElementById('glossary-ink-role').value = generatedInkRole;
            }
            if (generatedChallenges) {
                document.getElementById('glossary-challenges').value = generatedChallenges;
            }
            
            // If synonyms were generated and the field is empty, populate it
            if (generatedSynonyms && (!relatedTerms || relatedTerms.trim() === '')) {
                document.getElementById('glossary-related-terms').value = generatedSynonyms;
            }
            
            // Store the generated content in data attributes for later use (for backward compatibility)
            document.getElementById('glossary-definition').setAttribute('data-why-matters', generatedWhyMatters);
            document.getElementById('glossary-definition').setAttribute('data-ink-role', generatedInkRole);
            document.getElementById('glossary-definition').setAttribute('data-challenges', generatedChallenges);
            
            showGlossaryResult(`
                <div style="color: #28a745; font-weight: 600; margin-bottom: 0.5rem;">✅ Complete glossary entry generated successfully!</div>
                <div style="margin-bottom: 1rem;">Review and edit the definition above, then click "Create Glossary Entry" when ready.</div>
                <div style="margin-bottom: 0.5rem; color: #17a2b8;"><strong>Generated content includes:</strong></div>
                ${generatedSynonyms ? `<div style="margin-bottom: 0.5rem; color: #17a2b8;">• <strong>Synonyms:</strong> ${generatedSynonyms}</div>` : ''}
                ${generatedWhyMatters ? `<div style="margin-bottom: 0.5rem; color: #17a2b8;">• <strong>Why it matters:</strong> ${generatedWhyMatters}</div>` : ''}
                ${generatedInkRole ? `<div style="margin-bottom: 0.5rem; color: #17a2b8;">• <strong>INK's role:</strong> ${generatedInkRole}</div>` : ''}
                ${generatedChallenges ? `<div style="margin-bottom: 0.5rem; color: #17a2b8;">• <strong>Challenges:</strong> ${generatedChallenges}</div>` : ''}
            `, 'success');
            
            // Scroll to the definition section
            document.getElementById('glossary-definition').scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('OpenAI API Error:', data);
            let errorMessage = 'Could not generate definition. ';
            if (data.error) {
                errorMessage += data.error.message || data.error;
            } else if (!response.ok) {
                errorMessage += `API error (${response.status}). `;
            } else if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
                errorMessage += 'Invalid response format from OpenAI API. ';
            } else {
                errorMessage += 'Invalid response format. ';
            }
            errorMessage += 'Please try again.';
            showGlossaryResult(`Error: ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Error generating definition:', error);
        showGlossaryResult('Network error. Please check your connection and try again.', 'error');
    }
}

async function regenerateDefinition() {
    // Clear the current definition and regenerate
    document.getElementById('glossary-definition').value = '';
    document.getElementById('glossary-why-matters').value = '';
    document.getElementById('glossary-ink-role').value = '';
    document.getElementById('glossary-challenges').value = '';
    await generateGlossaryDefinition();
}

function clearGlossaryForm() {
    document.getElementById('glossary-term').value = '';
    document.getElementById('glossary-definition').value = '';
    document.getElementById('glossary-category').value = '';
    document.getElementById('glossary-related-terms').value = '';
    document.getElementById('glossary-author').value = '';
    document.getElementById('glossary-notes').value = '';
    document.getElementById('glossary-why-matters').value = '';
    document.getElementById('glossary-ink-role').value = '';
    document.getElementById('glossary-challenges').value = '';
    document.getElementById('glossary-result').innerHTML = '';
    document.getElementById('glossary-definition-section').style.display = 'none';
}

// Initialize URL parameter checking when the script loads
document.addEventListener('DOMContentLoaded', function() {
    checkUrlParameters();
}); 