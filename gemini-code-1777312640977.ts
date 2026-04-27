import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
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

// ── UTILS ─────────────────────────────────────────────────────────────────────
const Rnd = (v) => Math.round((v || 0) * 100) / 100;
const F = (v) => '₦' + Rnd(v || 0).toLocaleString('en-NG', {minimumFractionDigits:2, maximumFractionDigits:2});

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, style, color = C.accent, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: disabled ? C.bgDeep : color, color: "#fff", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontSize: 13, ...style }}>{children}</button>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13, outline: "none" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13, outline: "none" }}>
      <option value="">-- Select --</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// ── ADVANCED PAYROLL MODULE ──────────────────────────────────────────────────
function PayrollModule() {
  const [activeTab, setActiveTab] = useState("upload");
  const [currency, setCurrency] = useState("NGN");
  const [rate, setRate] = useState(1);
  const [results, setResults] = useState([]);
  const [mapping, setMapping] = useState({ name: "", position: "", cumulative: "", duration: "" });
  const [excelCols, setExcelCols] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [workbook, setWorkbook] = useState(null);

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

  const processData = (d) => {
    const cumNGN = (parseFloat(d.cumulative) || 0) * rate;
    const dur = parseInt(d.duration) || 6;
    const emp10 = (cumNGN / dur) * 0.10;
    const monthlyGross = (cumNGN / dur) + emp10;
    const nhisMo = monthlyGross * 0.015;
    const pens8Mo = (monthlyGross * 0.7) * 0.08;
    const annualGross = monthlyGross * 12;
    const rentRelief = Math.min((parseFloat(d.rent)||0)*12, annualGross * 0.15);
    const pens8Ann = pens8Mo * 12;
    const annTaxable = Math.max(0, annualGross - rentRelief - pens8Ann);
    const payeMo = calcPAYE(annTaxable) / 12;
    const netMo = monthlyGross - nhisMo - pens8Mo - payeMo;

    return { ...d, cumNGN, emp10, monthlyGross, dur, nhisMo, pens8Mo, annualGross, rentRelief, annTaxable, payeMo, netMo };
  };

  const onFile = async (e) => {
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
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = window.XLSX.utils.sheet_to_json(ws);
      setExcelCols(Object.keys(json[0] || {}));
      setRawData(json);
    };
    reader.readAsBinaryString(file);
  };

  const run = () => {
    setResults(rawData.map(row => processData({
      name: row[mapping.name],
      position: row[mapping.position],
      cumulative: row[mapping.cumulative],
      duration: row[mapping.duration] || 6
    })));
    setActiveTab("results");
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: C.white, fontSize: 24, fontWeight: 800 }}>Payroll System</h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Nigeria PAYE 2026 Integrated</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Btn onClick={() => setActiveTab("upload")} color={activeTab === "upload" ? C.accent : C.bgDeep} style={{ flex: 1 }}>📤 Upload Excel</Btn>
        <Btn onClick={() => setActiveTab("results")} color={C.success} disabled={results.length === 0} style={{ flex: 1 }}>📊 View Table</Btn>
      </div>

      {activeTab === "upload" && (
        <>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Select label="Currency" value={currency} onChange={setCurrency} options={["NGN", "USD", "EUR"]} />
              {currency !== "NGN" && <Input label="Exchange Rate" type="number" value={rate} onChange={setRate} />}
            </div>
          </Card>
          <Card>
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer" }} onClick={() => document.getElementById('up').click()}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ color: C.white, fontWeight: 700 }}>Click to Upload Payroll File</div>
              <input type="file" id="up" hidden onChange={onFile} />
            </div>
            {excelCols.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Select label="Staff Name" value={mapping.name} onChange={v => setMapping({...mapping, name: v})} options={excelCols} />
                  <Select label="Total Package" value={mapping.cumulative} onChange={v => setMapping({...mapping, cumulative: v})} options={excelCols} />
                  <Select label="Position" value={mapping.position} onChange={v => setMapping({...mapping, position: v})} options={excelCols} />
                  <Select label="Duration" value={mapping.duration} onChange={v => setMapping({...mapping, duration: v})} options={excelCols} />
                </div>
                <Btn style={{ width: "100%", marginTop: 20 }} onClick={run}>Run 2026 Calculations</Btn>
              </div>
            )}
          </Card>
        </>
      )}

      {activeTab === "results" && (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200, fontSize: 11 }}>
            <thead style={{ background: C.bgDeep }}>
              <tr>{['#', 'Name', 'Position', 'Total (NGN)', '10% Pension', 'Mo. Gross', 'NHIS', '8% Pens', 'Taxable', 'Mo. PAYE', 'Net Pay'].map(h => <th key={h} style={{ padding: 12, textAlign: "left", color: C.muted }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: 12 }}>{i + 1}</td>
                  <td style={{ padding: 12, fontWeight: 700, color: C.white }}>{r.name}</td>
                  <td style={{ padding: 12 }}>{r.position}</td>
                  <td style={{ padding: 12 }}>{F(r.cumNGN)}</td>
                  <td style={{ padding: 12 }}>{F(r.emp10)}</td>
                  <td style={{ padding: 12 }}>{F(r.monthlyGross)}</td>
                  <td style={{ padding: 12 }}>{F(r.nhisMo)}</td>
                  <td style={{ padding: 12 }}>{F(r.pens8Mo)}</td>
                  <td style={{ padding: 12 }}>{F(r.annTaxable)}</td>
                  <td style={{ padding: 12, color: C.warning }}>{F(r.payeMo)}</td>
                  <td style={{ padding: 12, color: C.success, fontWeight: 800 }}>{F(r.netMo)}</td>
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
  const [activeModule, setActiveModule] = useState("payroll"); // Defaulted to payroll for testing

  const renderModule = () => {
    switch (activeModule) {
      case "payroll": return <PayrollModule />;
      case "dashboard": return <div style={{ color: C.white }}>Welcome to CBI HR</div>;
      default: return <div style={{ color: C.white }}>Module under construction</div>;
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 260, background: C.bgDeep, borderRight: `1px solid ${C.border}`, padding: 20 }}>
        <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800, marginBottom: 32 }}>CBI HR</h1>
        {["dashboard", "payroll", "employees"].map(m => (
          <div key={m} onClick={() => setActiveModule(m)} style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 8, cursor: "pointer", background: activeModule === m ? C.accent : "transparent", color: activeModule === m ? C.white : C.muted, fontWeight: 600, textTransform: "capitalize" }}>{m}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 32 }}>
        {renderModule()}
      </div>
    </div>
  );
}