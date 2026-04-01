import { useState, useEffect } from 'react'
import './App.css'

const BUSINESS_DAYS_YEAR = 252
const BUSINESS_DAYS_MONTH = 22

const STORAGE_KEY = 'cdb_calc_state'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function parseBRL(raw) {
  // Remove currency symbol, dots (thousands), replace comma with dot
  const cleaned = raw.replace(/[R$\s.]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function calcEarnings(principal, cdiPercent, cdbOfCdi) {
  const annualRate = (cdiPercent / 100) * (cdbOfCdi / 100)
  const dailyRate = Math.pow(1 + annualRate, 1 / BUSINESS_DAYS_YEAR) - 1
  const monthlyRate = Math.pow(1 + annualRate, BUSINESS_DAYS_MONTH / BUSINESS_DAYS_YEAR) - 1
  return {
    daily: principal * dailyRate,
    monthly: principal * monthlyRate,
    annualRate: annualRate * 100,
  }
}

function CurrencyInput({ label, value, onChange, hint }) {
  const [display, setDisplay] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setDisplay(
        value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      )
    }
  }, [value, focused])

  function handleChange(e) {
    const raw = e.target.value
    setDisplay(raw)
    const num = parseBRL(raw)
    onChange(num)
  }

  function handleFocus() {
    setFocused(true)
    setDisplay(
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  function handleBlur() {
    setFocused(false)
  }

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper currency">
        <span className="prefix">R$</span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input-field"
        />
      </div>
      {hint && <span className="input-hint">{hint}</span>}
    </div>
  )
}

function PercentInput({ label, value, onChange, hint, step = 0.01 }) {
  function handleChange(e) {
    const num = parseFloat(e.target.value)
    if (!isNaN(num)) onChange(num)
  }

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <input
          type="number"
          step={step}
          min={0}
          value={value}
          onChange={handleChange}
          className="input-field"
        />
        <span className="suffix">%</span>
      </div>
      {hint && <span className="input-hint">{hint}</span>}
    </div>
  )
}

function EarningsCard({ label, value, sublabel, accent }) {
  return (
    <div className={`earnings-card ${accent ? 'accent' : ''}`}>
      <span className="earnings-label">{label}</span>
      <span className="earnings-value">{formatBRL(value)}</span>
      <span className="earnings-sublabel">{sublabel}</span>
    </div>
  )
}

export default function App() {
  const saved = loadSaved()
  const [principal, setPrincipalRaw] = useState(saved?.principal ?? 280000)
  const [cdiRate, setCdiRateRaw] = useState(saved?.cdiRate ?? 14.75)
  const [cdbOfCdi, setCdbOfCdiRaw] = useState(saved?.cdbOfCdi ?? 101)
  const [showRates, setShowRates] = useState(false)

  function setPrincipal(v) { setPrincipalRaw(v); saveState({ principal: v, cdiRate, cdbOfCdi }) }
  function setCdiRate(v)   { setCdiRateRaw(v);   saveState({ principal, cdiRate: v, cdbOfCdi }) }
  function setCdbOfCdi(v)  { setCdbOfCdiRaw(v);  saveState({ principal, cdiRate, cdbOfCdi: v }) }

  const { daily, monthly, annualRate } = calcEarnings(principal, cdiRate, cdbOfCdi)

  return (
    <div className="app">
      <header className="header">
        <div className="header-icon">₿</div>
        <div>
          <h1 className="header-title">CDB Rendimentos</h1>
          <p className="header-sub">Calculadora de renda fixa</p>
        </div>
      </header>

      <main className="main">
        {/* Principal Input */}
        <section className="card">
          <h2 className="section-title">Total Investido</h2>
          <CurrencyInput
            label="Valor em CDB"
            value={principal}
            onChange={setPrincipal}
            hint="Atualize sempre que adicionar aportes"
          />
        </section>

        {/* Earnings Display */}
        <section className="earnings-section">
          <EarningsCard
            label="Rendimento por Dia Útil"
            value={daily}
            sublabel={`${BUSINESS_DAYS_YEAR} dias úteis/ano`}
            accent
          />
          <EarningsCard
            label="Rendimento Mensal"
            value={monthly}
            sublabel={`~${BUSINESS_DAYS_MONTH} dias úteis/mês`}
          />
        </section>

        {/* Rates Toggle */}
        <section className="card">
          <button
            className="toggle-btn"
            onClick={() => setShowRates((v) => !v)}
          >
            <span>Taxas e configurações</span>
            <span className={`chevron ${showRates ? 'open' : ''}`}>▾</span>
          </button>

          {showRates && (
            <div className="rates-body">
              <PercentInput
                label="Taxa CDI anual"
                value={cdiRate}
                onChange={setCdiRate}
                step={0.01}
                hint="Selic/CDI vigente (BACEN)"
              />
              <PercentInput
                label="CDB como % do CDI"
                value={cdbOfCdi}
                onChange={setCdbOfCdi}
                step={0.5}
                hint="Normalmente 100% a 103% do CDI"
              />
              <div className="rate-summary">
                <span>Taxa efetiva anual</span>
                <strong>{annualRate.toFixed(4)}% a.a.</strong>
              </div>
            </div>
          )}
        </section>

        {/* Year projection */}
        <section className="card projection">
          <h2 className="section-title">Projeção anual</h2>
          <div className="projection-row">
            <span>Rendimento em 12 meses</span>
            <strong>{formatBRL(monthly * 12)}</strong>
          </div>
          <div className="projection-row muted">
            <span>Saldo projetado (bruto)</span>
            <strong>{formatBRL(principal + monthly * 12)}</strong>
          </div>
          <p className="projection-note">* Valores brutos, sem desconto de IR (15–22,5%)</p>
        </section>
      </main>

      <footer className="footer">
        <p>Base: {BUSINESS_DAYS_YEAR} d.u./ano · {BUSINESS_DAYS_MONTH} d.u./mês</p>
        <p>CDB {cdbOfCdi}% CDI · CDI {cdiRate}% a.a.</p>
      </footer>
    </div>
  )
}
