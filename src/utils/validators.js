import { z } from "zod";

export const authSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    fullName: z.string().optional(),
    confirm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.confirm && data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm"],
        message: "Passwords do not match.",
      });
    }

    if (data.confirm && (!data.fullName || data.fullName.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fullName"],
        message: "Full name is required.",
      });
    }
  });

export const profileSchema = z.object({
  roll_no: z
    .string()
    .regex(/^\d+$/, "Numeric only.")
    .max(12, "Maximum 12 digits."),

  branch: z.enum([
    "AIDS",
    "CSE",
    "AIML",
    "IT",
    "CIC",
    "ECE",
    "EVL",
    "MECHANICAL",
    "CIVIL",
    "BIOTECH",
  ]),

  semester: z.coerce.number().min(1).max(8),

  section: z.enum(["1", "2", "3", "4", "5", "6"], {
    errorMap: () => ({ message: "Select a section." }),
  }),

  // SGPAs are fully optional — any value or empty is accepted
  sgpas: z.record(z.string(), z.any()).default({}),
});

export function buildSgpaArray(semester, sgpas = {}) {
  return Array.from(
    { length: semester - 1 },
    (_, i) => {
      const val = parseFloat(sgpas[String(i + 1)]);
      return isNaN(val) ? null : val;
    }
  );
}
