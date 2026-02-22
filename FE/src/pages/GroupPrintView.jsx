import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import groupService from '../services/groupService';
import groupFlightSegmentService from '../services/groupFlightSegmentService';
import transportService from '../services/transportService';
import assignmentService from '../services/assignmentService';
import hotelService from '../services/hotelService';
import trainService from '../services/trainService';
import rawdahService from '../services/rawdahService';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmt = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[date.getMonth()]}-${String(date.getFullYear()).slice(2)}`;
};

const fmtTime = (t) => {
    if (!t) return '';
    return String(t).substring(0, 5);
};

const fmtFullDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

/* ─────────────────────────────────────────────
   Print Styles (injected into <head>)
───────────────────────────────────────────── */
const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  @page {
    size: A4 portrait;
    margin: 10mm 10mm 10mm 10mm;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    color: #000;
    background: #fff;
  }

  .print-page {
    width: 190mm;
    margin: 0 auto;
    padding: 0;
  }

  .company-title {
    text-align: center;
    font-size: 20pt;
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .date-row {
    display: flex;
    margin-bottom: 8px;
  }

  .date-label {
    background: #555;
    color: #fff;
    font-weight: bold;
    padding: 3px 8px;
    font-size: 7.5pt;
  }

  .date-value {
    background: #d9d9d9;
    padding: 3px 8px;
    font-size: 7.5pt;
    font-weight: bold;
  }

  /* ─── Tables ─── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }

  th {
    background: #0F766E;
    color: #fff;
    font-weight: bold;
    text-align: center;
    border: 1px solid #000;
    padding: 4px 3px;
    font-size: 7.5pt;
    text-transform: uppercase;
  }

  td {
    border: 1px solid #000;
    padding: 4px 4px;
    text-align: center;
    font-size: 7.5pt;
    vertical-align: middle;
  }

  tr.data-row td {
    height: 22px;
  }

  .section-header {
    background: #555;
    color: #fff;
    text-align: center;
    font-weight: bold;
    font-size: 8pt;
    padding: 4px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid #000;
  }

  .header-group-row th {
    background: #0F766E;
    color: #fff;
  }

  .text-left { text-align: left !important; }
  .text-center { text-align: center !important; }
  
  .colspan-header {
    border: 1px solid #000;
    background: #0F766E;
    color: #fff;
  }

  .season-badge {
    display: inline-block;
    background: #0F766E;
    color: #fff;
    font-weight: bold;
    font-size: 7.5pt;
    padding: 3px 8px;
    margin-left: 8px;
    vertical-align: middle;
  }

  @media print {
    .no-print { display: none !important; }
    .no-print-toolbar { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }

  @media screen {
    body { background: #e5e7eb; }
    .print-page {
      background: #fff;
      margin: 20px auto;
      padding: 15mm;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      min-height: 297mm;
    }
    .no-print-toolbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #1e293b;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .btn-print {
      background: #0F766E;
      color: #fff;
      border: none;
      padding: 8px 20px;
      font-weight: 700;
      font-size: 13px;
      border-radius: 4px;
      cursor: pointer;
      font-family: Arial, Helvetica, sans-serif;
    }
    .btn-back {
      background: transparent;
      color: #fff;
      border: 1px solid #475569;
      padding: 8px 16px;
      font-size: 13px;
      border-radius: 4px;
      cursor: pointer;
      font-family: Arial, Helvetica, sans-serif;
    }
    .toolbar-title {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }
    .page-wrapper {
      padding-top: 60px;
    }
  }
`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const GroupPrintView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEmbed = new URLSearchParams(location.search).get('embed') === 'true';

    // Today's date for the document header
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

    const [group, setGroup] = useState(null);
    const [segments, setSegments] = useState([]);
    const [transports, setTransports] = useState([]);
    const [tourLeaders, setTourLeaders] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [trains, setTrains] = useState([]);
    const [rawdahData, setRawdahData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const [grp, segs, trpts, tls, htls, trns, rawdah] = await Promise.all([
                groupService.getById(id),
                groupFlightSegmentService.getByGroup(id),
                transportService.getByGroup(id),
                assignmentService.getTourLeaders(id),
                hotelService.getByGroup(id),
                trainService.getByGroup(id),
                rawdahService.getByGroup(id).catch(() => null) // Catch 404s gracefully
            ]);
            setGroup(grp);
            setSegments(Array.isArray(segs) ? segs : []);
            setTransports(Array.isArray(trpts) ? trpts : []);
            setTourLeaders(Array.isArray(tls) ? tls : []);
            setHotels(Array.isArray(htls) ? htls : []);
            setTrains(Array.isArray(trns) ? trns : []);
            setRawdahData(rawdah);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);

    // Inject print styles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = PRINT_STYLES;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#e5e7eb', fontFamily: 'Arial' }}>
                <p>Loading data...</p>
            </div>
        );
    }

    if (!group) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#e5e7eb', fontFamily: 'Arial' }}>
                <p>Group not found.</p>
            </div>
        );
    }

    const tourLeaderName = tourLeaders.map(t => t.name).join('\n') || '—';
    const tourLeaderPhone = tourLeaders.map(t => t.phone).join('\n') || '—';

    const flightRows = segments.length > 0 ? segments : [null];
    const transportRows = transports.length > 0 ? transports : [null, null];
    const hotelRows = hotels.length > 0 ? hotels : [null, null];
    const trainRows = trains.length > 0 ? trains : [null];
    // Rawdah placeholder rows
    const rawdahRows = [
        {
            gender: 'MEN',
            date: rawdahData && rawdahData.men_date ? fmtFullDate(rawdahData.men_date) : '',
            time: rawdahData && rawdahData.men_time ? fmtTime(rawdahData.men_time) : ''
        },
        {
            gender: 'WOMEN',
            date: rawdahData && rawdahData.women_date ? fmtFullDate(rawdahData.women_date) : '',
            time: rawdahData && rawdahData.women_time ? fmtTime(rawdahData.women_time) : ''
        },
    ];

    return (
        <div className="page-wrapper">
            {/* Toolbar — hidden when embedded in iframe */}
            {!isEmbed && (
                <div className="no-print-toolbar no-print">
                    <button className="btn-back" onClick={() => navigate(`/groups/${id}`)}>← Back</button>
                    <span className="toolbar-title">{group.group_code} — Print Preview</span>
                    <button className="btn-print" onClick={handlePrint}>🖨 Print / Save PDF</button>
                </div>
            )}

            {/* A4 Print Page */}
            <div className="print-page">
                {/* Company Title */}
                <div className="company-title">VAUZA TAMMA ABADI</div>

                {/* Date Row + Season Badge */}
                <div className="date-row">
                    <span className="date-label">DATE:</span>
                    <span className="date-value">{todayStr}</span>
                    <span className="season-badge">UMRAH SEASON 1447 H</span>
                </div>

                {/* Group Info Table */}
                <table>
                    <thead>
                        <tr className="header-group-row">
                            <th>GROUP NO</th>
                            <th>SUB AGENT NAME</th>
                            <th>NO. OF PAX</th>
                            <th>TOUR LEADER</th>
                            <th>PHONE NO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="data-row">
                            <td style={{ fontWeight: 'bold' }}>{group.group_code}</td>
                            <td style={{ fontWeight: 'bold' }}>VAUZA TAMMA ABADI</td>
                            <td style={{ fontWeight: 'bold' }}>{group.total_pax}</td>
                            <td style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}>{tourLeaderName}</td>
                            <td style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}>{tourLeaderPhone}</td>
                        </tr>
                    </tbody>
                </table>

                {/* ─── FLIGHT INFORMATION ─── */}
                <table>
                    <thead>
                        <tr>
                            <td colSpan={8} className="section-header">FLIGHT INFORMATION</td>
                        </tr>
                        <tr>
                            <th>FROM</th>
                            <th>TO</th>
                            <th>DATE</th>
                            <th>ETD</th>
                            <th>ETA</th>
                            <th>CARRIER</th>
                            <th>FLIGHT NO</th>
                            <th>REMARKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flightRows.map((seg, i) => (
                            <tr key={i} className="data-row">
                                <td>{seg?.origin || ''}</td>
                                <td>{seg?.destination || ''}</td>
                                <td>{seg ? fmt(seg.flight_date) : ''}</td>
                                <td>{seg ? fmtTime(seg.override_etd || seg.scheduled_etd) : ''}</td>
                                <td>{seg ? fmtTime(seg.override_eta || seg.scheduled_eta) : ''}</td>
                                <td>{seg?.airline || ''}</td>
                                <td>{seg?.flight_number || ''}</td>
                                <td>{seg?.remarks || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ─── HOTEL ACCOMMODATION ─── */}
                <table>
                    <thead>
                        <tr>
                            <td colSpan={9} className="section-header">HOTEL ACCOMMODATION</td>
                        </tr>
                        <tr>
                            <th rowSpan={2}>CITY</th>
                            <th rowSpan={2}>HOTEL</th>
                            <th colSpan={2}>DATE</th>
                            <th colSpan={4}>TYPE ROOM</th>
                            <th rowSpan={2}>RESV NO</th>
                        </tr>
                        <tr>
                            <th>IN</th>
                            <th>OUT</th>
                            <th>DBL</th>
                            <th>TRPL</th>
                            <th>QUAD</th>
                            <th>QUINT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotelRows.map((row, i) => (
                            <tr key={i} className="data-row">
                                <td>{row?.city || ''}</td>
                                <td>{row?.hotel_name || ''}</td>
                                <td>{row ? fmt(row.check_in) : ''}</td>
                                <td>{row ? fmt(row.check_out) : ''}</td>
                                <td>{row?.room_dbl || ''}</td>
                                <td>{row?.room_trpl || ''}</td>
                                <td>{row?.room_quad || ''}</td>
                                <td>{row?.room_quint || ''}</td>
                                <td>{row?.reservation_no || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ─── TRANSPORT ─── */}
                <table>
                    <thead>
                        <tr>
                            <td colSpan={6} className="section-header">TRANSPORT</td>
                        </tr>
                        <tr>
                            <th>DATE</th>
                            <th>FROM</th>
                            <th>TO</th>
                            <th>TIME</th>
                            <th>TOTAL BUS</th>
                            <th>BUS COMPANY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transportRows.map((t, i) => (
                            <tr key={i} className="data-row">
                                <td>{t ? fmt(t.journey_date) : ''}</td>
                                <td className="text-left" style={{ paddingLeft: '6px' }}>{t?.pickup_location || ''}</td>
                                <td className="text-left" style={{ paddingLeft: '6px' }}>{t?.drop_location || t?.route || ''}</td>
                                <td>{t ? fmtTime(t.departure_time) : ''}</td>
                                <td>{t?.pax_count ? (t.pax_count < 50 ? 1 : 2) : (t ? 1 : '')}</td>
                                <td>{t?.provider_name || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ─── TRAIN RESERVATION ─── */}
                <table>
                    <thead>
                        <tr>
                            <td colSpan={6} className="section-header">TRAIN RESERVATION</td>
                        </tr>
                        <tr>
                            <th>DATE</th>
                            <th>FROM</th>
                            <th>TO</th>
                            <th>TIME</th>
                            <th>TOTAL HAJJ</th>
                            <th>REMARKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainRows.map((row, i) => (
                            <tr key={i} className="data-row">
                                <td>{row ? fmt(row.train_date) : ''}</td>
                                <td>{row?.from_station || ''}</td>
                                <td>{row?.to_station || ''}</td>
                                <td>{row ? fmtTime(row.departure_time) : ''}</td>
                                <td>{row?.total_hajj || ''}</td>
                                <td>{row?.remarks || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ─── FOR RAWDAH PERMITS ─── */}
                <table>
                    <thead>
                        <tr>
                            <td colSpan={3} className="section-header">FOR RAWDAH PERMITS</td>
                        </tr>
                        <tr>
                            <th></th>
                            <th>DATE</th>
                            <th>TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rawdahRows.map((row, i) => (
                            <tr key={i} className="data-row">
                                <td style={{ fontWeight: 'bold' }}>{row.gender}</td>
                                <td>{row.date}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default GroupPrintView;
