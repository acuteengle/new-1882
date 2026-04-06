import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Papa from 'papaparse'
import './App.css'

/** Split CSV language fields like "Korean / English" into distinct tags. */
function languageTags(raw) {
  if (!raw || raw === '—') return []
  return raw
    .split(/\s*\/\s*|,\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean)
}

function rowMatchesLanguage(row, selected) {
  if (!selected) return true
  const want = selected.toLowerCase()
  return languageTags(row.language).some((t) => t.toLowerCase() === want)
}

function MediaTile({ item, onOpen }) {
  return (
    <button
      type="button"
      className="media-tile"
      onClick={() => onOpen(item)}
      aria-label={`${item.title}, ${item.type}. Open details.`}
    >
      <span className="media-tile__type">{item.type}</span>
      <span className="media-tile__title">{item.title}</span>
      <span className="media-tile__creator">{item.creator}</span>
      <dl className="media-tile__meta">
        <div className="media-tile__meta-row">
          <dt>Released</dt>
          <dd>{item.release_date || '—'}</dd>
        </div>
        <div className="media-tile__meta-row">
          <dt>Language</dt>
          <dd>{item.language || '—'}</dd>
        </div>
      </dl>
      <p className="media-tile__description">{item.description}</p>
    </button>
  )
}

function MediaModal({ item, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [item, onClose])

  const titleId = 'media-modal-title'

  return (
    <div className="modal-layer">
      <div
        className="modal-backdrop"
        role="presentation"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <span aria-hidden="true">×</span>
        </button>
        <p className="modal-panel__type">{item.type}</p>
        <h2 id={titleId} className="modal-panel__title">
          {item.title}
        </h2>
        <p className="modal-panel__creator">{item.creator}</p>
        <dl className="modal-panel__meta">
          <div className="modal-panel__meta-row">
            <dt>Released</dt>
            <dd>{item.release_date || '—'}</dd>
          </div>
          <div className="modal-panel__meta-row">
            <dt>Language</dt>
            <dd>{item.language || '—'}</dd>
          </div>
        </dl>
        <p className="modal-panel__description">{item.description}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [rows, setRows] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [filterType, setFilterType] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  const [modalItem, setModalItem] = useState(null)
  const closeModal = useCallback(() => setModalItem(null), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}media.csv`)
        if (!res.ok) throw new Error('Could not load media catalog')
        const text = await res.text()
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase(),
        })

        if (cancelled) return

        if (parsed.errors?.length) {
          console.warn('CSV parse warnings', parsed.errors)
        }

        const data = (parsed.data || [])
          .map((row) => ({
            title: String(row.title ?? '').trim(),
            creator: String(row.creator ?? '').trim(),
            type: String(row.type ?? '').trim(),
            description: String(row.description ?? '').trim(),
            release_date: String(row.release_date ?? '').trim(),
            language: String(row.language ?? '').trim(),
          }))
          .filter((r) => r.title && r.type)

        setRows(data)
        setLoadState('ready')
      } catch (e) {
        if (!cancelled) {
          console.error(e)
          setLoadState('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const types = useMemo(() => {
    const set = new Set()
    for (const r of rows) set.add(r.type)
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [rows])

  const languages = useMemo(() => {
    const set = new Set()
    for (const r of rows) {
      for (const tag of languageTags(r.language)) set.add(tag)
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
  }, [rows])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterType && r.type !== filterType) return false
      if (!rowMatchesLanguage(r, filterLanguage)) return false
      return true
    })
  }, [rows, filterType, filterLanguage])

  useEffect(() => {
    if (!modalItem) return
    const stillVisible = filtered.some(
      (r) =>
        r.title === modalItem.title &&
        r.type === modalItem.type &&
        r.creator === modalItem.creator,
    )
    if (!stillVisible) closeModal()
  }, [filtered, modalItem, closeModal])

  return (
    <div className="page">
      <header className="site-header">
        <div className="site-header__brand">
          <span className="site-header__seal" aria-hidden="true" />
          <div className="site-header__titles">
            <p className="site-header__zh" lang="zh-Hans">
              一八八二
            </p>
            <h1 className="site-header__name">The 1882 Foundation</h1>
          </div>
        </div>
        <p className="site-header__tagline">
          Remembering the Chinese Exclusion Act — elevating Asian stories across media and more.
        </p>
      </header>

      <section className="catalog" aria-labelledby="catalog-heading">
        <div className="catalog__toolbar">
          <h2 id="catalog-heading" className="catalog__heading">
            Cultural catalog
          </h2>
          <div className="catalog__filters">
            <label className="filter">
              <span className="filter__label">Media type</span>
              <select
                className="filter__select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter by media type"
              >
                <option value="">All types</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter">
              <span className="filter__label">Language</span>
              <select
                className="filter__select"
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                aria-label="Filter by language"
              >
                <option value="">All languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loadState === 'loading' && (
          <p className="catalog__status" role="status">
            Loading catalog…
          </p>
        )}
        {loadState === 'error' && (
          <p className="catalog__status catalog__status--error" role="alert">
            We could not load the media list. Check that{' '}
            <code>public/media.csv</code> is available and try again.
          </p>
        )}
        {loadState === 'ready' && (
          <>
            <p className="catalog__count" aria-live="polite">
              Showing {filtered.length} of {rows.length} entries
              {filterType ? ` · ${filterType}` : ''}
              {filterLanguage ? ` · ${filterLanguage}` : ''}
            </p>
            <div className="tile-grid">
              {filtered.map((item) => (
                <MediaTile
                  key={`${item.title}-${item.type}-${item.creator}`}
                  item={item}
                  onOpen={setModalItem}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="catalog__empty">
                No items match the selected filters.
              </p>
            )}
          </>
        )}
      </section>

      {modalItem && (
        <MediaModal item={modalItem} onClose={closeModal} />
      )}

      <footer className="site-footer">
        <p>
          Non-profit work for awareness education and community — rooted in
          history pointed toward solidarity.
        </p>
      </footer>
    </div>
  )
}
