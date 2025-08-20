# Glossary Entry Creator - Setup Guide

## Overview
The Glossary Entry Creator tool allows Ink team members to create glossary entries and automatically publish them as drafts in WordPress.

## WordPress Setup Required

### 1. WordPress Site Configuration
You need access to a WordPress site with the REST API enabled (most WordPress sites have this by default).

### 2. Application Password Setup
1. Go to your WordPress admin panel
2. Navigate to Users → Profile
3. Scroll down to "Application Passwords"
4. Add a new application password with a descriptive name (e.g., "INK Glossary Tool")
5. Copy the generated password

### 3. Environment Variables
Create a `.env` file in your project root with the following variables:

```
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your-username
WORDPRESS_APPLICATION_PASSWORD=your-application-password
```

### 4. WordPress Permissions
Ensure your WordPress user has the following capabilities:
- `edit_posts` - to create draft posts
- `publish_posts` - to create posts (even as drafts)

## How to Use the Tool

1. **Access the Tool**: Click on "Glossary Entry Creator" from the main tools page
2. **Fill in the Form**:
   - **Term** (required): The word or phrase to define
   - **Definition** (required): Clear, concise definition
   - **Category** (optional): e.g., Marketing, Technology, Business Strategy
   - **Related Terms** (optional): Comma-separated related terms
   - **Author** (optional): Your name or team name
3. **Create Entry**: Click "Create Glossary Entry"
4. **Review**: The tool will create a draft post in WordPress and provide a link to view it

## WordPress Post Structure
Each glossary entry creates a WordPress post with:
- **Title**: The term being defined
- **Content**: Formatted definition with category and related terms
- **Status**: Draft (ready for review and publishing)
- **Tags**: "glossary" and "ink-glossary"
- **Custom Meta**: Additional metadata for organization

## Troubleshooting

### Common Issues:
1. **Authentication Error**: Check your WordPress username and application password
2. **Permission Error**: Ensure your WordPress user has edit_posts capability
3. **Network Error**: Verify your WordPress site URL is correct and accessible

### Testing the Connection:
You can test the WordPress connection by making a simple API call:
```
GET https://your-wordpress-site.com/wp-json/wp/v2/posts
```

## Security Notes
- Application passwords are more secure than regular passwords for API access
- The tool only creates draft posts, so content won't be published automatically
- All API calls are made server-side to protect credentials

## Customization
The tool can be customized to:
- Add custom post types for glossary entries
- Include additional metadata fields
- Modify the post content structure
- Add category/tag management
