#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = './content/posts';
const OUTPUT_FILE = './all-posts-combined.md';

function getAllMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

function readPostContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  // Add a clear separator and filename header
  return `\n\n${'='.repeat(80)}\n# FILE: ${filename}\n${'='.repeat(80)}\n\n${content}`;
}

function combineAllPosts() {
  console.log('📝 Combining all blog posts into a single markdown file...');
  
  try {
    const postFiles = getAllMarkdownFiles(POSTS_DIR);
    console.log(`Found ${postFiles.length} blog posts`);
    
    let combinedContent = `# Combined Blog Posts\n\nThis file contains all blog posts combined for LLM context purposes.\nGenerated on: ${new Date().toISOString()}\nTotal posts: ${postFiles.length}\n`;
    
    // Sort files alphabetically for consistent output
    postFiles.sort();
    
    for (const postFile of postFiles) {
      console.log(`  Adding: ${path.basename(postFile)}`);
      const content = readPostContent(postFile);
      combinedContent += content;
    }
    
    fs.writeFileSync(OUTPUT_FILE, combinedContent, 'utf8');
    console.log(`✅ Successfully created ${OUTPUT_FILE}`);
    console.log(`📄 Combined file size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
    
  } catch (error) {
    console.error('❌ Error combining posts:', error.message);
    process.exit(1);
  }
}

// Run the script
combineAllPosts();
