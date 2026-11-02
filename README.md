# RESQ prototype

RESQ is a simulated incident-reporting, citizen-safety, and command-centre prototype. Reports and operator changes are stored in browser `localStorage`; they are not monitored, dispatched, or synchronized across devices.

## Phase 4: RESQ AI Intelligence

The Citizen Portal provides a multilingual safety assistant and optional report-description analysis. The Command Centre can analyze a selected report, summarize it for operators, identify possible duplicate reports, and suggest cautious next steps. An operator must explicitly review and apply suggested category or severity changes.

### Gemini configuration

Gemini is optional. Without a server-side API key, the app uses deterministic local rules and safety responses, labelled **Demo · local rules**. The demo is not a machine-learning model and must not be used for real incident triage.

Set the key only in the Node.js server environment. Never add it to a `VITE_*` variable or browser code.

PowerShell development example:

```powershell
$env:GEMINI_API_KEY = "your-server-side-key"
npm run dev
```

For production, build the static assets and run the included Node server, which serves both the app and the same-origin intelligence API:

```powershell
npm run build
$env:GEMINI_API_KEY = "your-server-side-key"
npm start
```

Set `GEMINI_MODEL` to override the default `gemini-2.5-flash` model, and `PORT` to change the production server port. The API key remains on the server and is not returned by the service-status endpoint. If Gemini is unavailable, the UI explains that it has switched to the local demo fallback.

The included endpoint limits Gemini requests to 20 per minute per client address and accepts same-origin JSON requests only. Before exposing this prototype publicly, add deployment-appropriate authentication, monitoring, and quota controls at the hosting layer.

When Gemini is configured, a user-triggered analysis sends the incident description (and selected category) to Google Gemini; assistant questions and recent conversation text are sent for replies. Avoid entering personal or sensitive information. AI output is advisory, may be wrong, and never contacts emergency services or dispatches a response.

## India localization and source data

RESQ's maps, citizen location fields, command-centre filters, and demonstration incidents are India-focused. Seed incidents are explicitly simulated and share the existing browser-local incident store; previously submitted citizen records are not automatically relocated.

The national emergency number shown in safety guidance is **112**. Official references link to the National Disaster Management Authority (NDMA) and National Centre for Seismology (NCS). The disaster dashboard links to NCS/RISEQ as the primary Indian earthquake source. A reliable current machine-readable NCS feed could not be confirmed, so earthquake records are fetched separately from the supplementary USGS global catalogue using an India-region bounding box. USGS events are source-attributed, are not asserted to be within India's borders, and are never added to the simulated incident store. If retrieval fails, no fabricated event records are shown.

The seismic catalogue includes client-side magnitude and time-window filters, an India-region event map, and a source-derived event inspector. The selected-marker pulse is a visual selection highlight only; it does not depict wave propagation or arrival times. The optional seismograph panel is a generated illustrative waveform, is explicitly labelled as simulated, and is not connected to catalogue events or instrument measurements.

## Validation

```powershell
npm test
npm run build
```
