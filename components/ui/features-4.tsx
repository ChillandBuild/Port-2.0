import {
  Cog,
  GraduationCap,
  HeartPulse,
  Landmark,
  Languages,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getSectors } from "@/lib/backend/site-content-loaders";

const ICON_BY_TAG: Record<string, LucideIcon> = {
  SaaS: Zap,
  Markets: TrendingUp,
  Services: Languages,
  Staffing: Users,
  Health: HeartPulse,
  Finance: Landmark,
  Commerce: ShoppingCart,
  Education: GraduationCap,
  Engineering: Cog,
};

export async function Features() {
  const SECTORS = await getSectors();

  return (
    <section
      className="py-8 md:py-12 bg-[var(--surface-world)] text-[var(--on-world)]"
      id="range"
      aria-labelledby="range-heading"
    >
      <div className="mx-auto max-w-5xl space-y-6 px-6 md:space-y-8">
        <div className="relative z-10 mx-auto max-w-xl space-y-3 text-center md:space-y-4">
          <h2
            id="range-heading"
            className="text-balance text-4xl font-medium lg:text-5xl font-[family-name:var(--font-display)]"
          >
            Nine sectors. Twenty-four global markets.
          </h2>
          <p className="text-[var(--on-world-soft)]">
            The method holds across all of them. The message never does, which is the entire point.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y divide-[var(--rule)] border border-[var(--rule)] *:p-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => {
            const Icon = ICON_BY_TAG[sector.tag] ?? Zap;
            return (
              <div className="min-h-[190px]!" key={sector.title}>
                <Icon
                  className={`size-5 mb-3 ${sector.core ? "text-[var(--accent)]" : "text-[var(--on-world-soft)]"}`}
                  aria-hidden="true"
                />
                <h3
                  className="mb-3! text-2xl font-semibold leading-tight tracking-tight font-[family-name:var(--font-display)]"
                  style={{ color: "var(--accent)" }}
                >
                  {sector.title}
                  {sector.core && (
                    <span
                      className="ml-1.5 inline-block size-1.5 rounded-full bg-[var(--accent)] align-middle"
                      aria-hidden="true"
                    />
                  )}
                </h3>
                <p className="text-sm text-[var(--on-world-soft)]">{sector.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
