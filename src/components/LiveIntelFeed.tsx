import React from "react";

interface LiveIntelFeedProps {
  news: any[];
  location: string;
}

const getShortLocation = (locationName: string) => {
  const safe = (locationName ?? "").trim();
  const segments = safe
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return segments.slice(-2).join(", ") || safe || "N/A";
};

function formatNeonTimestamp(pubDate: string) {
  if (!pubDate) return "";
  try {
    const d = new Date(pubDate);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    }
  } catch {
    /* fall through */
  }
  // Already a locale time string from the news API, or unparsable
  return pubDate;
}

const LiveIntelFeed = ({ news, location }: LiveIntelFeedProps) => {
  const hasIntel = Array.isArray(news) && news.length > 0;
  const shortLocation = getShortLocation(location);

  return (
    <section
      className="relative rounded-lg border border-cyan-500/30 bg-card/50 p-3 md:p-4 overflow-hidden"
      aria-label="Live climate intelligence feed"
    >
      {/* Local scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.06) 2px, rgba(34,211,238,0.06) 3px)",
          animation: "scanline-drift 10s linear infinite",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${hasIntel ? "bg-emerald-400" : "bg-red-500"} animate-pulse`}
            style={{
              boxShadow: hasIntel ? "0 0 20px rgba(52, 211, 153, 0.45)" : "0 0 20px rgba(239, 68, 68, 0.45)",
            }}
          />

          <h2 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-cyan-200">
            LIVE CLIMATE INTEL // {shortLocation}
          </h2>
        </div>

        <div className="font-mono text-[10px] text-cyan-300 whitespace-nowrap">
          {hasIntel ? "FEED ACTIVE" : "STANDBY"}
        </div>
      </div>

      <div className="relative">
        <div className="max-h-[220px] md:max-h-[260px] overflow-y-auto pr-1 space-y-2">
          {hasIntel ? (
            news.slice(0, 5).map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-white/10 pb-2 mb-2 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-emerald-300 whitespace-nowrap">
                    {formatNeonTimestamp(item?.pubDate ?? "")}
                  </span>
                  <span className="text-[10px] text-gray-200">{item?.title ?? "Untitled"}</span>
                </div>
                <div className="mt-1 font-mono text-[9px] text-cyan-200/70">{item?.source ?? "Google News"}</div>
              </a>
            ))
          ) : (
            <div className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              No intel available yet. Run the analysis to initialize the feed.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveIntelFeed;

