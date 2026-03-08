import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const RISK_ROWS = [
  { year: 2025, scenario: "Baseline", pct: 1.0, risk: "LOW", color: "bg-green-500" },
  { year: 2035, scenario: "RCP 4.5", pct: 0.94, risk: "LOW-MEDIUM", color: "bg-yellow-500" },
  { year: 2045, scenario: "RCP 4.5", pct: 0.86, risk: "MEDIUM", color: "bg-orange-500" },
  { year: 2055, scenario: "RCP 8.5", pct: 0.73, risk: "HIGH", color: "bg-red-500" },
  { year: 2065, scenario: "RCP 8.5", pct: 0.58, risk: "VERY HIGH", color: "bg-red-800" },
];

const ADAPTATION_FACTOR = [1.0, 0.97, 0.93, 0.87, 0.80];

const fmt = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

interface FinancialRiskSectionProps {
  assetValue: string;
}

const FinancialRiskSection = ({ assetValue }: FinancialRiskSectionProps) => {
  const baseValue = useMemo(() => {
    const parsed = parseFloat(assetValue.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) || parsed <= 0 ? 10_000_000 : parsed;
  }, [assetValue]);

  const rows = useMemo(
    () =>
      RISK_ROWS.map((r) => ({
        ...r,
        projected: baseValue * r.pct,
        loss: baseValue * (1 - r.pct),
        lossPct: ((1 - r.pct) * 100).toFixed(0),
      })),
    [baseValue]
  );

  const chartData = useMemo(
    () =>
      RISK_ROWS.map((r, i) => ({
        year: r.year,
        bau: baseValue * r.pct,
        adapted: baseValue * ADAPTATION_FACTOR[i],
      })),
    [baseValue]
  );

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
                  {r.loss === 0 ? "0%" : `-${r.lossPct}%`}
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
            <Line
              type="monotone"
              dataKey="bau"
              stroke="hsl(0 84% 60%)"
              strokeWidth={2}
              dot={{ fill: "hsl(0 84% 60%)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="adapted"
              stroke="hsl(142 76% 46%)"
              strokeWidth={2}
              dot={{ fill: "hsl(142 76% 46%)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <p className="mt-4 text-xs text-muted-foreground/60 text-center">
        Based on IPCC AR6 SSP2-4.5 and SSP5-8.5 projections. For illustrative purposes.
      </p>
    </motion.section>
  );
};

export default FinancialRiskSection;
