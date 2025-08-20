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
}

function resetTool() {
    currentTool = null;
    toolContainer.innerHTML = '';
}

function getToolContent(toolName) {
    const tools = {
        'glossary-creator': `
            <div class="tool-container">
                <div class="tool-header">
                    <h2>Glossary Entry Creator - TEST</h2>
                    <p>Test version to debug the tool.</p>
                </div>
                <div id="glossary-content">
                    <p>This is a test version of the glossary tool.</p>
                    <button class="btn" onclick="alert('Glossary tool is working!')">Test Button</button>
                </div>
            </div>
        `
    };
    
    return tools[toolName] || '<div class="tool-container"><p>Tool not found.</p></div>';
}

console.log('openTool function defined:', typeof openTool);
