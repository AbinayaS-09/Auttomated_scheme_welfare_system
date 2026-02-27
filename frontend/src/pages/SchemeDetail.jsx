import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SchemeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scheme, setScheme] = useState(null);
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchSchemeDetails();
    }, [id]);

    const fetchSchemeDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/schemes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setScheme(data.scheme);
                setEligibility(data.eligibility);
            } else {
                setError('Scheme not found');
            }
        } catch (err) {
            console.error('Error fetching scheme details:', err);
            setError('Failed to load scheme details');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: '📋 Overview', icon: '📋' },
        { id: 'eligibility', label: '✅ Eligibility', icon: '✅' },
        { id: 'benefits', label: '🎁 Benefits', icon: '🎁' },
        { id: 'apply', label: '📝 How to Apply', icon: '📝' },
        { id: 'documents', label: '📁 Documents', icon: '📁' },
    ];

    const renderMatchBadge = (score) => {
        if (!score) return null;
        const pct = Math.round(score);
        let color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';
        let bg = pct >= 80 ? '#f0fdf4' : pct >= 60 ? '#fffbeb' : '#fef2f2';
        let border = pct >= 80 ? '#86efac' : pct >= 60 ? '#fcd34d' : '#fca5a5';
        return (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: bg,
                border: `1.5px solid ${border}`,
                color: color,
                borderRadius: '999px',
                padding: '6px 16px',
                fontWeight: 700,
                fontSize: '14px',
            }}>
                <span style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    background: color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    flexShrink: 0
                }}>{pct}%</span>
                Match Score
            </div>
        );
    };

    const renderTextBlock = (text, emptyMsg = 'No information available.') => {
        if (!text) return <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>{emptyMsg}</p>;
        // Split by numbered lists or bullet patterns for better readability
        const lines = text.split(/\n/).filter(l => l.trim());
        if (lines.length <= 1) {
            return <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '15px' }}>{text}</p>;
        }
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lines.map((line, i) => (
                    <li key={i} style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #f3f4f6',
                        color: '#374151',
                        fontSize: '15px',
                        lineHeight: 1.6
                    }}>
                        <span style={{ color: '#f97316', fontWeight: 700, fontSize: '18px', marginTop: '-1px', flexShrink: 0 }}>•</span>
                        <span>{line.replace(/^[\d\.\-\*•]\s*/, '')}</span>
                    </li>
                ))}
            </ul>
        );
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '16px' }}>Loading scheme details...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={styles.loadingContainer}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Error Loading Scheme</h2>
            <p style={{ color: '#6b7280' }}>{error}</p>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>← Go Back</button>
        </div>
    );

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .tab-btn:hover { background: #fff7ed !important; color: #ea580c !important; }
                .tab-btn.active { background: #fff !important; color: #ea580c !important; border-bottom: 3px solid #f97316 !important; font-weight: 700 !important; }
                .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249,115,22,0.35) !important; }
                .back-link:hover { color: #ea580c !important; }
                .card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.10) !important; }
            `}</style>

            {/* Top Nav Bar */}
            <header style={styles.header}>
                <div style={styles.headerTop}>
                    <span>भारत सरकार | Government of India</span>
                    <span>Scheme Portal</span>
                </div>
                <div style={styles.headerMain}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/user/home')}>
                        <div style={styles.logo}>₹</div>
                        <span style={{ fontWeight: 700, fontSize: '18px', color: '#1f2937' }}>User Dashboard</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="back-link" onClick={() => navigate(-1)} style={styles.navLink}>
                            ← Back to Schemes
                        </button>
                        <button onClick={() => navigate('/user/home')} style={styles.navLink}>
                            🏠 Home
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroInner}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/home')}>Home</span>
                        <span>›</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>Schemes</span>
                        <span>›</span>
                        <span style={{ color: '#fff', fontWeight: 600 }}>Scheme Details</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={styles.levelBadge}>{scheme?.scheme_level || 'Central'}</span>
                        {eligibility && renderMatchBadge(eligibility.matchScore)}
                    </div>

                    <h1 style={styles.heroTitle}>{scheme?.scheme_name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '20px' }}>🏛️</span>
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500 }}>{scheme?.ministry || 'Government of India'}</span>
                    </div>

                    {/* Official Link */}
                    {scheme?.scheme_url && (
                        <a
                            href={scheme.scheme_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn"
                            style={styles.officialBtn}
                        >
                            🔗 View Official Scheme Page
                        </a>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                
                {/* Eligibility Match Card (if available) */}
                {eligibility && eligibility.matchDetails && (
                    <div style={{ ...styles.card, marginBottom: '28px', animation: 'fadeIn 0.4s ease' }} className="card">
                        <h3 style={styles.cardTitle}>🎯 Your Eligibility Match</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px' }}>
                            {Object.entries(eligibility.matchDetails).map(([key, detail]) => {
                                const score = detail.score;
                                const bg = score === 1 ? '#f0fdf4' : score > 0 ? '#fffbeb' : '#fef2f2';
                                const border = score === 1 ? '#86efac' : score > 0 ? '#fcd34d' : '#fca5a5';
                                const color = score === 1 ? '#15803d' : score > 0 ? '#b45309' : '#dc2626';
                                const icon = score === 1 ? '✅' : score > 0 ? '⚠️' : '❌';
                                return (
                                    <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span>{icon}</span>
                                            <span style={{ fontWeight: 700, fontSize: '13px', color: color, textTransform: 'capitalize' }}>
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{detail.reason}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div style={styles.tabBar}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...styles.tabBtn,
                                color: activeTab === tab.id ? '#ea580c' : '#4b5563',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                borderBottom: activeTab === tab.id ? '3px solid #f97316' : '3px solid transparent',
                                background: activeTab === tab.id ? '#fff' : 'transparent',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ ...styles.card, animation: 'fadeIn 0.3s ease' }} className="card" key={activeTab}>

                    {activeTab === 'overview' && (
                        <div>
                            <h3 style={styles.sectionTitle}>About This Scheme</h3>
                            {renderTextBlock(scheme?.description, 'No description available for this scheme.')}

                            {/* Quick Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '28px' }}>
                                <div style={styles.infoCard}>
                                    <span style={styles.infoIcon}>🏛️</span>
                                    <div>
                                        <p style={styles.infoLabel}>Ministry / Department</p>
                                        <p style={styles.infoValue}>{scheme?.ministry || '—'}</p>
                                    </div>
                                </div>
                                <div style={styles.infoCard}>
                                    <span style={styles.infoIcon}>📍</span>
                                    <div>
                                        <p style={styles.infoLabel}>Scheme Level</p>
                                        <p style={styles.infoValue}>{scheme?.scheme_level || '—'}</p>
                                    </div>
                                </div>
                                <div style={styles.infoCard}>
                                    <span style={styles.infoIcon}>🌐</span>
                                    <div>
                                        <p style={styles.infoLabel}>Source</p>
                                        <p style={styles.infoValue}>{scheme?.source || 'myscheme.gov.in'}</p>
                                    </div>
                                </div>
                                {scheme?.scheme_url && (
                                    <div style={styles.infoCard}>
                                        <span style={styles.infoIcon}>🔗</span>
                                        <div>
                                            <p style={styles.infoLabel}>Official Link</p>
                                            <a href={scheme.scheme_url} target="_blank" rel="noopener noreferrer"
                                                style={{ color: '#f97316', fontWeight: 600, fontSize: '14px', textDecoration: 'none', wordBreak: 'break-all' }}>
                                                {scheme.scheme_url.length > 45 ? scheme.scheme_url.slice(0, 45) + '…' : scheme.scheme_url}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'eligibility' && (
                        <div>
                            <h3 style={styles.sectionTitle}>Eligibility Criteria</h3>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Who can apply for this scheme:</p>
                            {renderTextBlock(scheme?.eligibility, 'No specific eligibility criteria available.')}
                        </div>
                    )}

                    {activeTab === 'benefits' && (
                        <div>
                            <h3 style={styles.sectionTitle}>Benefits Provided</h3>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>What you will receive under this scheme:</p>
                            {renderTextBlock(scheme?.benefits, 'No benefits information available.')}
                        </div>
                    )}

                    {activeTab === 'apply' && (
                        <div>
                            <h3 style={styles.sectionTitle}>Application Process</h3>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Follow these steps to apply:</p>
                            {renderTextBlock(scheme?.application_process, 'No application process information available.')}

                            {scheme?.scheme_url && (
                                <div style={{ marginTop: '28px', padding: '20px', background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', borderRadius: '12px', border: '1px solid #fed7aa', textAlign: 'center' }}>
                                    <p style={{ fontSize: '15px', color: '#7c3aed', fontWeight: 500, marginBottom: '12px' }}>
                                        Ready to apply? Visit the official scheme portal:
                                    </p>
                                    <a
                                        href={scheme.scheme_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn"
                                        style={{ ...styles.officialBtn, position: 'relative', display: 'inline-flex', marginTop: 0 }}
                                    >
                                        🔗 Apply on Official Portal
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <h3 style={styles.sectionTitle}>Documents Required</h3>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Keep these documents ready before applying:</p>
                            {renderTextBlock(scheme?.documents_required, 'No document requirements available.')}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                {scheme?.scheme_url && (
                    <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '48px' }}>
                        <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '15px' }}>
                            Ready to apply? Visit the official government portal for this scheme.
                        </p>
                        <a
                            href={scheme.scheme_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn"
                            style={{ ...styles.officialBtn, position: 'relative', display: 'inline-flex', marginTop: 0, fontSize: '16px', padding: '14px 32px' }}
                        >
                            🔗 Open Official Scheme Page ↗
                        </a>
                        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '10px' }}>
                            Source: {scheme.source || 'myscheme.gov.in'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f3f4f6',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    loadingContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#f97316',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    backBtn: {
        marginTop: '20px',
        padding: '10px 24px',
        background: '#f97316',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '15px',
    },
    header: {
        background: '#fff',
        borderBottom: '4px solid #f97316',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    headerTop: {
        background: 'linear-gradient(90deg, #ea580c, #f97316)',
        color: '#fff',
        padding: '4px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
    },
    headerMain: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #f97316, #16a34a)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        fontSize: '18px',
        boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
    },
    navLink: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#4b5563',
        fontSize: '14px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '8px',
        transition: 'color 0.2s',
    },
    hero: {
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ea580c 100%)',
        padding: '48px 0 56px',
    },
    heroInner: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
    },
    heroTitle: {
        fontSize: 'clamp(22px, 4vw, 34px)',
        fontWeight: 800,
        color: '#fff',
        margin: 0,
        lineHeight: 1.3,
        textShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    levelBadge: {
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '999px',
        padding: '4px 14px',
        fontSize: '13px',
        fontWeight: 600,
        backdropFilter: 'blur(4px)',
    },
    officialBtn: {
        marginTop: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#fff',
        color: '#ea580c',
        padding: '12px 24px',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '15px',
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    main: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 24px',
    },
    card: {
        background: '#fff',
        borderRadius: '16px',
        padding: '28px 32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
        border: '1px solid #f3f4f6',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#1f2937',
        margin: '0 0 4px',
    },
    tabBar: {
        display: 'flex',
        gap: '2px',
        background: '#f9fafb',
        borderRadius: '12px 12px 0 0',
        border: '1px solid #e5e7eb',
        borderBottom: 'none',
        overflowX: 'auto',
        padding: '0 8px',
    },
    tabBtn: {
        padding: '14px 18px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        background: 'transparent',
        borderRadius: '8px 8px 0 0',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#1f2937',
        marginTop: 0,
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid #f3f4f6',
    },
    infoCard: {
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        background: '#f9fafb',
        border: '1px solid #f3f4f6',
        borderRadius: '12px',
        padding: '16px',
    },
    infoIcon: {
        fontSize: '24px',
        flexShrink: 0,
        marginTop: '2px',
    },
    infoLabel: {
        fontSize: '12px',
        color: '#9ca3af',
        margin: '0 0 4px',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.5px',
    },
    infoValue: {
        fontSize: '15px',
        color: '#1f2937',
        fontWeight: 600,
        margin: 0,
    },
};

export default SchemeDetail;
