"use client";

/**
 * The lane a /hire visitor picks — "hiring for a role" or "buying outbound" —
 * shared between two DOM-separated blocks: the toggle (near the top) and the
 * money & fit section (further down), which reads it to swap its content.
 * React Context is the minimal way to do that without prop-drilling through a
 * server-component tree; the Teardown and capture-form blocks in between sit
 * inside the provider as plain children and never read the context at all.
 */

import { createContext, useContext, useState } from "react";
import type { Lane } from "@/lib/submissions";

interface LaneContextValue {
  lane: Lane;
  setLane: (lane: Lane) => void;
}

const LaneCtx = createContext<LaneContextValue | null>(null);

export function LaneProvider({ children }: { children: React.ReactNode }) {
  const [lane, setLane] = useState<Lane>("hiring");
  return <LaneCtx.Provider value={{ lane, setLane }}>{children}</LaneCtx.Provider>;
}

export function useLane(): LaneContextValue {
  const ctx = useContext(LaneCtx);
  if (!ctx) throw new Error("useLane must be used within a LaneProvider");
  return ctx;
}
