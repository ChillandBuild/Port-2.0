import { redirect } from "next/navigation";

/** The course lives at /lead-generation now; old links land there. */
export default function CourseRedirect() {
  redirect("/lead-generation");
}
