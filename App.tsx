import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIGURATION & THEME ───────────────────────────────────────────────────
const SUPABASE_URL = "https://tiwukijaoejvgrnyhnzi.supabase.co";
const SUPABASE_KEY = "sb_publishable_rkmTH1nTl5qkn-_7jLmQAw_-ExQC-WP";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const C = {
  bg: "#0d1f3c",
  bgDeep: "#071428",
  card: "#132040",
  border: "#1e3a6e",
  accent: "#3b82f6",
  white: "#f0f6ff",
  muted: "#7a9cc4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#e2eeff",
};

const Rnd = (v) => Math.round((v || 0) * 100) / 100;
const F = (v) => '₦' + Rnd(v || 0).toLocaleString('en-NG', {minimumFractionDigits:2, maximumFractionDigits:2});

// ── REUSABLE UI ──────────────────────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, style, color = C.accent, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: disabled ? C.bgDeep : color, color: "#fff", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, ...style }}>{children}</button>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13 }}>
      <option value="">-- Select Column --</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// ── THE FULL PAYROLL MODULE ──────────────────────────────────────────────────
function Payroll() {
  const [view, setView] = useState("upload"); // upload, mapping, results
  const [currency, setCurrency] = useState("NGN");
  const [rate, setRate] = useState(1);
  const [results, setResults] = useState([]);
  const [excelCols, setExcelCols] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [mapping, setMapping] = useState({ name: "", position: "", cumulative: "", duration: "" });

  const calcPAYE = (taxable) => {
    if (taxable <= 0) return 0;
    let tax = 0;
    const bands = [{L:300000,R:0.15},{L:300000,R:0.18},{L:400000,R:0.20},{L:300000,R:0.23},{L:Infinity,R:0.25}];
    let rem = taxable;
    for (const b of bands) {
      const amt = Math.min(rem, b.L);
      tax += amt * b.R;
      rem -= amt;
      if (rem <= 0) break;
    }
    return tax;
  };

  const processRow = (d) => {
    const cumNGN = (parseFloat(d.cumulative) || 0) * rate;
    const dur = parseInt(d.duration) || 6;
    const emp10 = (cumNGN / dur) * 0.10;
    const monthlyGross = (cumNGN / dur) + emp10;
    const nhisMo = monthlyGross * 0.015;
    const pens8Mo = (monthlyGross * 0.7) * 0.08;
    const annualGross = monthlyGross * 12;
    const rentRelief = Math.min((parseFloat(d.rent)||0)*12, annualGross * 0.15);
    const annTaxable = Math.max(0, annualGross - rentRelief - (pens8Mo * 12));
    const payeMo = calcPAYE(annTaxable) / 12;
    const netMo = monthlyGross - nhisMo - pens8Mo - payeMo;

    return { ...d, cumNGN, emp10, monthlyGross, dur, nhisMo, pens8Mo, annualGross, payeMo, netMo };
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.XLSX) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      document.head.appendChild(s);
      await new Promise(r => s.onload = r);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = window.XLSX.read(evt.target.result, { type: "binary" });
      const json = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setExcelCols(Object.keys(json[0] || {}));
      setRawData(json);
      setView("mapping");
    };
    reader.readAsBinaryString(file);
  };

  const runCalculation = () => {
    const processed = rawData.map(row => processRow({
      name: row[mapping.name],
      position: row[mapping.position],
      cumulative: row[mapping.cumulative],
      duration: row[mapping.duration] || 6
    }));
    setResults(processed);
    setView("results");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-in" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800 }}>CBI Payroll 2026</h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Nigeria PAYE Standards — Integrated Session</p>
      </div>

      {view === "upload" && (
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Select label="Currency" value={currency} onChange={setCurrency} options={["NGN", "USD", "EUR"]} />
            {currency !== "NGN" && <input type="number" placeholder="Rate" onChange={e=>setRate(e.target.value)} style={{ padding: 12, background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />}
          </div>
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 16, padding: 60, textAlign: "center", cursor: "pointer" }} onClick={() => document.getElementById('u').click()}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 18 }}>Upload Staff Payroll Excel</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Click to browse or drag and drop</div>
            <input type="file" id="u" hidden onChange={handleUpload} />
          </div>
        </Card>
      )}

      {view === "mapping" && (
        <Card>
          <h3 style={{ color: C.accent, fontSize: 14, marginBottom: 20 }}>Map Columns from {excelCols.length} found</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Select label="Staff Name" value={mapping.name} onChange={v => setMapping({...mapping, name: v})} options={excelCols} />
            <Select label="Position" value={mapping.position} onChange={v => setMapping({...mapping, position: v})} options={excelCols} />
            <Select label="Total Package" value={mapping.cumulative} onChange={v => setMapping({...mapping, cumulative: v})} options={excelCols} />
            <Select label="Duration" value={mapping.duration} onChange={v => setMapping({...mapping, duration: v})} options={excelCols} />
          </div>
          <Btn style={{ width: "100%", marginTop: 24 }} onClick={runCalculation}>Run 2026 Payroll</Btn>
        </Card>
      )}

      {view === "results" && (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: C.white }}>Calculated Register</h3>
            <Btn color={C.bgDeep} onClick={() => setView("upload")}>Reset Session</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
            <thead style={{ background: C.bgDeep }}>
              <tr>{['#', 'Name', 'Position', 'Monthly Gross', 'NHIS', 'Pension', 'PAYE', 'Net Pay'].map(h => <th key={h} style={{ padding: 14, textAlign: "left", color: C.muted, fontSize: 11 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 14 }}>{i + 1}</td>
                  <td style={{ padding: 14, color: C.white, fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: 14 }}>{r.position}</td>
                  <td style={{ padding: 14 }}>{F(r.monthlyGross)}</td>
                  <td style={{ padding: 14 }}>{F(r.nhisMo)}</td>
                  <td style={{ padding: 14 }}>{F(r.pens8Mo)}</td>
                  <td style={{ padding: 14, color: C.warning }}>{F(r.payeMo)}</td>
                  <td style={{ padding: 14, color: C.success, fontWeight: 800 }}>{F(r.netMo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeMod, setActiveMod] = useState("payroll");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 260, background: C.bgDeep, borderRight: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ color: C.white, fontSize: 20, fontWeight: 800, marginBottom: 40 }}>CBI SYSTEM</div>
        {['dashboard', 'payroll', 'employees'].map(m => (
          <div key={m} onClick={() => setActiveMod(m)} style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 10, cursor: "pointer", background: activeMod === m ? C.accent : "transparent", color: activeMod === m ? C.white : C.muted, fontWeight: 600, textTransform: "capitalize" }}>{m}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 40 }}>
        {activeMod === "payroll" ? <Payroll /> : <div style={{ color: C.white }}>Module under development.</div>}
      </div>
    </div>
  );
}
