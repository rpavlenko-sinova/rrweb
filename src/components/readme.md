# Components Directory

This directory contains all React components organized by their intended usage and complexity level.

## Structure

Components are organized into separate folders based on their purpose:

- **`./ui/`** - Folder for shadcn components
- **`./ComponentName/`** - Feature-specific components with business logic

If number of components overwhelming - group some of those based on their purpose.

## Best Practices

1. **Props Interface**: Define clear TypeScript interfaces/types for component props
2. **Exports**: Export components as named exports for better tree-shaking
3. **Styling**: Use Tailwind CSS classes for consistent styling
