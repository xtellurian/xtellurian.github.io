#!/usr/bin/env python3
import os
import glob

def fix_tags_format(filepath):
    """Fix tags format in frontmatter to proper YAML array format"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('---'):
        # Split frontmatter and content
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            body = parts[2].strip()
            
            lines = frontmatter.split('\n')
            new_lines = []
            
            for line in lines:
                if line.strip().startswith('tags:'):
                    # Extract the tags part
                    tags_part = line.split(':', 1)[1].strip()
                    
                    # Check if it's already in array format
                    if tags_part.startswith('[') and tags_part.endswith(']'):
                        new_lines.append(line)
                    else:
                        # Convert comma-separated to array format
                        tags = [tag.strip().strip('"').strip("'") for tag in tags_part.split(',')]
                        # Clean up tags and convert to array format
                        clean_tags = []
                        for tag in tags:
                            if tag and tag != 'post':
                                # Replace spaces with hyphens
                                clean_tag = tag.replace(' ', '-')
                                clean_tags.append(f'"{clean_tag}"')
                        
                        if clean_tags:
                            new_tags_line = f'tags: [{", ".join(clean_tags)}]'
                        else:
                            # Default tag based on filename
                            filename = os.path.basename(filepath).replace('.md', '')
                            new_tags_line = f'tags: ["{filename}"]'
                        
                        new_lines.append(new_tags_line)
                else:
                    new_lines.append(line)
            
            # Reconstruct the file
            new_frontmatter = '\n'.join(new_lines)
            new_content = f"---\n{new_frontmatter}\n---\n\n{body}"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Fixed tags in: {filepath}")

def main():
    posts_dir = "/Users/rian/src/github/xtellurian/xtellurian.github.io/content/posts"
    markdown_files = glob.glob(os.path.join(posts_dir, "*.md"))
    
    for filepath in markdown_files:
        fix_tags_format(filepath)
    
    print(f"Processed {len(markdown_files)} files")

if __name__ == "__main__":
    main()
