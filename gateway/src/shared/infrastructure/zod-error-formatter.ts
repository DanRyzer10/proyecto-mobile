import { ZodError } from "zod";

export interface FormattedValidationError {
    error: string;
    message: string;
    fields: {
        field: string;
        message: string;
        code: string;
    }[];
}

export function formatZodError(zodError: ZodError): FormattedValidationError {
    const fields = zodError?.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
    }));

    return {
        error: "Validation error",
        message: `${fields.length} campo(s) con error`,
        fields,
    };
}
