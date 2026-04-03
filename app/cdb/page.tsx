'use client'

import { useState, useEffect } from 'react'

const BUSINESS_DAYS_YEAR = 252
const BUSINESS_DAYS_MONTH = 22
const STORAGE_KEY = 'cdb_calc_state'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function calcEarnings(principal: number, cdiPercent: number, cdbOfCdi: number) {
  const annualRate = (cdiPercent / 100) * (cdbOfCdi / 100)
  const dailyRate = Math.pow(1 + annualRate, 1 / BUSINESS_DAYS_YEAR) - 1
  const monthlyRate = Math.pow(1 + annualRate, BUSINESS_DAYS_MONTH / BUSINESS_DAYS_YEAR) - 1
  return { daily: principal * dailyRate, monthly: principal * monthlyRate, annualRate: annualRate * 100 }
}

function formatBRL(value: number, decimals = 2) {
  return value.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function parseBRL(raw: string) {
  const cleaned = raw.replace(/[R$\s.]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function CurrencyInput({ label, value, onChange, hint }: {
  label: string, value: number, onChange: (v: number) => void, hint?: string
}) {
  const [display, setDisplay] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setDisplay(value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  }, [value, focused])

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="flex items-center bg-slate-800 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
        <span className="px-3 text-slate-500 font-semibold text-sm select-none">R$</span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          className="flex-1 bg-transparent outline-none text-slate-100 text-lg font-semibold py-3.5 pr-3"
          onChange={e => { setDisplay(e.target.value); onChange(parseBRL(e.target.value)) }}
          onFocus={() => { setFocused(true); setDisplay(value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) }}
          onBlur={() => setFocused(false)}
        />
      </div>
      {hint && <span className="text-xs text-slate-600">{hint}</span>}
    </div>
  )
}

function useLiveTicker(dailyEarnings: number) {
  const [earned, setEarned] = useState(0)
  useEffect(() => {
    function tick() {
      const now = new Date()
      const day = now.getDay()
      if (day === 0 || day === 6) { setEarned(0); return }
      const secs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000
      setEarned(dailyEarnings * (secs / 86400))
    }
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [dailyEarnings])
  return earned
}

export default function CDBPage() {
  const [mounted, setMounted] = useState(false)
  const [principal, setPrincipal] = useState(280000)
  const [cdiRate, setCdiRate] = useState(14.75)
  const [cdbOfCdi, setCdbOfCdi] = useState(101)
  const [showRates, setShowRates] = useState(false)

  useEffect(() => {
    const saved = loadSaved()
    if (saved?.principal) setPrincipal(saved.principal)
    if (saved?.cdiRate) setCdiRate(saved.cdiRate)
    if (saved?.cdbOfCdi) setCdbOfCdi(saved.cdbOfCdi)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ principal, cdiRate, cdbOfCdi })) } catch {}
  }, [principal, cdiRate, cdbOfCdi, mounted])

  const { daily, monthly, annualRate } = calcEarnings(principal, cdiRate, cdbOfCdi)
  const liveEarned = useLiveTicker(daily)
  const isWeekday = mounted && new Date().getDay() >= 1 && new Date().getDay() <= 5

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-950 text-slate-100 pb-12">
      <div className="border-b border-white/[0.06] px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
          R$
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100">CDB Rendimentos</h1>
          <p className="text-xs text-slate-500">Calculadora de renda fixa</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 mt-5 flex flex-col gap-4">

        <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Total Investido</p>
          <CurrencyInput
            label="Valor em CDB"
            value={principal}
            onChange={setPrincipal}
            hint="Atualize sempre que adicionar aportes"
          />
        </div>

        <div className="bg-gradient-to-br from-[#052e16] to-[#0d2218] border border-green-500/30 rounded-2xl p-5"
          style={{ boxShadow: '0 0 0 1px rgba(34,197,94,0.1), 0 8px 40px rgba(34,197,94,0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Rendendo hoje</span>
            <span className={`w-2 h-2 rounded-full ${isWeekday ? 'bg-green-400 shadow-[0_0_6px_#22c55e] animate-pulse' : 'bg-slate-600'}`} />
          </div>
          <div className="text-4xl font-black text-green-400 tabular-nums tracking-tight leading-none"
            style={{ textShadow: '0 0 40px rgba(34,197,94,0.35)' }}>
            {formatBRL(liveEarned, 4)}
          </div>
          <p className="text-xs text-green-900 mt-2">
            {isWeekday ? 'dia útil · atualiza em tempo real' : 'fim de semana · sem rendimento'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0f2744] to-[#1a2a4a] border border-blue-500/30 rounded-2xl p-5"
          style={{ boxShadow: '0 0 0 1px rgba(59,130,246,0.12), 0 8px 32px rgba(59,130,246,0.08)' }}>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Por Dia Útil</p>
          <div className="text-4xl font-black text-green-400 tabular-nums tracking-tight leading-none">
            {formatBRL(daily)}
          </div>
          <p className="text-xs text-slate-600 mt-1">{BUSINESS_DAYS_YEAR} dias úteis/ano</p>
        </div>

        <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Mensal</p>
          <div className="text-4xl font-black text-green-400 tabular-nums tracking-tight leading-none">
            {formatBRL(monthly)}
          </div>
          <p className="text-xs text-slate-600 mt-1">~{BUSINESS_DAYS_MONTH} dias úteis/mês</p>
        </div>

        <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-5">
          <button
            onClick={() => setShowRates(v => !v)}
            className="w-full flex justify-between items-center text-slate-400 text-sm font-medium hover:text-slate-200 transition-colors"
          >
            <span>Taxas e configurações</span>
            <span className={`transition-transform duration-200 ${showRates ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showRates && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Taxa CDI anual</label>
                <div className="flex items-center bg-slate-800 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                  <input
                    type="number" step={0.01} min={0} value={cdiRate}
                    onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setCdiRate(n) }}
                    className="flex-1 bg-transparent outline-none text-slate-100 text-lg font-semibold py-3.5 pl-3"
                  />
                  <span className="px-3 text-slate-500 font-semibold text-sm select-none">%</span>
                </div>
                <span className="text-xs text-slate-600">Selic/CDI vigente (BACEN)</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">CDB como % do CDI</label>
                <div className="flex items-center bg-slate-800 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                  <input
                    type="number" step={0.5} min={0} value={cdbOfCdi}
                    onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) setCdbOfCdi(n) }}
                    className="flex-1 bg-transparent outline-none text-slate-100 text-lg font-semibold py-3.5 pl-3"
                  />
                  <span className="px-3 text-slate-500 font-semibold text-sm select-none">%</span>
                </div>
                <span className="text-xs text-slate-600">Normalmente 100% a 103% do CDI</span>
              </div>
              <div className="flex justify-between items-center bg-slate-800 rounded-xl px-4 py-3 text-sm">
                <span className="text-slate-400">Taxa efetiva anual</span>
                <strong className="text-slate-100">{annualRate.toFixed(4)}% a.a.</strong>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Projeção anual</p>
          <div className="flex justify-between items-center py-2.5 border-b border-white/[0.05] text-sm">
            <span className="text-slate-400">Rendimento em 12 meses</span>
            <strong className="text-slate-100">{formatBRL(monthly * 12)}</strong>
          </div>
          <div className="flex justify-between items-center py-2.5 text-xs">
            <span className="text-slate-600">Saldo projetado (bruto)</span>
            <strong className="text-slate-500">{formatBRL(principal + monthly * 12)}</strong>
          </div>
          <p className="text-xs text-slate-700 mt-2">* Bruto, sem desconto de IR (15–22,5%)</p>
        </div>

        <p className="text-center text-xs text-slate-700 leading-relaxed">
          Base: {BUSINESS_DAYS_YEAR} d.u./ano · {BUSINESS_DAYS_MONTH} d.u./mês<br />
          CDB {cdbOfCdi}% CDI · CDI {cdiRate}% a.a.
        </p>
      </div>
    </main>
  )
}
