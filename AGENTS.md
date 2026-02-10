# AGENTS.md

This file provides essential information for AI agents working on this Hugo-based website repository.

## Project Overview

This is a personal website and blog built with Hugo using the Blowfish theme, deployed on Cloudflare Workers. The repository contains blog posts, static assets, and configuration for a static site generator.

## Essential Commands

### Development
- `yarn dev` or `yarn serve` - Start Hugo development server with live reload
- `yarn build` - Build the Hugo site to `public/` directory
- `yarn preview` - Start Wrangler development server (for testing Workers deployment)
- `yarn deploy` - Deploy to Cloudflare Workers

### Content Management
- `yarn combine` - Combine all blog posts into `all-posts-combined.md` for LLM context

## Key Commands to Run After Changes

**Always run these commands before considering work complete:**

1. **Build validation**: `yarn build` - Ensures the site builds without errors
2. **Development testing**: `yarn dev` - Start dev server to verify changes locally
3. **Deploy test**: `yarn preview` - Test Wrangler deployment locally

## Repository Structure

```
├── content/                 # Markdown content files
│   ├── posts/              # Blog posts directory
│   ├── about.md            # About page
│   └── _index.md           # Homepage content
├── config/_default/        # Hugo configuration
│   └── hugo.toml           # Main configuration with Blowfish theme settings
├── static/                 # Static assets (images, CSS, etc.)
├── themes/blowfish/        # Blowfish theme (git submodule)
├── archetypes/default.md   # Content template for new posts
├── public/                 # Generated site output (build artifact)
├── wrangler.jsonc          # Cloudflare Workers configuration
└── package.json            # Node.js dependencies and scripts
```

## Content Guidelines

### Blog Posts
- Location: `content/posts/`
- Format: Markdown with YAML frontmatter
- Template: Uses `archetypes/default.md` for new content
- Naming convention: Use kebab-case for filenames

### Frontmatter Structure
```yaml
+++
date = '2025-01-01'
draft = true
title = 'Post Title'
+++
```

## Theme Configuration

- **Theme**: Blowfish (managed via git submodule)
- **Config**: Main settings in `config/_default/hugo.toml`
- **Base URL**: `https://xtellurian.github.io/`
- **Language**: English (`en`)
- **Features**: Emoji support, RSS, JSON output, sitemap

## Deployment

- **Platform**: Cloudflare Workers (migrated from Cloudflare Pages in Aug 2025)
- **Build output**: `public/` directory
- **Config**: `wrangler.jsonc`
- **Assets**: Served from Cloudflare Workers Assets
- **Automated deployment**: Normally handled via GitHub Actions/CI on push to main branch
- **Manual deployment**: Use `yarn deploy` only for testing or manual overrides

## Development Workflow

1. **Content changes**: Edit markdown files in `content/`
2. **Style changes**: Modify theme configs or add custom CSS
3. **Asset updates**: Place images/files in `static/`
4. **Validation**: Always run `yarn build` to check for errors
5. **Local testing**: Use `yarn dev` for live preview
6. **Deployment**: `yarn deploy` for production

## Git Submodule Management

The Blowfish theme is included as a git submodule:

```bash
# Update theme
cd themes/blowfish
git pull origin main
cd ../..
git add themes/blowfish
git commit -m "Update Blowfish theme"
```

## Important Notes

- Hugo extended version is recommended for theme features
- Node.js dependencies managed with Yarn
- Images should be placed in appropriate subdirectories under `static/`
- The `public/` directory is generated and should not be manually edited
- All content should remain as markdown files per project guidelines

## Testing Checklist

Before completing any task, ensure:
- [ ] `yarn build` completes without errors
- [ ] Site renders correctly with `yarn dev`
- [ ] All new content appears as expected
- [ ] Images and static assets load properly
- [ ] No broken links or missing resources