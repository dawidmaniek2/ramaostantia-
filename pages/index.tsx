import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Home() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [drank, setDrank] = useState("");
  const [pulled, setPulled] = useState("");
  const [resisted, setResisted] = useState("");
  const [recovered, setRecovered] = useState("");
  const [dangerZones, setDangerZones] = useState("");
  const [entries, setEntries] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ramaEntries");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("ramaEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour === 19 || hour === 20) {
      alert("[RAMA] Jeszcze tu jesteś? Co dziś odzyskałeś?");
    }
  }, []);

  const saveEntry = () => {
    const newEntry = {
      date,
      drank,
      pulled,
      resisted,
      recovered,
      dangerZones
    };
    setEntries([newEntry, ...entries]);
    setDrank("");
    setPulled("");
    setResisted("");
    setRecovered("");
    setDangerZones("");
  };

  const chartData = entries.slice().reverse().map((entry) => ({
    name: entry.date,
    value: entry.drank.trim().toLowerCase() === "nie" ? 1 : entry.drank.trim().toLowerCase() === "tak" ? -1 : 0
  }));

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RAMA – Tracker Przytomności</h1>
      <Card className="mb-4">
        <CardContent className="space-y-2">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Textarea placeholder="Czy piłeś? (Tak/Nie)" value={drank} onChange={(e) => setDrank(e.target.value)} />
          <Textarea placeholder="Co cię dziś ciągnęło w stronę picia?" value={pulled} onChange={(e) => setPulled(e.target.value)} />
          <Textarea placeholder="Co cię dziś odciągnęło?" value={resisted} onChange={(e) => setResisted(e.target.value)} />
          <Textarea placeholder="Co dziś odzyskałeś?" value={recovered} onChange={(e) => setRecovered(e.target.value)} />
          <Textarea placeholder="Strefy zagrożenia dziś (miejsce, emocja, pora)?" value={dangerZones} onChange={(e) => setDangerZones(e.target.value)} />
          <Button onClick={saveEntry}>Zapisz dzisiejszy wpis</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Wykres progresji</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide={false} />
              <YAxis hide={false} domain={[-1, 1]} ticks={[-1, 0, 1]} />
              <Tooltip formatter={(value) => value === 1 ? "Nie piłeś" : value === -1 ? "Piłeś" : "Brak danych"} />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <Card key={index}>
            <CardContent className="space-y-1">
              <p className="font-semibold">Data: {entry.date}</p>
              <p><strong>Piłeś?:</strong> {entry.drank}</p>
              <p><strong>Co ciągnęło?:</strong> {entry.pulled}</p>
              <p><strong>Co odciągnęło?:</strong> {entry.resisted}</p>
              <p><strong>Odzyskane:</strong> {entry.recovered}</p>
              <p><strong>Strefy zagrożenia:</strong> {entry.dangerZones}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
