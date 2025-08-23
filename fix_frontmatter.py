#!/usr/bin/env python3
import os
import glob
from datetime import datetime

def process_markdown_file(filepath):
    """Process a markdown file to update frontmatter for Hugo"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            body = parts[2].strip()
            
            # Parse frontmatter
            lines = frontmatter.split('\n')
            new_frontmatter = {}
            
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip()
                    
                    if key == 'title':
                        # Ensure title is quoted
                        if not (value.startswith('"') and value.endswith('"')):
                            value = f'"{value}"'
                        new_frontmatter[key] = value
                    elif key == 'date':
                        # Convert date to ISO format
                        if value:
                            try:
                                # Parse the date and convert to ISO format
                                dt = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                                new_frontmatter[key] = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                            except Exception:
                                new_frontmatter[key] = value
                    elif key == 'tags':
                        # Convert tags to array format
                        if value == 'post':
                            # Default tags for blog posts
                            filename = os.path.basename(filepath).replace('.md', '')
                            new_frontmatter[key] = f'["{filename}"]'
                        else:
                            new_frontmatter[key] = value
                    else:
                        new_frontmatter[key] = value
            
            # Reconstruct the file
            new_frontmatter_str = '\n'.join([f'{k}: {v}' for k, v in new_frontmatter.items()])
            
            # Remove any duplicate h1 titles at the beginning of content
            if body.startswith('# '):
                # Remove the first line if it's an h1 that matches the title
                body_lines = body.split('\n')
                title_from_frontmatter = new_frontmatter.get('title', '').strip('"')
                if body_lines[0].startswith('# ') and title_from_frontmatter.lower() in body_lines[0].lower():
                    body = '\n'.join(body_lines[1:]).strip()
            
            new_content = f"---\n{new_frontmatter_str}\n---\n\n{body}"
            
            # Write back to file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Processed: {filepath}")
        else:
            print(f"No frontmatter found in: {filepath}")
    else:
        print(f"File doesn't start with frontmatter: {filepath}")

def main():
    # Process all markdown files in content/posts
    posts_dir = "/Users/rian/src/github/xtellurian/xtellurian.github.io/content/posts"
    markdown_files = glob.glob(os.path.join(posts_dir, "*.md"))
    
    for filepath in markdown_files:
        process_markdown_file(filepath)
    
    print(f"Processed {len(markdown_files)} files")

if __name__ == "__main__":
    main()
