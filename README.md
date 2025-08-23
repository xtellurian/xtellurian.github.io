# Rian's Personal Website

A Hugo-based personal website and blog hosted on Cloudflare Workers.

## 🚀 Tech Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/)
- **Theme**: [Blowfish](https://blowfish.page/) (via git submodule)
- **Hosting**: Cloudflare Workers with static assets
- **Deployment**: Wrangler CLI

## 🎨 Theme Setup

This site uses the [Blowfish theme](https://github.com/nunocoracao/blowfish) managed as a git submodule.

### Git Submodule Configuration

The theme is included as a git submodule located at `themes/blowfish`:

```bash
# Clone repository with submodules
git clone --recursive https://github.com/xtellurian/xtellurian.github.io.git

# Or if already cloned, initialize submodules
git submodule update --init --recursive
```

### Updating the Theme

To update the Blowfish theme to the latest version:

```bash
cd themes/blowfish
git pull origin main
cd ../..
git add themes/blowfish
git commit -m "Update Blowfish theme"
```

## 🛠️ Development

### Prerequisites

- Node.js 20.18.1+ (managed with nvm)
- Hugo (installed via Homebrew)
- Yarn package manager

### Setup

1. **Clone the repository**:
   ```bash
   git clone --recursive https://github.com/xtellurian/xtellurian.github.io.git
   cd xtellurian.github.io
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Start development server**:
   ```bash
   # Hugo development server (recommended for content editing)
   yarn dev
   
   # Or Wrangler development server (for testing Workers deployment)
   yarn preview
   ```

### Available Scripts

- `yarn build` - Build the Hugo site
- `yarn dev` - Start Hugo development server
- `yarn serve` - Alias for `yarn dev`
- `yarn preview` - Start Wrangler development server
- `yarn deploy` - Deploy to Cloudflare Workers

## 🌐 Deployment

This site is deployed on **Cloudflare Workers** (migrated from Cloudflare Pages in August 2025).

### Deployment Configuration

The deployment is configured via `wrangler.jsonc`:

```jsonc
{
  "name": "xtellurian-github-io",
  "compatibility_date": "2025-08-23",
  "assets": {
    "directory": "./public"
  }
}
```

### Manual Deployment

```bash
# Build the site
yarn build

# Deploy to Cloudflare Workers
yarn deploy
```

### Automatic Deployment

The site can be configured for automatic deployment via GitHub Actions or Cloudflare's CI/CD integration.

## 📁 Project Structure

```
├── archetypes/          # Hugo content templates
├── assets/              # Hugo assets (CSS, JS, etc.)
├── config/              # Hugo configuration files
│   └── _default/
│       └── hugo.toml    # Main Hugo config with Blowfish theme
├── content/             # Markdown content files
│   ├── posts/           # Blog posts
│   └── about.md         # About page
├── data/                # Hugo data files
├── i18n/                # Internationalization files
├── images/              # Static images
├── layouts/             # Custom Hugo layouts
├── public/              # Generated site (build output)
├── static/              # Static assets
├── themes/
│   └── blowfish/        # Blowfish theme (git submodule)
├── hugo.toml            # Legacy Hugo config (main config is in config/_default/)
├── package.json         # Node.js dependencies and scripts
├── wrangler.jsonc       # Cloudflare Workers configuration
└── .gitmodules          # Git submodule configuration
```

## 🔧 Configuration

### Hugo Configuration

The main Hugo configuration is in `config/_default/hugo.toml`. Key settings:

- **Theme**: `blowfish`
- **Base URL**: Set in the main `hugo.toml` file
- **Content Language**: English (`en`)
- **Taxonomies**: Tags, categories, authors, series

### Theme Configuration

Blowfish theme configuration is managed through multiple files in the `config/_default/` directory. Refer to the [Blowfish documentation](https://blowfish.page/docs/) for detailed configuration options.

## 🚀 Migration Notes

**August 2025**: Migrated from Cloudflare Pages to Cloudflare Workers for improved flexibility and performance.

### Changes Made:
- Added Wrangler v4.32.0 as dev dependency
- Created `wrangler.jsonc` configuration
- Updated Node.js to v20.19.4 for compatibility
- Added deployment scripts to `package.json`

### Benefits:
- More flexible deployment options
- Better integration with Cloudflare ecosystem
- Improved performance with Workers Assets

## 📝 Content Management

### Adding Blog Posts

1. Create a new markdown file in `content/posts/`
2. Use the frontmatter template from `archetypes/default.md`
3. Write your content in Markdown
4. Build and preview with `yarn dev`

### Image Management

- Place images in the `images/` directory
- Reference them in markdown using Hugo's image processing features
- The Blowfish theme provides built-in image optimization

## 🤝 Contributing

This is a personal website, but feel free to:
- Report issues with the site
- Suggest improvements
- Share feedback on content

## 📄 License

MIT License - See the theme's license for Blowfish theme usage.
