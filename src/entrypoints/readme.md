# Entrypoints Directory

This directory contains all browser extension entry points organized by their functionality and target context.

## Structure

Entry points are organized into separate folders based on their purpose:

- **`./background/`** - Background script entry point for extension initialization and message handling
- **`./popup/`** - Popup UI entry point with React components and user interface
- **`./somename.content/`** - Content script entry point

## Best Practices

1. **Nesting entrypoints** - Entrypoints must be zero or one levels deep for WXT to discover and build them
2. **Entrypoint init file** - Each entrypoint should have a index.ts file from which it going to be initiated
