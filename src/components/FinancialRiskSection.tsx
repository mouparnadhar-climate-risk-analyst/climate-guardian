import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function riskLabel(pct: number): { risk: string; color: string } {
  if (pct <= 0.05) return { risk: "LOW", color: "bg-green-500" };
  if (pct <= 0.15) return { risk: "LOW-MEDIUM", color: "bg-yellow-500" };
  if (pct <= 0.30) return { risk: "MEDIUM", color: "bg-orange-500" };
  if (pct <= 0.50) return { risk: "HIGH", color: "bg-red-500" };
  if (pct <= 0.70) return { risk: "VERY HIGH", color: "bg-red-800" };
  return { risk: "EXTREME", color: "bg-purple-950" };
}

interface FinancialRiskSectionProps {
  assetValue: string;
  lossPerDecade?: number; // from API, e.g. 0.16
}

const FinancialRiskSection = ({ assetValue, lossPerDecade }: FinancialRiskSectionProps) => {
  const baseValue = useMemo(() => {
    const parsed = parseFloat(assetValue.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 10_000_000 : parsed;
  }, [assetValue]);

  const rate = lossPerDecade ?? 0.10; // default ~10% if no analysis run
  const adaptRate = rate * 0.35; // adaptation reduces loss by 65%

  const rows = useMemo(() => {
    const decades = [
      { year: 2025, scenario: "Baseline", decadesOut: 0, accel: 1 },
      { year: 2035, scenario: "RCP 4.5", decadesOut: 1, accel: 1 },
      { year: 2045, scenario: "RCP 4.5", decadesOut: 2, accel: 1 },
      { year: 2055, scenario: "RCP 8.5", decadesOut: 3, accel: 1 },
      { year: 2065, scenario: "RCP 8.5", decadesOut: 4, accel: 1 },
      { year: 2075, scenario: "RCP 8.5", decadesOut: 5, accel: 1.4 },
      { year: 2085, scenario: "RCP 8.5", decadesOut: 6, accel: 1.4 * 1.35 },
    ];
    return decades.map((d) => {
      const baseLoss = 1 - Math.pow(1 - rate, d.decadesOut);
      const pct = Math.min(baseLoss * d.accel, 0.99);
      const projected = baseValue * (1 - pct);
      const loss = baseValue * pct;
      const { risk, color } = riskLabel(pct);
      return { ...d, pct, projected, loss, lossPctStr: (pct * 100).toFixed(0), risk, color };
    });
  }, [baseValue, rate]);

  const chartData = useMemo(() => {
    const accels = [1, 1, 1, 1, 1, 1.4, 1.4 * 1.35];
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const year = 2025 + i * 10;
      const bauLoss = (1 - Math.pow(1 - rate, i)) * accels[i];
      const adaptLoss = (1 - Math.pow(1 - adaptRate, i)) * accels[i];
      return {
        year,
        bau: baseValue * (1 - Math.min(bauLoss, 0.99)),
        adapted: baseValue * (1 - Math.min(adaptLoss, 0.99)),
      };
    });
  }, [baseValue, rate, adaptRate]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingDown className="h-6 w-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Financial Risk Projection{" "}
          <span className="text-muted-foreground font-normal text-base">(10-Year Intervals)</span>
        </h2>
        {lossPerDecade != null && (
          <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
            Loss rate: {(rate * 100).toFixed(0)}%/decade (data-driven)
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card/60 backdrop-blur-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Year</TableHead>
              <TableHead className="text-muted-foreground">Climate Scenario</TableHead>
              <TableHead className="text-muted-foreground text-right">Projected Asset Value</TableHead>
              <TableHead className="text-muted-foreground text-right">Value Loss ($)</TableHead>
              <TableHead className="text-muted-foreground text-right">Value Loss (%)</TableHead>
              <TableHead className="text-muted-foreground text-center">Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.year} className="border-border">
                <TableCell className="font-medium text-foreground">{r.year}</TableCell>
                <TableCell className="text-foreground">{r.scenario}</TableCell>
                <TableCell className="text-right text-foreground">{fmt(r.projected)}</TableCell>
                <TableCell className="text-right text-foreground">
                  {r.loss === 0 ? "—" : `-${fmt(r.loss)}`}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {r.loss === 0 ? "0%" : `-${r.lossPctStr}%`}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`${r.color} text-white border-none text-xs`}>
                    {r.risk}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-lg border border-border bg-card/60 backdrop-blur-md p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Asset Value Depreciation Curve</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
            <XAxis dataKey="year" stroke="hsl(220 20% 60%)" tick={{ fill: "hsl(220 20% 60%)", fontSize: 12 }} />
            <YAxis
              stroke="hsl(220 20% 60%)"
              tick={{ fill: "hsl(220 20% 60%)", fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222 40% 12%)",
                border: "1px solid hsl(222 30% 20%)",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value: number, name: string) => [
                fmt(value),
                name === "bau" ? "Business as Usual" : "With Adaptation",
              ]}
              labelStyle={{ color: "hsl(220 20% 60%)" }}
            />
            <Legend
              formatter={(value: string) =>
                value === "bau" ? "Business as Usual" : "With Adaptation"
              }
              wrapperStyle={{ color: "hsl(220 20% 60%)" }}
            />
            <Line type="monotone" dataKey="bau" stroke="hsl(0 84% 60%)" strokeWidth={2} dot={{ fill: "hsl(0 84% 60%)", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="adapted" stroke="hsl(142 76% 46%)" strokeWidth={2} dot={{ fill: "hsl(142 76% 46%)", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-muted-foreground/60 text-center">
        Based on IPCC AR6 SSP2-4.5 and SSP5-8.5 projections. {lossPerDecade != null ? "Loss rates computed from live geospatial data." : "For illustrative purposes."}
      </p>
    </motion.section>
  );
};

export default FinancialRiskSection;
