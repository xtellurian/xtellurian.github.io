# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `yarn build` - Build the site
- `yarn serve` or `yarn dev` - Start development server with live reload

## Project Structure
- `_layouts/` - Nunjucks templates
- `_data/` - JSON data files
- `blog/posts/` - Markdown blog content
- `images/` - Static images

## Code Style Guidelines
- Use spaces for indentation (2 spaces)
- Follow JS Standard Style for JavaScript
- Use Nunjucks for templating (`.njk` extension)
- Markdown files (`.md`) use Nunjucks as template engine
- Keep template logic minimal and focused on presentation
- Use relative paths for internal links
- Image paths should be relative to root
- Organize blog posts in `blog/posts/` directory
- Use kebab-case for filenames

## Error Handling
- Validate all templates during development with `yarn dev`
- Check image paths before committing changes