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
    const tools = {
        'brand-alignment': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Brand Alignment Quiz</h2>
                    <p>Assess how well your brand aligns with specific issues and identify areas for improvement.</p>
                </div>
                <div id="quiz-content">
                    <div class="question-container">
                        <div class="question">What type of issue are you looking to address?</div>
                        <div class="options">
                            <div class="option" onclick="selectOption('issue-type', 'social-justice')">Social Justice & Equity</div>
                            <div class="option" onclick="selectOption('issue-type', 'environmental')">Environmental Sustainability</div>
                            <div class="option" onclick="selectOption('issue-type', 'economic')">Economic Development</div>
                            <div class="option" onclick="selectOption('issue-type', 'health')">Public Health</div>
                            <div class="option" onclick="selectOption('issue-type', 'education')">Education & Workforce</div>
                        </div>
                    </div>
                    <button class="btn" onclick="nextQuestion()" id="next-btn" style="display: none;">Continue</button>
                </div>
            </div>
        `,
        
        'pov-builder': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Point-of-View Builder</h2>
                    <p>Develop your brand's stance on issues and structure compelling content around your perspective.</p>
                </div>
                <div id="pov-content">
                    <div class="input-group">
                        <label for="issue-topic">What issue or topic do you want to address?</label>
                        <textarea id="issue-topic" rows="3" placeholder="Describe the issue you want to take a stance on..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="brand-values">What are your brand's core values?</label>
                        <textarea id="brand-values" rows="3" placeholder="List your brand's key values and principles..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="target-audience">Who is your target audience?</label>
                        <textarea id="target-audience" rows="2" placeholder="Describe your primary audience..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="desired-outcome">What outcome do you want to achieve?</label>
                        <select id="desired-outcome">
                            <option value="">Select an outcome...</option>
                            <option value="awareness">Raise awareness</option>
                            <option value="education">Educate audience</option>
                            <option value="action">Drive action</option>
                            <option value="conversation">Start conversation</option>
                            <option value="leadership">Position as thought leader</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generatePOV()">Generate Point of View</button>
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
                            <option value="retail">Retail</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="nonprofit">Nonprofit</option>
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
            // Already initialized in HTML
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
function selectOption(question, value) {
    answers[question] = value;
    
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    // Show next button
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    if (currentTool === 'brand-alignment') {
        if (currentQuestion === 0) {
            showBrandAlignmentQuestions();
        } else {
            showBrandAlignmentResults();
        }
    } else if (currentTool === 'customer-quiz') {
        if (currentQuestion === 0) {
            showCustomerQuizQuestions();
        } else {
            showCustomerQuizResults();
        }
    }
}

function showBrandAlignmentQuestions() {
    const issueType = answers['issue-type'];
    const questions = getIssueQuestions(issueType);
    
    let questionsHTML = '';
    questions.forEach((q, index) => {
        questionsHTML += `
            <div class="question-container">
                <div class="question">${q.question}</div>
                <div class="options">
                    ${q.options.map(option => `
                        <div class="option" onclick="selectQuizAnswer(${index}, '${option.value}')">${option.text}</div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    questionsHTML += '<button class="btn" onclick="showBrandAlignmentResults()">Get Results</button>';
    
    document.getElementById('quiz-content').innerHTML = questionsHTML;
}

function getIssueQuestions(issueType) {
    const questionSets = {
        'social-justice': [
            {
                question: "How does your brand currently address diversity and inclusion?",
                options: [
                    { value: 'leading', text: 'Leading initiatives and programs' },
                    { value: 'supporting', text: 'Supporting existing programs' },
                    { value: 'learning', text: 'Learning and developing approach' },
                    { value: 'beginning', text: 'Just beginning to address' }
                ]
            },
            {
                question: "What's your brand's stance on systemic inequality?",
                options: [
                    { value: 'active', text: 'Actively working to dismantle' },
                    { value: 'aware', text: 'Aware and taking steps' },
                    { value: 'neutral', text: 'Neutral or undecided' },
                    { value: 'unaware', text: 'Not actively addressing' }
                ]
            }
        ],
        'environmental': [
            {
                question: "How does your brand approach sustainability?",
                options: [
                    { value: 'carbon-neutral', text: 'Carbon neutral or negative' },
                    { value: 'reducing', text: 'Actively reducing footprint' },
                    { value: 'planning', text: 'Planning sustainability initiatives' },
                    { value: 'beginning', text: 'Just starting to consider' }
                ]
            },
            {
                question: "What's your supply chain sustainability like?",
                options: [
                    { value: 'certified', text: 'Certified sustainable throughout' },
                    { value: 'auditing', text: 'Auditing and improving' },
                    { value: 'partial', text: 'Partially sustainable' },
                    { value: 'traditional', text: 'Traditional supply chain' }
                ]
            }
        ]
    };
    
    return questionSets[issueType] || questionSets['social-justice'];
}

function selectQuizAnswer(questionIndex, value) {
    answers[`question-${questionIndex}`] = value;
    
    // Remove selected class from all options in this question
    const questionContainer = document.querySelectorAll('.question-container')[questionIndex + 1];
    questionContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
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
    // Simple scoring logic - in real implementation, this would be more sophisticated
    let score = 0;
    let totalQuestions = 0;
    
    Object.keys(answers).forEach(key => {
        if (key.startsWith('question-')) {
            totalQuestions++;
            const answer = answers[key];
            if (answer === 'leading' || answer === 'active' || answer === 'carbon-neutral' || answer === 'certified') {
                score += 25;
            } else if (answer === 'supporting' || answer === 'aware' || answer === 'reducing' || answer === 'auditing') {
                score += 15;
            } else if (answer === 'learning' || answer === 'neutral' || answer === 'planning' || answer === 'partial') {
                score += 10;
            } else {
                score += 5;
            }
        }
    });
    
    const finalScore = Math.round(score / totalQuestions);
    
    if (finalScore >= 80) {
        return {
            score: finalScore,
            level: 'excellent',
            title: 'Excellent Alignment',
            description: 'Your brand shows strong alignment with this issue. You\'re well-positioned to lead conversations and drive meaningful change.',
            recommendations: [
                'Continue leading initiatives and share best practices',
                'Consider expanding your impact through partnerships',
                'Document and communicate your success stories'
            ]
        };
    } else if (finalScore >= 60) {
        return {
            score: finalScore,
            level: 'good',
            title: 'Good Alignment',
            description: 'Your brand has a solid foundation for addressing this issue. There are opportunities to strengthen your position.',
            recommendations: [
                'Develop more comprehensive policies and programs',
                'Increase internal education and training',
                'Enhance external communication about your efforts'
            ]
        };
    } else if (finalScore >= 40) {
        return {
            score: finalScore,
            level: 'fair',
            title: 'Fair Alignment',
            description: 'Your brand is beginning to address this issue but needs more strategic focus and commitment.',
            recommendations: [
                'Create a formal strategy and action plan',
                'Allocate dedicated resources and budget',
                'Establish clear metrics and accountability'
            ]
        };
    } else {
        return {
            score: finalScore,
            level: 'poor',
            title: 'Needs Improvement',
            description: 'Your brand needs to develop a more comprehensive approach to this issue.',
            recommendations: [
                'Conduct a thorough assessment of current practices',
                'Develop a roadmap for improvement',
                'Consider external expertise to accelerate progress'
            ]
        };
    }
}

// POV Builder Functions
function generatePOV() {
    const issueTopic = document.getElementById('issue-topic').value;
    const brandValues = document.getElementById('brand-values').value;
    const targetAudience = document.getElementById('target-audience').value;
    const desiredOutcome = document.getElementById('desired-outcome').value;
    
    if (!issueTopic || !brandValues || !targetAudience || !desiredOutcome) {
        alert('Please fill in all fields to generate your point of view.');
        return;
    }
    
    const pov = generatePOVContent(issueTopic, brandValues, targetAudience, desiredOutcome);
    
    const resultsHTML = `
        <div class="results">
            <h3>Your Point of View Framework</h3>
            <div class="pov-content">
                <h4>Core Position</h4>
                <p>${pov.position}</p>
                
                <h4>Key Messages</h4>
                <ul>
                    ${pov.messages.map(msg => `<li>${msg}</li>`).join('')}
                </ul>
                
                <h4>Content Structure</h4>
                <ol>
                    ${pov.structure.map(item => `<li>${item}</li>`).join('')}
                </ol>
                
                <h4>Call to Action</h4>
                <p>${pov.cta}</p>
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Professional Content Support</button>
            </div>
        </div>
    `;
    
    document.getElementById('pov-content').innerHTML = resultsHTML;
}

function generatePOVContent(issue, values, audience, outcome) {
    // This is a simplified version - in a real implementation, this could use AI
    const positions = {
        'awareness': 'Take a leadership position in raising awareness about this critical issue',
        'education': 'Serve as an educational resource to help your audience understand the complexities',
        'action': 'Inspire and enable your audience to take meaningful action',
        'conversation': 'Facilitate important conversations and diverse perspectives',
        'leadership': 'Establish your brand as a thought leader and trusted voice'
    };
    
    return {
        position: positions[outcome] || 'Take a clear, values-driven stance on this issue',
        messages: [
            `Connect this issue to your core values of ${values.split(',')[0] || 'integrity'}`,
            `Address the specific needs and concerns of ${audience}`,
            `Provide actionable insights and solutions`,
            `Maintain authenticity and transparency throughout`
        ],
        structure: [
            'Hook: Start with a compelling statistic or story',
            'Context: Provide background and relevance to your audience',
            'Position: Clearly state your brand\'s stance',
            'Evidence: Support your position with data or examples',
            'Action: Provide clear next steps for your audience',
            'Commitment: Show your brand\'s ongoing commitment'
        ],
        cta: `Ready to develop this into compelling content? Our team can help you craft messaging that resonates with your audience and drives your desired outcomes.`
    };
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
            <p><em>*All results are estimates and do not reflect final results of an engagement</em></p>
            
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
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn" onclick="window.open('https://ink-co.com/contact', '_blank')">Get Detailed Strategy</button>
            </div>
        </div>
    `;
    
    document.getElementById('roi-content').innerHTML = resultsHTML;
}

function calculateROIEstimates(budget, campaignType, industry, duration) {
    // Simplified ROI calculation - real implementation would be more sophisticated
    const multipliers = {
        'pr': { impressions: 1000, traffic: 15, leads: 0.1, value: 3 },
        'content': { impressions: 800, traffic: 25, leads: 0.15, value: 4 },
        'brand': { impressions: 1200, traffic: 10, leads: 0.05, value: 2 },
        'integrated': { impressions: 1500, traffic: 30, leads: 0.2, value: 5 }
    };
    
    const mult = multipliers[campaignType];
    const durationMultiplier = duration / 3; // Normalize to 3 months
    
    return {
        impressions: Math.round(budget * mult.impressions * durationMultiplier),
        trafficUplift: Math.round(mult.traffic * durationMultiplier),
        leads: Math.round(budget * mult.leads * durationMultiplier),
        estimatedValue: Math.round(budget * mult.value * durationMultiplier),
        successFactors: [
            'Consistent messaging across all channels',
            'Regular measurement and optimization',
            'Strong content quality and relevance',
            'Active engagement with target audience'
        ]
    };
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
            }
        ]
    };
    
    return questionSets[demographic] || questionSets['millennials'];
}

