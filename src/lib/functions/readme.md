# Functions Directory

This directory contains all utility functions organized by their intended usage context.

## Structure

Functions are organized into separate folders based on their execution context:

- **`./`** - Root folder. Helper functions that can be used across multiple files can be placed directly in this folder
- **`./background/`** - Functions meant to be used only in background scripts
- **`./content/`** - Functions meant to be used only in content scripts
- **`./popup/`** - Functions meant to be used only in popup scripts
- **`./options/`** - Functions meant to be used only in options pages

Feel free to group functions inside those folders, so it's easier to find them later

## Best Practices

1. **Context Separation**: Keep functions in their appropriate context folders
2. **Exports**: Export functions as named exports for better tree-shaking

## Examples

- `background/background.ts` - Background script specific functions
- `content/content.ts` - Content script specific functions
