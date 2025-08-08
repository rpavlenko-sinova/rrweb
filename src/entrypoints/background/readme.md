# Background

Background directory is for storing init script and handlers.

## Structure

- **`index.js`** - main file of this directory. All helpers should be initiated inside.
- **`./messagingHandler/`** - Folder for messaging handlers, to create separate files for appropriate context

## Best practices

1. **Keep Root index.ts clean** - The main background script should only handle initialization and critical setup
2. **Organize message handlers by context** - Create separate files for different contexts.
3. **Don't make extensive files** - if line count in file > 300 - something went wrong. Move helpers to utils, split handlers to multiple, etc.
4. **Use try-catch-finally blocks** - Better for debugging, and creating non interruptive flow
