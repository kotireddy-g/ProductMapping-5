import { useState, useEffect, useRef } from 'react';
import { feedData } from '../../data/workPulseFeedData';

// ─── Source config ────────────────────────────────────────────────────────────
const SOURCES = ['JIRA', 'Teams', 'GitHub', 'CC Cams', 'Biometric'];

const SOURCE_STYLE = {
    JIRA: { color: '#0284C7', bg: '#EFF6FF', dot: '🎫' },
    Teams: { color: '#6366F1', bg: '#EEF2FF', dot: '💬' },
    GitHub: { color: '#D97706', bg: '#FFFBEB', dot: '⌥' },
    'CC Cams': { color: '#059669', bg: '#ECFDF5', dot: '📹' },
    Biometric: { color: '#EC4899', bg: '#FDF2F8', dot: '👤' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rowToCard(source, row) {
    const s = SOURCE_STYLE[source];
    if (source === 'JIRA') return {
        source, color: s.color, bg: s.bg, dot: s.dot,
        title: row.id,
        body: row.summary,
        meta: `${row.status} · ${row.priority}`,
        time: row._addedAt ? null : row.updated,
        _addedAt: row._addedAt,
    };
    if (source === 'Teams') return {
        source, color: s.color, bg: s.bg, dot: s.dot,
        title: `${row.sender} ${row.channel}`,
        body: row.preview,
        meta: row.type,
        time: row._addedAt ? null : row.time,
        _addedAt: row._addedAt,
    };
    if (source === 'GitHub') return {
        source, color: s.color, bg: s.bg, dot: s.dot,
        title: `${row.event} · ${row.repo.split('/').pop()}`,
        body: row.branch,
        meta: row.status,
        time: row._addedAt ? null : row.time,
        _addedAt: row._addedAt,
    };
    if (source === 'CC Cams') return {
        source, color: s.color, bg: s.bg, dot: s.dot,
        title: `${row.cam} — ${row.location}`,
        body: row.event,
        meta: row.person !== '—' ? row.person : row.confidence,
        time: row._addedAt ? null : row.time,
        _addedAt: row._addedAt,
    };
    if (source === 'Biometric') return {
        source, color: s.color, bg: s.bg, dot: s.dot,
        title: row.employee,
        body: row.event,
        meta: `${row.dept} · ${row.device}`,
        time: row._addedAt ? null : row.time,
        _addedAt: row._addedAt,
    };
    return null;
}

// Convert all feedData rows into an initial shuffled pool
function buildInitialCards() {
    const cards = [];
    SOURCES.forEach(src => {
        const rows = feedData[src]?.rows ?? [];
        rows.forEach(row => {
            const card = rowToCard(src, row);
            if (card) cards.push({ ...card, _id: `${src}-${Math.random()}` });
        });
    });
    // Shuffle so sources are interleaved
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

// Pool of new events for the ticker
const NEW_EVENTS = [
    { source: 'JIRA', row: { id: 'PRJ-1060', summary: 'API rate limit exceeded alert', status: 'Open', priority: 'Critical', _addedAt: 0 } },
    { source: 'Teams', row: { sender: 'Vikram', channel: '#ops', preview: 'Prod deploy starting in 2 mins', type: '📢 Alert', _addedAt: 0 } },
    { source: 'GitHub', row: { event: 'PR Merged', repo: 'workforce-api', branch: 'feat/rate-limiter', status: 'Merged', _addedAt: 0 } },
    { source: 'CC Cams', row: { cam: 'CAM-09', location: 'Floor 4', event: '✅ Entry', person: 'Suresh Kumar', confidence: '96.2%', _addedAt: 0 } },
    { source: 'Biometric', row: { employee: 'Meera Joshi', dept: 'HR', event: '✅ Clock In', device: 'BIO-03', location: 'Floor 1', _addedAt: 0 } },
    { source: 'JIRA', row: { id: 'PRJ-1061', summary: 'Fix memory leak in worker pool', status: 'In Progress', priority: 'High', _addedAt: 0 } },
    { source: 'Teams', row: { sender: 'Ananya', channel: '#dev', preview: 'PR #387 needs one more approval', type: '💬 Message', _addedAt: 0 } },
    { source: 'GitHub', row: { event: 'Build Failed', repo: 'workforce-ui', branch: 'main', status: 'Failed', _addedAt: 0 } },
    { source: 'CC Cams', row: { cam: 'CAM-02', location: 'Lobby', event: '⚠️ Unknown Person', person: '—', confidence: '61.4%', _addedAt: 0 } },
    { source: 'Biometric', row: { employee: 'Karan Nair', dept: 'Engineering', event: '✅ Clock Out', device: 'BIO-04', location: 'Floor 2', _addedAt: 0 } },
];
let newEventIdx = 0;

function getRelativeTime(addedAt) {
    if (!addedAt) return '';
    const secs = Math.floor((Date.now() - addedAt) / 1000);
    if (secs < 10) return 'Just now';
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    return `${mins}m ago`;
}

// ─── Card component ───────────────────────────────────────────────────────────
function FeedCard({ card, isNew }) {
    const s = SOURCE_STYLE[card.source] || SOURCE_STYLE.JIRA;
    const timeLabel = card._addedAt ? getRelativeTime(card._addedAt) : card.time;

    return (
        <div style={{
            background: '#FFFFFF',
            border: `1px solid ${s.color}25`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: 8,
            padding: '8px 10px',
            marginBottom: 6,
            flexShrink: 0,
            boxShadow: isNew ? `0 0 0 2px ${s.color}30` : '0 1px 3px rgba(0,0,0,0.05)',
            animation: isNew ? 'feedCardIn 0.4s cubic-bezier(0.16,1,0.3,1) both' : 'none',
            transition: 'box-shadow 0.5s ease',
        }}>
            {/* Source badge + time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: s.bg, color: s.color,
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase',
                }}>
                    {card.dot} {card.source}
                </span>
                {timeLabel && (
                    <span style={{ fontSize: 9, color: isNew ? '#059669' : '#94A3B8', fontWeight: isNew ? 700 : 400 }}>
                        {timeLabel}
                    </span>
                )}
            </div>
            {/* Title */}
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.title}
            </div>
            {/* Body */}
            <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {card.body}
            </div>
            {/* Meta */}
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 3 }}>{card.meta}</div>
        </div>
    );
}

