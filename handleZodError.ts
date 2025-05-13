import {ZodError} from "zod/dist/esm";

/**
 * Formats ZodError into user-friendly error messages
 * @param error The ZodError instance
 * @param options Configuration options
 * @param options.logToConsole Whether to log errors to console (default: false)
 * @returns Array of formatted error messages
 */
export function handleZodError(
    error: ZodError,
    options: { logToConsole?: boolean, originalObject?: any } = {}
): string[] {
    const {logToConsole = false} = options;
    const messages: string[] = ["Validation failed with the following errors:"];

    if (error.issues && Array.isArray(error.issues)) {
        error.issues.forEach(issue => {
            const fieldPath = issue.path.join('.');
            messages.push(`- Field: ${fieldPath || 'root'}`);
            if (options.originalObject) {
                // get value from fieldPath
                const value = fieldPath.split('.').reduce((obj, key) => obj[key], options.originalObject);
                messages.push(`  Value: ${JSON.stringify(value)}`);
            }
            messages.push(`  Error: ${issue.message}`);

            // Extract and display expected values for different error types
            if (issue.code === 'invalid_union' && Array.isArray(issue.errors)) {
                // Look through all union errors for enum values
                issue.errors.forEach(errorGroup => {
                    if (Array.isArray(errorGroup)) {
                        errorGroup.forEach(err => {
                            // Check for invalid_value errors with values array (enum case)
                            if (err.code === 'invalid_value' && Array.isArray(err.values)) {
                                messages.push(`  Expected values: ${err.values.join(' | ')}`);
                            }
                            // Check for invalid_type errors with expected type
                            else if (err.code === 'invalid_type' && err.expected) {
                                messages.push(`  Expected type: ${err.expected}`);
                            }
                        });
                    }
                });
            }
            // Handle direct invalid_value errors (non-union case)
            else if (issue.code === 'invalid_value' && Array.isArray(issue.values)) {
                messages.push(`  Expected values: ${issue.values.join(' | ')}`);
            }
            // Handle direct invalid_type errors
            else if (issue.code === 'invalid_type' && issue.expected) {
                messages.push(`  Expected type: ${issue.expected}`);
            }
        });
    } else {
        messages.push(`Error structure is different than expected: ${JSON.stringify(error)}`);
    }

    // Log to console if requested
    if (logToConsole) {
        messages.forEach(msg => console.error(msg));
    }

    return messages;
}