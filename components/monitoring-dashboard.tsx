"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Clock3, Droplets, Lightbulb, RadioTower, Thermometer, } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, XAxis, YAxis, } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart";
import { getMonitoringSeries, type MonitoringFrequency, type MonitoringRange, type Plant, type Property, } from "@/lib/siaf-data";

const climateConfig = {
  temperature: { label: "Temperatura do ar", color: "var(--chart-1)" },
  humidity: { label: "Umidade relativa do ar", color: "var(--chart-2)" },
} satisfies ChartConfig;

const lightConfig = {
  light: { label: "Luminosidade", color: "var(--chart-3)" },
  soil: { label: "Umidade do solo", color: "var(--chart-2)" },
} satisfies ChartConfig;

const signalConfig = {
  signal: { label: "Sinal eletrofisiológico", color: "var(--chart-1)" },
  quality: { label: "Qualidade do sinal", color: "var(--chart-5)" },
} satisfies ChartConfig;

const soilConfig = {
  soil: { label: "Umidade do solo", color: "var(--chart-2)" },
  conductivity: { label: "Condutividade elétrica", color: "var(--chart-4)" },
} satisfies ChartConfig;

const stressConfig = {
  stress: { label: "Índice visual de atenção", color: "var(--chart-4)" },
  quality: { label: "Qualidade do sinal", color: "var(--chart-5)" },
} satisfies ChartConfig;

type ChartSeries = {
  key: string;
  axis: "left" | "right";
  color: string;
  width?: number;
};

function TimeSeriesChart({
  data,
  config,
  series,
  leftUnit,
  rightUnit,
  signal = false,
  stress = false,
}: {
  data: ReturnType<typeof getMonitoringSeries>;
  config: ChartConfig;
  series: ChartSeries[];
  leftUnit: string;
  rightUnit?: string;
  signal?: boolean;
  stress?: boolean;
}) {
  const shared = (
    <>
      <CartesianGrid vertical={false} stroke="#e9eee9" strokeDasharray="3 4" />
      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        minTickGap={25}
        tick={{ fontSize: 8, fill: "#8a958d" }}
      />
      <YAxis
        yAxisId="left"
        tickLine={false}
        axisLine={false}
        width={40}
        tick={{ fontSize: 8, fill: "#8a958d" }}
        label={{
          value: leftUnit,
          angle: -90,
          position: "insideLeft",
          offset: 5,
          style: { fontSize: 8, fill: "#8a958d" },
        }}
      />
      {rightUnit && (
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={38}
          tick={{ fontSize: 8, fill: "#8a958d" }}
          label={{
            value: rightUnit,
            angle: 90,
            position: "insideRight",
            offset: 1,
            style: { fontSize: 8, fill: "#8a958d" },
          }}
        />
      )}
      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
      <ChartLegend content={<ChartLegendContent />} />
    </>
  );
  return (
    <ChartContainer config={config} className="monitor-chart">
      {stress ? (
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 9, right: 8, left: 2, bottom: 0 }}
        >
          {shared}
          <ReferenceArea
            yAxisId="left"
            y1={0}
            y2={35}
            fill="#e6f3e7"
            fillOpacity={0.75}
          />
          <ReferenceArea
            yAxisId="left"
            y1={35}
            y2={65}
            fill="#fff1d6"
            fillOpacity={0.65}
          />
          <ReferenceArea
            yAxisId="left"
            y1={65}
            y2={100}
            fill="#fde7e2"
            fillOpacity={0.72}
          />
          <ReferenceLine
            yAxisId="left"
            y={65}
            stroke="#d56f52"
            strokeDasharray="5 4"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="stress"
            stroke="var(--color-stress)"
            fill="var(--color-stress)"
            fillOpacity={0.38}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="quality"
            stroke="var(--color-quality)"
            strokeWidth={1.6}
            dot={false}
            activeDot={{ r: 3 }}
            isAnimationActive={false}
          />
        </AreaChart>
      ) : signal ? (
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 9, right: 8, left: 2, bottom: 0 }}
        >
          {shared}
          <ReferenceArea
            yAxisId="left"
            y1={-0.22}
            y2={0.22}
            fill="#e6f3e7"
            fillOpacity={0.75}
          />
          <ReferenceLine
            yAxisId="left"
            y={0}
            stroke="#9cab9e"
            strokeDasharray="4 4"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="signal"
            stroke="var(--color-signal)"
            fill="var(--color-signal)"
            fillOpacity={0.12}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="quality"
            stroke="var(--color-quality)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
            isAnimationActive={false}
          />
        </AreaChart>
      ) : (
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 9, right: 8, left: 2, bottom: 0 }}
        >
          {shared}
          {series.map((item) => (
            <Line
              key={item.key}
              yAxisId={item.axis}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={item.width ?? 2}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      )}
    </ChartContainer>
  );
}

