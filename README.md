# INK Interactive Tools - Prototypes

A collection of five professional interactive marketing tools designed for INK, a strategic communications firm. These tools help brands navigate complex marketing challenges and make data-driven decisions.

## 🎯 Tools Included

### 1. Brand Alignment Quiz
Assess how well your brand aligns with specific issues (social justice, environmental sustainability, economic development, etc.) and identify areas for improvement. Provides actionable recommendations and scoring.

### 2. Point-of-View Builder
Develop your brand's stance on issues and structure compelling content around your perspective. Input your issue, brand values, target audience, and desired outcome to get a comprehensive messaging framework.

### 3. ROI Calculator
Estimate potential returns from PR, content, and brand marketing investments. Input budget, campaign type, industry, and duration to get projections for media impressions, traffic uplift, lead generation, and estimated value.

### 4. Campaign Channel Optimizer
Find the optimal mix of marketing channels for your specific goals and industry. Get a visual breakdown of recommended channel allocation with detailed activities for each channel.

### 5. Customer Knowledge Quiz
Test how well you understand your target audience and identify knowledge gaps. Choose your demographic and answer questions about their preferences and behaviors.

## 🚀 Features

- **Professional Design**: Modern, responsive interface with INK branding
- **Interactive Elements**: Engaging quizzes, calculators, and forms
- **Data Visualization**: Charts and progress bars for results
- **Mobile Responsive**: Works seamlessly on all devices
- **Modal Interface**: Clean, focused tool experience
- **Call-to-Action Integration**: Direct links to INK's contact page

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality and dynamic content
- **Chart.js**: Data visualization for channel optimization
- **Google Fonts**: Inter font family for professional typography

## 📁 File Structure

```
INKprototypes/
├── index.html          # Main page with tool navigation
├── styles.css          # Complete styling and responsive design
├── script.js           # All interactive functionality
└── README.md           # Project documentation
```

## 🚀 Deployment

### GitHub Pages Setup

1. **Push to GitHub**: Ensure all files are committed and pushed to your repository
   ```bash
   git add .
   git commit -m "Initial commit: INK Interactive Tools"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access Your Site**: Your tools will be available at `https://sodapork.github.io/INKprototypes/`

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sodapork/INKprototypes.git
   cd INKprototypes
   ```

2. **Open in browser**: Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## 🎨 Customization

### Branding Updates
- Update colors in `styles.css` to match INK's brand guidelines
- Modify the logo and tagline in `index.html`
- Update contact links to point to INK's actual contact page

### Content Updates
- Tool questions and logic can be modified in `script.js`
- Scoring algorithms can be adjusted for different business needs
- Add new tools by extending the `getToolContent()` function

### Styling Changes
- All styling is centralized in `styles.css`
- Responsive breakpoints are clearly defined
- Color variables can be added for easier brand management

## 📊 Tool Logic

### Brand Alignment Quiz
- Categorizes issues into 5 main areas
- Uses weighted scoring based on answer selections
- Provides 4-tier scoring system (Excellent, Good, Fair, Poor)
- Generates specific recommendations based on score

### ROI Calculator
- Uses industry-specific multipliers for different campaign types
- Factors in campaign duration and budget
- Provides conservative estimates with disclaimers
- Includes success factors and best practices

### Channel Optimizer
- Maps campaign goals to optimal channel mixes
- Uses Chart.js for visual representation
- Provides detailed breakdown of activities per channel
- Includes strategic recommendations

## 🔧 Future Enhancements

### Potential Improvements
- **AI Integration**: Add natural language processing for POV Builder
- **Data Persistence**: Save user results and preferences
- **Advanced Analytics**: Track tool usage and engagement
- **Custom Branding**: Allow clients to customize colors and logos
- **Export Functionality**: Allow users to download results as PDF

### Technical Enhancements
- **Progressive Web App**: Add offline functionality
- **API Integration**: Connect to CRM systems for lead capture
- **A/B Testing**: Test different question formats and flows
- **Performance Optimization**: Implement lazy loading and caching

## 📞 Support

For questions about these tools or to discuss custom development:
- Visit: [https://ink-co.com](https://ink-co.com)
- Contact: [https://ink-co.com/contact](https://ink-co.com/contact)

## 📄 License

This project is proprietary to INK. All rights reserved.

---

**Built with ❤️ for INK's clients and prospects** 