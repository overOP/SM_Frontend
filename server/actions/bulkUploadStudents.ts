import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const payloadSchema = z.array(
  z.object({
    name: z.string().min(1),
    admissionId: z.string().min(1),
    className: z.string().min(1),
    section: z.string().min(1),
    email: z.string().email().optional(),
    guardian: z.string().optional(),
  })
);

export async function bulkUploadStudentsAction(payload: unknown) {
  const rows = payloadSchema.parse(payload);

  return prisma.$transaction(async (tx) => {
    const created = [];
    for (const row of rows) {
      const existing = await tx.student.findUnique({
        where: { admissionId: row.admissionId },
      });
      if (existing) {
        throw new Error(`Duplicate Admission ID: ${row.admissionId}`);
      }
      const student = await tx.student.create({
        data: {
          name: row.name,
          admissionId: row.admissionId,
          className: row.className,
          section: row.section,
          email: row.email ?? `${row.admissionId.toLowerCase()}@school.edu`,
          guardian: row.guardian ?? "",
        },
      });
      created.push(student);
    }
    return { createdCount: created.length };
  });
}
