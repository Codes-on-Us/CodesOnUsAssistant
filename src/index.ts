/**
 * @codes-on-us/assistant
 *
 * Main entry point for the Assistant library.
 * Exports all components and utilities.
 */

// Export all components
export * from './components/index';

// Export store utilities (with graceful fallback if Redux not available)
export * from './store/index';
