# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `yarn build` - Build the site with Hugo
- `yarn serve` or `yarn dev` - Start development server with live reload

## Project Structure
- `layouts/` - Hugo templates
- `content/` - Markdown content files
- `static/` - Static assets (images, CSS, etc.)
- `public/` - Generated site output

## Content Guidelines

- Always keep the blog posts as markdown. Any style changes should be done elsewhere

## Code Style Guidelines
- Use spaces for indentation (2 spaces)
- Follow JS Standard Style for JavaScript
- Use Hugo templating for layouts
- Markdown files (`.md`) use Hugo's template system
- Keep template logic minimal and focused on presentation
- Use relative paths for internal links
- Image paths should be relative to root
- Organize blog posts in `content/posts/` directory
- Use kebab-case for filenames

## Error Handling
- Validate all templates during development with `yarn dev`
- Check image paths before committing changes