// Global variables
let currentTool = null;
let currentQuestion = 0;
let answers = {};

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
    currentTool = toolName;
    currentQuestion = 0;
    answers = {};
    
    const toolContent = getToolContent(toolName);
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
        'customer-quiz': baseUrl + '?tool=customer-quiz'
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
                    <p>Should your brand comment on a current issue? Answer the questions below to find out how well the issue aligns with your brand and what you should do next.</p>
                </div>
                <div id="quiz-content"></div>
            </div>
        `,
        
        'pov-builder': `
            <div class="tool-container">
                <div class="tool-header" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h2>Point-of-View Builder</h2>
                        <p>Get authentic, actionable POV ideas for your brand on any issue. Powered by AI.</p>
                    </div>
                    <span class="ai-tag">AI enabled</span>
                </div>
                <div id="pov-content">
                    <div class="input-group">
                        <label for="website-url">Your Website URL <span style="color:red">*</span></label>
                        <input type="url" id="website-url" placeholder="https://yourbrand.com" required>
                    </div>
                    <div class="input-group">
                        <label for="issue-topic">What issue or topic do you want to address?</label>
                        <textarea id="issue-topic" rows="3" placeholder="Describe the issue you want to take a stance on..." required></textarea>
                    </div>
                    <div class="input-group">
                        <label for="brand-values">What are your brand's core values? (optional)</label>
                        <textarea id="brand-values" rows="2" placeholder="List your brand's key values and principles..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="target-audience">Who is your target audience? (optional)</label>
                        <textarea id="target-audience" rows="2" placeholder="Describe your primary audience..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="desired-outcome">What outcome do you want to achieve? (optional)</label>
                        <select id="desired-outcome">
                            <option value="">Select an outcome...</option>
                            <option value="awareness">Raise awareness</option>
                            <option value="education">Educate audience</option>
                            <option value="action">Drive action</option>
                            <option value="conversation">Start conversation</option>
                            <option value="leadership">Position as thought leader</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generatePOVIdeas()">Generate POV Ideas</button>
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
                    <p>Find the optimal mix of marketing channels for your specific goals and industry.</p>
                </div>
                <div id="channel-content">
                    <div class="input-group">
                        <label for="campaign-goal">Primary Campaign Goal</label>
                        <select id="campaign-goal">
                            <option value="">Select your primary goal...</option>
                            <option value="awareness">Brand Awareness</option>
                            <option value="leads">Lead Generation</option>
                            <option value="sales">Direct Sales</option>
                            <option value="engagement">Audience Engagement</option>
                            <option value="thought-leadership">Thought Leadership</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="target-audience-size">Target Audience Size</label>
                        <select id="target-audience-size">
                            <option value="">Select audience size...</option>
                            <option value="local">Local/Regional</option>
                            <option value="national">National</option>
                            <option value="global">Global</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="budget-range">Budget Range</label>
                        <select id="budget-range">
                            <option value="">Select budget range...</option>
                            <option value="low">Under $10K</option>
                            <option value="medium">$10K - $50K</option>
                            <option value="high">$50K - $200K</option>
                            <option value="enterprise">$200K+</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="industry-focus">Industry Focus</label>
                        <select id="industry-focus">
                            <option value="">Select your industry...</option>
                            <option value="b2b">B2B</option>
                            <option value="b2c">B2C</option>
                            <option value="nonprofit">Nonprofit</option>
                            <option value="government">Government</option>
                        </select>
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
    }
}