function selectCustomerAnswer(questionIndex, value) {
    answers[`customer-question-${questionIndex}`] = value;
    
    // Remove selected class from all options in this question
    const questionContainer = document.querySelectorAll('.question-container')[questionIndex + 1];
    questionContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
}

function showCustomerQuizResults() {
    const demographic = answers['demographic'];
    const results = calculateCustomerQuizScore();
    
    const resultsHTML = `
        <div class="results">
            <h3>Your Customer Knowledge Score</h3>
            <div class="score ${results.level}">${results.score}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${results.score}%"></div>
            </div>
            <p><strong>${results.title}</strong></p>
            <p>${results.description}</p>
            
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

function calculateCustomerQuizScore() {
    let score = 0;
    let totalQuestions = 0;
    
    Object.keys(answers).forEach(key => {
        if (key.startsWith('customer-question-')) {
            totalQuestions++;
            const answer = answers[key];
            // Simplified scoring - correct answers based on general knowledge
            if (answer === 'instagram' || answer === 'values' || answer === 'video' || answer === 'authenticity') {
                score += 50;
            } else {
                score += 25;
            }
        }
    });
    
    const finalScore = Math.round(score / totalQuestions);
    
    if (finalScore >= 80) {
        return {
            score: finalScore,
            level: 'excellent',
            title: 'Excellent Customer Knowledge',
            description: 'You have a deep understanding of your target audience. You\'re well-positioned to create meaningful connections.'
        };
    } else if (finalScore >= 60) {
        return {
            score: finalScore,
            level: 'good',
            title: 'Good Customer Knowledge',
            description: 'You have a solid understanding of your audience, but there\'s room to deepen your insights.'
        };
    } else {
        return {
            score: finalScore,
            level: 'poor',
            title: 'Needs Improvement',
            description: 'You could benefit from deeper customer research and insights to better understand your audience.'
        };
    }
} 