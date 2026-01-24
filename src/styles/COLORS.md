# NoobShroom Color System

## Overview

The color system is centralized in `src/styles/colors.css` and uses CSS custom properties (variables) to maintain consistency across the application. All colors are defined in one place and referenced throughout the codebase using semantic variable names.

## File Location
- **CSS Variables**: `src/styles/colors.css`
- **Usage**: Imported globally in `src/app/layout.js`

## Color Categories

### Primary Colors (Backgrounds)
- `--color-bg-darkest`: #0f172a - Darkest background
- `--color-bg-dark`: #1f2a44 - Dark background
- `--color-bg-darker`: #1a1f2e - Darker background

### Border Colors
- `--color-border-dark`: #2b3a55 - Primary border color
- `--color-border-medium`: #3a4a6a - Medium border color
- `--color-border-light`: rgba(148, 163, 184, 0.2) - Light/transparent border

### Text Colors
- `--color-text-primary`: #f8fafc - Main text (brightest)
- `--color-text-secondary`: #cbd5f5 - Secondary text
- `--color-text-tertiary`: #e2e8f0 - Tertiary text
- `--color-text-muted`: #94a3b8 - Muted/disabled text

### Accent Colors
- `--color-accent-primary`: #2563eb - Blue accent for primary actions
- `--color-accent-hover`: #1d4ed8 - Blue hover state

### Semantic Colors

#### Success (Like/Approve)
- `--color-semantic-success`: #4caf50
- `--color-semantic-success-light`: #66bb6a
- `--color-semantic-success-lighter`: #81c784
- `--color-semantic-success-bg-light`: rgba(76, 175, 80, 0.2)

#### Danger (Dislike/Delete)
- `--color-semantic-danger`: #f44336
- `--color-semantic-danger-light`: #ef5350
- `--color-semantic-danger-lighter`: #e57373
- `--color-semantic-danger-bg-light`: rgba(244, 67, 54, 0.2)

#### Warning
- `--color-semantic-warning`: #f97316
- `--color-semantic-warning-light`: #fb923c
- `--color-semantic-warning-bg-light`: rgba(249, 115, 22, 0.2)

#### Info
- `--color-semantic-info`: #2563eb
- `--color-semantic-info-light`: #60a5fa
- `--color-semantic-info-bg-light`: rgba(37, 99, 235, 0.2)

### Gradients
- `--gradient-bg-primary`: linear-gradient(135deg, #0f172a, #1f2a44) - Main gradient background
- `--gradient-bg-subtle`: linear-gradient(135deg, #1f2a44, #2a3a55) - Subtle gradient
- `--gradient-accent-blue`: linear-gradient(135deg, #2563eb, #7c3aed) - Blue accent gradient

### Component Backgrounds
- `--color-card-bg`: Gradient - Card/component backgrounds
- `--color-section-bg`: Gradient - Section backgrounds
- `--color-component-bg-light`: rgba(15, 23, 42, 0.8) - Light component background
- `--color-button-bg`: #2a2a2a - Button background
- `--color-button-hover`: #333 - Button hover state
- `--color-input-bg`: #0f172a - Input field background
- `--color-bg-card`: #111827 - Card element background

## Usage Examples

### Basic Usage
```css
.my-element {
  background: var(--color-bg-dark);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-dark);
}
```

### Semantic Usage
```css
.success-badge {
  background: var(--color-semantic-success-bg-light);
  color: var(--color-semantic-success-light);
  border-color: var(--color-semantic-success);
}

.error-message {
  color: var(--color-semantic-danger);
}
```

### Gradient Usage
```css
.hero-section {
  background: var(--gradient-bg-primary);
}

.primary-button {
  background: var(--gradient-accent-blue);
}
```

## Refactored Files

All component CSS files have been updated to use these variables:

### Core Components
- ✅ `src/components/tools/ViewBuild/ViewBuild.module.css`
- ✅ `src/components/tools/BrowseBuilds/BrowseBuilds.module.css`
- ✅ `src/components/builder/talents/TalentBuilder.module.css`
- ✅ `src/components/builder/talents/VoteButtons.module.css`
- ✅ `src/components/talent/TalentTree/TalentTree.module.css`
- ✅ `src/components/layout/navbar/navbar.module.css`
- ✅ `src/components/layout/navItem/navItem.module.css`

## Theme

The application uses a **dark blue theme** with the following characteristics:
- Dark blue backgrounds (#0f172a to #1f2a44)
- Light blue/white text (#f8fafc)
- Blue accent for primary actions (#2563eb)
- Green for success states (#4caf50)
- Red for danger/error states (#f44336)
- Orange for warnings (#f97316)

## Design Notes

1. **Color Hierarchy**: Use darker backgrounds with lighter text for accessibility
2. **Contrast**: All text colors maintain sufficient contrast with their backgrounds
3. **Semantic Naming**: Variable names describe their purpose, not their hex value
4. **Consistency**: Always use variables instead of hardcoding hex colors
5. **Backward Compatibility**: Legacy variable mappings are provided for transition

## Adding New Colors

When adding new colors:
1. Add the color to `src/styles/colors.css` in the appropriate category
2. Use a semantic name (e.g., `--color-semantic-mycolor`)
3. Add both base and light/lighter variants for consistency
4. Document the color and its purpose in this file
5. Update any component CSS that uses similar colors