// Brand Alignment Quiz Functions
function startBrandAlignmentQuiz() {
    currentQuestion = 0;
    answers = {};
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
            <div class="question">${q.question}</div>
            <div class="options">${optionsHTML}</div>
        </div>
        <button class="btn" id="next-btn" ${answers[`question-${currentQuestion}`] ? '' : 'disabled'} onclick="nextBrandAlignmentQuestion()">${currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}</button>
    `;
    document.getElementById('quiz-content').innerHTML = questionHTML;
}

function selectSingleOption(questionIndex, value) {
    answers[`question-${questionIndex}`] = value;
    // Remove selected class from all options in this question
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    // Add selected class to clicked option
    event.target.classList.add('selected');
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextBrandAlignmentQuestion() {
    currentQuestion++;
    showBrandAlignmentQuestion();
}

function getIssueQuestions() {
    // Only use universal questions for alignment
    return [
        {
            question: "How closely does this issue relate to your brand’s core mission or values?",
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
                { value: 'no', text: 'No, they don’t expect it' }
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
                { value: 'expert', text: 'Yes, we’re recognized experts' },
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
    const issueType = answers['issue-type'];
    const results = calculateBrandAlignmentScore();
    
    const resultsHTML = `
        <div class="results">
            <h3>Your Brand Alignment Assessment</h3>
            <div class="score ${results.level}">${results.score}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${results.score}%"></div>
            </div>
            <p><strong>${results.title}</strong></p>
            <p>${results.description}</p>
            <h4>Key Areas to Address:</h4>
            <ul>
                ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Schedule a Consultation</button>
            </div>
        </div>
    `;
    
    document.getElementById('quiz-content').innerHTML = resultsHTML;
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
            if (answer === 'not') advice.push('The issue is not closely related to your brand’s core mission.');
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
        recommendations = advice.length ? advice : ['Review your brand’s alignment before commenting.'];
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

// POV Builder Functions (AI-powered)
async function generatePOVIdeas() {
    const website = document.getElementById('website-url').value.trim();
    const issueTopic = document.getElementById('issue-topic').value.trim();
    const brandValues = document.getElementById('brand-values').value.trim();
    const targetAudience = document.getElementById('target-audience').value.trim();
    const desiredOutcome = document.getElementById('desired-outcome').value;

    if (!website || !issueTopic) {
        alert('Please enter your website URL and the issue/topic.');
        return;
    }

    // Show loading spinner
    document.getElementById('pov-content').innerHTML = `
        <div style="text-align:center; padding:2rem;">
            <div class="loader" style="margin-bottom:1rem;"></div>
            <p>Generating authentic POV ideas...</p>
        </div>
    `;

    // Build the OpenAI prompt
    let prompt = `You are a brand strategist. Given the following information, suggest a list of 5-7 authentic point-of-view (POV) ideas for the brand to take on the issue. For each bullet point, provide:\n- The POV idea (bolded)\n- A short explanation (1-2 sentences) of why this position makes sense for the brand, referencing the website, values, or audience if possible.\n\nBrand website: ${website}\nIssue/topic: ${issueTopic}`;
    if (brandValues) prompt += `\nBrand values: ${brandValues}`;
    if (targetAudience) prompt += `\nTarget audience: ${targetAudience}`;
    if (desiredOutcome) prompt += `\nDesired outcome: ${desiredOutcome}`;
    prompt += `\n\nFormat your response as:\n- **POV idea**\n  - Why this makes sense: [explanation]\nRepeat for each idea. Do not write a full article. Guide the user, do not give them all the answers.`;

    try {
        // Call the Vercel serverless function instead of OpenAI directly
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        let ideas = '';
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            // Format: split on lines that start with - ** (the POV idea)
            const lines = data.choices[0].message.content.split(/\n(?=- \*\*)/g);
            ideas = '<ul class="pov-idea-list">' + lines.map(line => {
                // Split into idea and explanation
                const match = line.match(/^- \*\*(.*?)\*\*\s*\n?\s*- Why this makes sense: (.*)$/s);
                if (match) {
                    return `<li><strong>${match[1]}</strong><br><span class="pov-explanation">${match[2]}</span></li>`;
                } else {
                    // fallback: just show the line
                    return `<li>${line.replace(/^- /, '')}</li>`;
                }
            }).join('') + '</ul>';
        } else {
            ideas = '<span style="color:red;">No response from OpenAI. Please try again.</span>';
        }
        document.getElementById('pov-content').innerHTML = `
            <div class="results">
                <h3>Authentic POV Ideas</h3>
                <div class="pov-ideas" style="margin-bottom:2rem;">${ideas}</div>
                <div style="text-align:center;">
                    <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Professional Content Support</button>
                </div>
            </div>
        `;
    } catch (err) {
        document.getElementById('pov-content').innerHTML = `<div class="results"><p style="color:red;">Error generating POV ideas. Please try again later.</p></div>`;
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
            <h3>Optimal Channel Mix</h3>
            
            <div class="chart-container">
                <canvas id="channelChart"></canvas>
            </div>
            
            <div class="channel-breakdown">
                ${optimization.channels.map(channel => `
                    <div class="channel-item">
                        <h4>${channel.name} (${channel.percentage}%)</h4>
                        <p>${channel.description}</p>
                        <ul>
                            ${channel.activities.map(activity => `<li>${activity}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            
            <h4>Strategic Recommendations:</h4>
            <ul>
                ${optimization.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Custom Strategy</button>
            </div>
        </div>
    `;
    
    document.getElementById('channel-content').innerHTML = resultsHTML;
    
    // Create chart
    createChannelChart(optimization.channels);
}

function getChannelOptimization(goal, audienceSize, budgetRange, industry) {
    const channelMixes = {
        'awareness': {
            channels: [
                { name: 'Social Media', percentage: 40, description: 'Build brand awareness through engaging content', activities: ['Organic social posts', 'Influencer partnerships', 'Social advertising'] },
                { name: 'PR & Media', percentage: 30, description: 'Earned media coverage and thought leadership', activities: ['Press releases', 'Media outreach', 'Thought leadership articles'] },
                { name: 'Content Marketing', percentage: 20, description: 'Educational and engaging content', activities: ['Blog posts', 'Infographics', 'Video content'] },
                { name: 'Events', percentage: 10, description: 'Direct audience engagement', activities: ['Webinars', 'Industry events', 'Brand activations'] }
            ]
        },
        'leads': {
            channels: [
                { name: 'Content Marketing', percentage: 35, description: 'Lead generation through valuable content', activities: ['Gated content', 'Email newsletters', 'SEO optimization'] },
                { name: 'Social Media', percentage: 25, description: 'Social selling and lead nurturing', activities: ['LinkedIn outreach', 'Social advertising', 'Community building'] },
                { name: 'Email Marketing', percentage: 20, description: 'Direct lead nurturing', activities: ['Email campaigns', 'Lead scoring', 'Automation'] },
                { name: 'PR & Media', percentage: 20, description: 'Credibility and trust building', activities: ['Industry publications', 'Expert quotes', 'Case studies'] }
            ]
        }
    };
    
    const mix = channelMixes[goal] || channelMixes['awareness'];
    
    return {
        channels: mix.channels,
        recommendations: [
            'Start with high-impact, low-cost channels',
            'Focus on consistent messaging across all touchpoints',
            'Measure performance and adjust allocation monthly',
            'Consider seasonal trends and industry events'
        ]
    };
}

function createChannelChart(channels) {
    const ctx = document.getElementById('channelChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: channels.map(c => c.name),
            datasets: [{
                data: channels.map(c => c.percentage),
                backgroundColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6f42c1',
                    '#fd7e14'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
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