// ─── Main FeedPanel ───────────────────────────────────────────────────────────
export default function FeedPanel() {
    const [cards, setCards] = useState(() => buildInitialCards());
    const [tick, setTick] = useState(0);
    const containerRef = useRef(null);
    const isUserScrolling = useRef(false);
    const scrollPauseTimer = useRef(null);

    // 1-sec tick to refresh relative times
    useEffect(() => {
        const t = setInterval(() => setTick(n => n + 1), 1000);
        return () => clearInterval(t);
    }, []);

    // Auto-scroll upward (smooth physics-based)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let animId;
        const scroll = () => {
            if (!isUserScrolling.current && el) {
                el.scrollTop += 0.6; // pixels per frame — slow news-ticker speed
                // When we've scrolled near the bottom, jump back to permit infinite loop feel
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
                    el.scrollTop = 0;
                }
            }
            animId = requestAnimationFrame(scroll);
        };
        animId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animId);
    }, []);

    // Pause auto-scroll on hover
    const handleMouseEnter = () => { isUserScrolling.current = true; };
    const handleMouseLeave = () => {
        if (scrollPauseTimer.current) clearTimeout(scrollPauseTimer.current);
        scrollPauseTimer.current = setTimeout(() => {
            isUserScrolling.current = false;
        }, 800);
    };

    // Inject a new card every 5 seconds (faster than Live panel to feel dynamic)
    useEffect(() => {
        const timer = setInterval(() => {
            const evt = NEW_EVENTS[newEventIdx % NEW_EVENTS.length];
            newEventIdx++;
            const card = rowToCard(evt.source, { ...evt.row, _addedAt: Date.now() });
            if (!card) return;
            card._id = `new-${Date.now()}-${Math.random()}`;
            card._isNew = true;

            setCards(prev => {
                const updated = [card, ...prev];
                // Cap at 60 cards to prevent memory growth
                return updated.slice(0, 60);
            });
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFBFC', borderLeft: '1px solid var(--border)' }}>
            {/* Header */}
            <div style={{
                padding: '14px 12px 10px', borderBottom: '1px solid #F1F5F9', flexShrink: 0,
                background: '#FFFFFF',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'Syne,sans-serif' }}>Feed</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 999, padding: '1px 7px' }}>
                        <span className="live-dot" style={{ width: 5, height: 5 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#059669', letterSpacing: '0.07em' }}>LIVE</span>
                    </span>
                </div>
                {/* Source legend dots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {SOURCES.map(src => (
                        <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: SOURCE_STYLE[src].color, flexShrink: 0 }} />
                            <span style={{ fontSize: 9, color: '#64748B', fontWeight: 500 }}>{src}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrolling feed */}
            <div
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ flex: 1, overflowY: 'scroll', padding: '8px 8px 0', minHeight: 0, scrollbarWidth: 'none' }}
            >
                {/* Hide native scrollbar */}
                <style>{`.feed-scroll::-webkit-scrollbar { display: none; }`}</style>
                {cards.map((card) => (
                    <FeedCard key={card._id} card={card} isNew={card._isNew && card._addedAt && Date.now() - card._addedAt < 8000} />
                ))}
                {/* Duplicate first half for seamless loop */}
                {cards.slice(0, Math.floor(cards.length / 2)).map((card) => (
                    <FeedCard key={`dup-${card._id}`} card={card} isNew={false} />
                ))}
            </div>

            {/* Footer hint */}
            <div style={{ padding: '6px 10px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF', flexShrink: 0 }}>
                <div style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>Hover to pause • All sources</div>
            </div>

            <style>{`
                @keyframes feedCardIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }
            `}</style>
        </div>
    );
}