export function MonitoringDashboard({
  property,
  plants,
}: {
  property: Property;
  plants: Plant[];
}) {
  const [plantId, setPlantId] = useState(plants[0]?.id ?? "");
  const [range, setRange] = useState<MonitoringRange>("24h");
  const [frequency, setFrequency] = useState<MonitoringFrequency>("1h");
  const activePlant = plants.find((plant) => plant.id === plantId) ?? plants[0];
  const safePlantId = activePlant?.id ?? "";

  const data = useMemo(
    () =>
      safePlantId ? getMonitoringSeries(safePlantId, range, frequency) : [],
    [safePlantId, range, frequency],
  );

  const rangeOptions: Record<
    MonitoringRange,
    { value: MonitoringFrequency; label: string }[]
  > = {
    "24h": [
      { value: "15m", label: "15 min" },
      { value: "1h", label: "1 hora" },
      { value: "6h", label: "6 horas" },
    ],
    "7d": [
      { value: "1h", label: "1 hora" },
      { value: "6h", label: "6 horas" },
      { value: "12h", label: "12 horas" },
    ],
    "30d": [
      { value: "6h", label: "6 horas" },
      { value: "12h", label: "12 horas" },
      { value: "24h", label: "24 horas" },
    ],
  };
  const selectedFrequency = rangeOptions[range].some(
    (option) => option.value === frequency,
  )
    ? frequency
    : rangeOptions[range][0].value;
  const readouts = [
    {
      label: "Temperatura do ar",
      value: `${activePlant?.temperature.toFixed(1).replace(".", ",")} °C`,
      icon: Thermometer,
    },
    {
      label: "Umidade do solo",
      value: `${activePlant?.soil} %`,
      icon: Droplets,
    },
    {
      label: "Qualidade do sinal",
      value: `${activePlant?.quality || 0} %`,
      icon: RadioTower,
    },
    { label: "Última amostra", value: "10:45 · simulada", icon: Clock3 },
  ];
  
  const rangeLabel =
    range === "24h"
      ? "Últimas 24 horas"
      : range === "7d"
        ? "Últimos 7 dias"
        : "Últimos 30 dias";

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            ANÁLISE DE SÉRIES TEMPORAIS · DEMONSTRAÇÃO
          </div>
          <h1>Monitoramento científico</h1>
          <p>
            {property.name} · {property.location} · dados simulados
            sincronizados por indivíduo
          </p>
        </div>
      </div>
      <div className="monitoring-toolbar panel">
        <label>
          <span>Planta</span>
          <select
            value={safePlantId}
            onChange={(event) => setPlantId(event.target.value)}
          >
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.id} · {plant.sector}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Intervalo</span>
          <select
            value={range}
            onChange={(event) => {
              const next = event.target.value as MonitoringRange;
              setRange(next);
              setFrequency(
                next === "24h" ? "1h" : next === "7d" ? "6h" : "12h",
              );
            }}
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
        </label>
        <label>
          <span>Frequência</span>
          <select
            value={selectedFrequency}
            onChange={(event) =>
              setFrequency(event.target.value as MonitoringFrequency)
            }
          >
            {rangeOptions[range].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="monitoring-range-note">
          <CalendarClock size={14} />
          {rangeLabel}
          <span />
          Exibição agregada
        </div>
      </div>
      <div className="monitoring-readouts">
        {readouts.map((item) => (
          <div className="monitoring-readout" key={item.label}>
            <span className="monitoring-readout-icon">
              <item.icon size={15} />
            </span>
            <span>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
      <div className="monitoring-charts-grid">
        <section className="panel monitoring-chart-card">
          <div className="monitoring-chart-heading">
            <div>
              <h2>Estresse fisiológico estimado</h2>
              <p>Demonstrativo: verde &lt;35 · amarelo 35–64 · vermelho ≥65</p>
            </div>
            <span className="chart-series-count">Índice demonstrativo</span>
          </div>
          <TimeSeriesChart
            data={data}
            config={stressConfig}
            series={[]}
            leftUnit="Índice (0–100)"
            rightUnit="%"
            stress
          />
        </section>
        <section className="panel monitoring-chart-card">
          <div className="monitoring-chart-heading">
            <div>
              <h2>Temperatura e umidade do ar</h2>
              <p>Condições ambientais sincronizadas · valores simulados</p>
            </div>
            <span className="chart-series-count">2 séries</span>
          </div>
          <TimeSeriesChart
            data={data}
            config={climateConfig}
            series={[
              {
                key: "temperature",
                axis: "left",
                color: "var(--color-temperature)",
              },
              {
                key: "humidity",
                axis: "right",
                color: "var(--color-humidity)",
              },
            ]}
            leftUnit="°C"
            rightUnit="%"
          />
        </section>
        <section className="panel monitoring-chart-card">
          <div className="monitoring-chart-heading">
            <div>
              <h2>Luminosidade e umidade do solo</h2>
              <p>Radiação simulada e condição do substrato</p>
            </div>
            <span className="chart-series-count">2 séries</span>
          </div>
          <TimeSeriesChart
            data={data}
            config={lightConfig}
            series={[
              { key: "light", axis: "left", color: "var(--color-light)" },
              { key: "soil", axis: "right", color: "var(--color-soil)" },
            ]}
            leftUnit="lux"
            rightUnit="%"
          />
        </section>
        <section className="panel monitoring-chart-card">
          <div className="monitoring-chart-heading">
            <div>
              <h2>Sinal eletrofisiológico</h2>
              <p>Escala normalizada · unidade arbitrária (u.a.)</p>
            </div>
            <span className="chart-series-count">Linha de base</span>
          </div>
          <TimeSeriesChart
            data={data}
            config={signalConfig}
            series={[]}
            leftUnit="u.a."
            rightUnit="%"
            signal
          />
        </section>
        <section className="panel monitoring-chart-card">
          <div className="monitoring-chart-heading">
            <div>
              <h2>Solo: umidade e condutividade</h2>
              <p>Leituras demonstrativas por sensor</p>
            </div>
            <span className="chart-series-count">2 séries</span>
          </div>
          <TimeSeriesChart
            data={data}
            config={soilConfig}
            series={[
              { key: "soil", axis: "left", color: "var(--color-soil)" },
              {
                key: "conductivity",
                axis: "right",
                color: "var(--color-conductivity)",
              },
            ]}
            leftUnit="%"
            rightUnit="mS/cm"
          />
        </section>
      </div>
      <div className="monitoring-footnote">
        <Lightbulb size={14} /> Séries, intervalos e qualidades são
        demonstrações para explorar a interface; não são diagnóstico nem
        medições experimentais validadas.{" "}
        <span>
          {activePlant?.deviceId} · {activePlant?.deviceId}-S5 · processamento
          demonstrativo
        </span>
      </div>
    </>
  );
}
