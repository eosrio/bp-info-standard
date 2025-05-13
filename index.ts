import {ZodError} from 'zod';

// Main entry point for the bp-info-standard library
export {BPInfoSchema} from './schema';
export {handleZodError} from './handleZodError';

// Re-export ZodError type
export {ZodError};