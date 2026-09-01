/**
 * The world is generated once, deterministically, and shared. The canvas and the
 * cadence rail must read the same cohort or the numbers on the rail would not
 * describe the dots on screen.
 */
import { buildClusters, buildCohort, buildField } from "@/lib/frontend/world";

/** One tile of records, repeated across the plane by the renderer. */
export const FIELD = buildField();
export const CLUSTERS = buildClusters(52);
/** Enough to read as a stream at the first gate, small enough that a booked
 * contact is still a visible event rather than a statistic. */
export const COHORT = buildCohort(240);
