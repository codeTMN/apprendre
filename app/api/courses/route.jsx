import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq, ne, sql } from "drizzle-orm";
import { coursesTable } from "@/config/schema/";
import { currentUser } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const user = await currentUser();

  // Fetch All courses
  if (courseId == 0) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb != '{}' ::jsonb`);
    console.log("Fetched Course Data:", result);

    return NextResponse.json(result);
  }

  // Fetch course data from the database
  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));
    console.log("Fetched Course Data:", result);

    return NextResponse.json(result[0]);
  } else {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
      .orderBy(desc(coursesTable.id));
    console.log("Fetched Course Data:", result);
    return NextResponse.json(result);
  }
}
