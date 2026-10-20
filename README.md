# Automation Runs Dashboard

A responsive dashboard for viewing and managing automation execution history, built with React and TypeScript as part of a frontend coding challenge.

The application connects to a provided local REST API and allows users to inspect automation runs, filter and sort results, and retry failed executions.

## Tech Stack

- **React 19** — user interface
- **TypeScript** — static typing
- **Vite** — development server and production build
- **CSS Modules** — component-scoped styling
- **Fetch API** — HTTP requests
- **Vitest & React Testing Library** — unit and hook testing
- **ESLint & Prettier** — code quality and formatting

## Getting Started

### Prerequisites

- Node.js 22 or newer
- npm
- The provided Automation Runs API backend

### 1. Start the backend

In the provided backend project directory:

```bash
npm ci
npm start
```

The API runs at:

`http://127.0.0.1:8080`

You can verify that the server is running by opening:

`http://127.0.0.1:8080/health`

Interactive API documentation is available at:

`http://127.0.0.1:8080/docs`

**Note:** The API documentation did not load correctly with the original backend configuration. To fix this, I updated the ReDoc script reference in the backend's `docs.html` file to:

```html
<script src="https://cdn.jsdelivr.net/npm/redoc@2.5.2/bundles/redoc.standalone.js"></script>
```

After this change, the API documentation loaded correctly.

### 2. Configure the frontend

In the frontend project root, create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8080
```

The `.env` file is excluded from version control.

### 3. Install dependencies and run

Open a separate terminal in the frontend project directory:

```bash
npm ci
npm run dev
```

Open the local URL displayed by Vite in your browser (typically `http://localhost:5173`).

The backend must be running for the dashboard to load automation data.

## Features

### Automation Runs Table

Displays the execution history with the following fields:

- Name
- Application
- Status (`success`, `failed`, `running`)
- Timestamp
- Duration

Timestamps are displayed in UTC, and durations are formatted in seconds.

### Search, Filtering and Sorting

- Case-insensitive search by automation name or application
- Status filtering: All, Success, Failed, Running
- Ascending and descending sorting by table columns
- Missing durations (`null`) are always placed at the end when sorting by duration
- Pagination with 10 runs per page

Search, filtering and sorting are performed on the client side. The data is processed in the following order:

**Search → Filter → Sort → Paginate**

### Run Details

Selecting a table row opens a details panel with additional information about the run.

The panel supports keyboard interaction, including Escape to close.

### Retry Failed Runs

Failed runs can be retried from the table or the details panel.

When a retry succeeds:

- The API returns `202 Accepted`.
- The corresponding run is updated to `running`.
- Its duration is reset to `null`.

While a retry request is pending, additional retry attempts are blocked to prevent duplicate requests.

If the request fails, the original run remains unchanged and an error notification is displayed.

### Loading and Error States

The interface handles:

- Initial loading with a skeleton UI
- Failed data loading with an option to retry
- Empty API responses
- No results matching the current search or filters
- Failed retry requests with an error notification

### Execution Statistics

The dashboard also displays:

- Total runs
- Success rate
- Average duration
- Failed runs

Statistics are calculated from the loaded dataset.

## Project Structure

```text
src/
├── app/
│   └── App.tsx
├── features/
│   └── automation-runs/
│       ├── api/
│       │   └── runsApi.ts
│       ├── components/
│       │   ├── DashboardHeader/
│       │   ├── Pagination/
│       │   ├── RunDetails/
│       │   ├── RunsSkeleton/
│       │   ├── RunsState/
│       │   ├── RunsTable/
│       │   ├── SearchInput/
│       │   ├── StatsOverview/
│       │   ├── StatusFilter/
│       │   └── Toast/
│       ├── hooks/
│       │   └── useAutomationRuns.ts
│       ├── types/
│       │   └── automationRun.ts
│       ├── utils/
│       │   └── sortRuns.ts
│       └── AutomationRunsDashboard.tsx
├── global-styles/
│   └── global.css
└── main.tsx

tests/
├── sortRuns.test.ts
└── useAutomationRuns.test.ts
```

## Technical Decisions

**Feature-based structure**

The automation runs functionality is grouped into a dedicated feature directory to keep related components, types, API functions and utilities together.

**Separation of API and UI logic**

HTTP requests are handled in `runsApi.ts`, while `useAutomationRuns.ts` manages loading, errors, run data and retry operations. Components focus on presentation and user interaction.

**Native Fetch API**

The application uses the browser's built-in `fetch` instead of an additional HTTP client. This keeps dependencies minimal for the scope of the challenge.

**Client-side data processing**

Search, filtering, sorting and pagination are implemented on the frontend because the provided API returns the complete dataset and does not expose these operations as API parameters.

**CSS Modules**

Component-scoped styles help keep the interface organized and reduce unintended styling conflicts.

## Testing

Automated tests cover the sorting utility and the `useAutomationRuns` hook.

The test suite includes:

- Ascending duration sorting
- Descending duration sorting with `null` values last
- Descending timestamp sorting
- Preservation of the original array during sorting
- Successful retry and state update
- Retry failure handling
- Prevention of duplicate retry requests
- Initial data loading error handling

Run all tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

## Code Quality and Production Build

Check linting:

```bash
npm run lint
```

Check formatting:

```bash
npm run format:check
```

Apply formatting:

```bash
npm run format
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The project was verified with passing tests, ESLint, Prettier and a successful production build.

## Testing API Scenarios

The provided backend supports different scenarios through environment variables.

| Scenario      | Behavior                             |
| ------------- | ------------------------------------ |
| `normal`      | Loads runs and supports retry        |
| `empty`       | Returns an empty list                |
| `runs-error`  | Returns an error when loading runs   |
| `retry-error` | Returns an error when retrying a run |

## Potential Improvements

Given more time, I would consider the following improvements:

1. **Shared UI component library** — Extract reusable UI elements such as buttons, inputs, status badges, dialogs, loading indicators, and notifications into a `shared/ui` directory. This would improve consistency, reusability, and maintainability as the application grows.

2. **Real-time retry status updates** — Extend the backend to expose the current execution status after a retry. The frontend could use polling or Server-Sent Events to track the run until it reaches `success` or `failed`, instead of leaving it in the `running` state.

3. **Dedicated run details page** — Introduce React Router and create a separate route such as `/runs/:id` for detailed information about each automation run. This would make individual runs accessible through direct links and browser navigation, rather than only through the current side panel.

4. **Extended test coverage** — Add integration and end-to-end tests for search, filtering, pagination, loading and error states, retry interactions, and responsive behavior. This would complement the existing unit and hook tests.

5. **Server-side filtering and pagination** — For larger datasets, move filtering, sorting, and pagination to the backend to reduce the amount of data transferred and improve frontend performance.

---

---

# Automation Runs Dashboard

Ein responsives Dashboard zur Anzeige und Verwaltung des Ausführungsverlaufs von Automatisierungen, entwickelt mit React und TypeScript im Rahmen einer Frontend-Programmieraufgabe.

Die Anwendung verbindet sich mit einer bereitgestellten lokalen REST-API und ermöglicht es Benutzern, Automatisierungsläufe einzusehen, Ergebnisse zu filtern und zu sortieren sowie fehlgeschlagene Ausführungen erneut zu starten.

## Verwendete Technologien

- **React 19** — Benutzeroberfläche
- **TypeScript** — statische Typisierung
- **Vite** — Entwicklungsserver und Erstellung des Produktions-Builds
- **CSS Modules** — komponentenspezifische Formatierung
- **Fetch API** — HTTP-Anfragen
- **Vitest & React Testing Library** — Unit-Tests und Tests für React-Hooks
- **ESLint & Prettier** — Codequalität und Formatierung

## Erste Schritte

### Voraussetzungen

- Node.js 22 oder neuer
- npm
- Das bereitgestellte Automation Runs API Backend

### 1. Backend starten

Im Verzeichnis des bereitgestellten Backend-Projekts:

```bash
npm ci
npm start
```

Die API ist unter folgender Adresse erreichbar:

`http://127.0.0.1:8080`

Um zu überprüfen, ob der Server läuft, kann folgende Adresse im Browser geöffnet werden:

`http://127.0.0.1:8080/health`

Die interaktive API-Dokumentation ist unter folgender Adresse verfügbar:

`http://127.0.0.1:8080/docs`

**Hinweis:** Die API-Dokumentation wurde mit der ursprünglichen Backend-Konfiguration nicht korrekt geladen. Um das Problem zu beheben, habe ich die Referenz auf das ReDoc-Skript in der Datei `docs.html` des Backends wie folgt angepasst:

```html
<script src="https://cdn.jsdelivr.net/npm/redoc@2.5.2/bundles/redoc.standalone.js"></script>
```

Nach dieser Änderung wurde die API-Dokumentation korrekt geladen.

### 2. Frontend konfigurieren

Im Stammverzeichnis des Frontend-Projekts eine `.env`-Datei mit folgendem Inhalt erstellen:

```env
VITE_API_URL=http://127.0.0.1:8080
```

Die `.env`-Datei ist von der Versionsverwaltung ausgeschlossen.

### 3. Abhängigkeiten installieren und Anwendung starten

Ein separates Terminal im Verzeichnis des Frontend-Projekts öffnen:

```bash
npm ci
npm run dev
```

Anschließend die von Vite angezeigte lokale URL im Browser öffnen (normalerweise `http://localhost:5173`).

Das Backend muss laufen, damit das Dashboard die Automatisierungsdaten laden kann.

## Funktionen

### Tabelle der Automatisierungsläufe

Zeigt den Ausführungsverlauf mit folgenden Informationen an:

- Name
- Anwendung
- Status (`success`, `failed`, `running`)
- Zeitstempel
- Dauer

Zeitstempel werden in UTC angezeigt und Ausführungszeiten in Sekunden formatiert.

### Suche, Filterung und Sortierung

- Suche nach Automatisierungsname oder Anwendung ohne Berücksichtigung der Groß- und Kleinschreibung
- Statusfilter: Alle, Erfolgreich, Fehlgeschlagen, Laufend
- Aufsteigende und absteigende Sortierung nach Tabellenspalten
- Fehlende Ausführungszeiten (`null`) werden bei der Sortierung nach Dauer immer am Ende angezeigt
- Seitennavigation mit 10 Einträgen pro Seite

Suche, Filterung und Sortierung werden clientseitig durchgeführt. Die Daten werden in folgender Reihenfolge verarbeitet:

**Suche → Filterung → Sortierung → Seitennavigation**

### Details eines Automatisierungslaufs

Durch Auswahl einer Tabellenzeile wird ein Detailbereich mit zusätzlichen Informationen zum jeweiligen Automatisierungslauf geöffnet.

Der Detailbereich unterstützt die Bedienung über die Tastatur, einschließlich der Escape-Taste zum Schließen.

### Fehlgeschlagene Automatisierungsläufe erneut starten

Fehlgeschlagene Automatisierungsläufe können direkt aus der Tabelle oder aus dem Detailbereich erneut gestartet werden.

Wenn eine Retry-Anfrage erfolgreich ist:

- Die API gibt `202 Accepted` zurück.
- Der entsprechende Automatisierungslauf wird auf den Status `running` gesetzt.
- Seine Ausführungsdauer wird auf `null` zurückgesetzt.

Während eine Retry-Anfrage verarbeitet wird, werden weitere Retry-Versuche blockiert, um doppelte Anfragen zu verhindern.

Wenn die Anfrage fehlschlägt, bleibt der ursprüngliche Automatisierungslauf unverändert und eine Fehlermeldung wird angezeigt.

### Lade- und Fehlerzustände

Die Benutzeroberfläche berücksichtigt folgende Zustände:

- Initiales Laden mit einer Skeleton-Oberfläche
- Fehler beim Laden der Daten mit einer Möglichkeit zum erneuten Laden
- Leere API-Antworten
- Keine Ergebnisse für die aktuelle Suche oder die ausgewählten Filter
- Fehlgeschlagene Retry-Anfragen mit einer Fehlermeldung

### Ausführungsstatistiken

Das Dashboard zeigt außerdem folgende Statistiken an:

- Gesamtzahl der Automatisierungsläufe
- Erfolgsquote
- Durchschnittliche Ausführungsdauer
- Anzahl fehlgeschlagener Automatisierungsläufe

Die Statistiken werden anhand des geladenen Datensatzes berechnet.

## Projektstruktur

```text
src/
├── app/
│   └── App.tsx
├── features/
│   └── automation-runs/
│       ├── api/
│       │   └── runsApi.ts
│       ├── components/
│       │   ├── DashboardHeader/
│       │   ├── Pagination/
│       │   ├── RunDetails/
│       │   ├── RunsSkeleton/
│       │   ├── RunsState/
│       │   ├── RunsTable/
│       │   ├── SearchInput/
│       │   ├── StatsOverview/
│       │   ├── StatusFilter/
│       │   └── Toast/
│       ├── hooks/
│       │   └── useAutomationRuns.ts
│       ├── types/
│       │   └── automationRun.ts
│       ├── utils/
│       │   └── sortRuns.ts
│       └── AutomationRunsDashboard.tsx
├── global-styles/
│   └── global.css
└── main.tsx

tests/
├── sortRuns.test.ts
└── useAutomationRuns.test.ts
```

## Technische Entscheidungen

**Feature-basierte Projektstruktur**

Die Funktionalität für Automatisierungsläufe ist in einem eigenen Feature-Verzeichnis zusammengefasst, um zusammengehörige Komponenten, Typen, API-Funktionen und Hilfsfunktionen gemeinsam zu organisieren.

**Trennung von API- und UI-Logik**

HTTP-Anfragen werden in `runsApi.ts` verarbeitet, während `useAutomationRuns.ts` das Laden der Daten, die Fehlerbehandlung, die Automatisierungsläufe und die Retry-Vorgänge verwaltet. Die Komponenten konzentrieren sich auf die Darstellung und Benutzerinteraktion.

**Native Fetch API**

Die Anwendung verwendet die integrierte `fetch`-API des Browsers anstelle eines zusätzlichen HTTP-Clients. Dadurch bleibt die Anzahl der Abhängigkeiten für den Umfang dieser Aufgabe gering.

**Clientseitige Datenverarbeitung**

Suche, Filterung, Sortierung und Seitennavigation werden im Frontend implementiert, da die bereitgestellte API den vollständigen Datensatz zurückgibt und keine entsprechenden API-Parameter für diese Funktionen anbietet.

**CSS Modules**

Komponentenspezifische Styles helfen dabei, die Benutzeroberfläche übersichtlich zu organisieren und unbeabsichtigte Konflikte zwischen CSS-Regeln zu reduzieren.

## Tests

Automatisierte Tests decken die Sortierfunktion und den Hook `useAutomationRuns` ab.

Die Testsuite umfasst:

- Aufsteigende Sortierung nach Ausführungsdauer
- Absteigende Sortierung nach Ausführungsdauer mit `null`-Werten am Ende
- Absteigende Sortierung nach Zeitstempel
- Sicherstellung, dass das ursprüngliche Array bei der Sortierung nicht verändert wird
- Erfolgreicher Retry-Vorgang und Aktualisierung des Zustands
- Fehlerbehandlung bei einem fehlgeschlagenen Retry-Vorgang
- Verhinderung doppelter Retry-Anfragen
- Fehlerbehandlung beim initialen Laden der Daten

Alle Tests einmalig ausführen:

```bash
npm run test:run
```

Tests im Watch-Modus ausführen:

```bash
npm test
```

## Codequalität und Produktions-Build

Linting überprüfen:

```bash
npm run lint
```

Formatierung überprüfen:

```bash
npm run format:check
```

Formatierung anwenden:

```bash
npm run format
```

Produktions-Build erstellen:

```bash
npm run build
```

Produktions-Build lokal als Vorschau starten:

```bash
npm run preview
```

Das Projekt wurde mit erfolgreich bestandenen Tests, ESLint, Prettier und einem erfolgreichen Produktions-Build überprüft.

## API-Testszenarien

Das bereitgestellte Backend unterstützt verschiedene Szenarien über Umgebungsvariablen.

| Szenario      | Verhalten                                                                  |
| ------------- | -------------------------------------------------------------------------- |
| `normal`      | Lädt Automatisierungsläufe und unterstützt Retry-Anfragen                  |
| `empty`       | Gibt eine leere Liste zurück                                               |
| `runs-error`  | Gibt beim Laden der Automatisierungsläufe einen Fehler zurück              |
| `retry-error` | Gibt beim erneuten Starten eines Automatisierungslaufs einen Fehler zurück |

## Mögliche Verbesserungen

Mit mehr Zeit würde ich folgende Verbesserungen in Betracht ziehen:

1. **Gemeinsame UI-Komponentenbibliothek** — Wiederverwendbare UI-Elemente wie Buttons, Eingabefelder, Status-Badges, Dialoge, Ladeindikatoren und Benachrichtigungen in ein `shared/ui`-Verzeichnis auslagern. Dies würde die Konsistenz, Wiederverwendbarkeit und Wartbarkeit bei einer Weiterentwicklung der Anwendung verbessern.

2. **Echtzeit-Aktualisierung des Retry-Status** — Das Backend erweitern, damit es nach einem Retry den aktuellen Ausführungsstatus bereitstellt. Das Frontend könnte Polling oder Server-Sent Events verwenden, um den Automatisierungslauf zu verfolgen, bis er den Status `success` oder `failed` erreicht, anstatt dauerhaft im Status `running` zu bleiben.

3. **Eigene Detailseite für Automatisierungsläufe** — React Router integrieren und eine separate Route wie `/runs/:id` erstellen, um detaillierte Informationen zu jedem Automatisierungslauf anzuzeigen. Dadurch wären einzelne Automatisierungsläufe über direkte Links und die Browsernavigation erreichbar, anstatt ausschließlich über den aktuellen seitlichen Detailbereich.

4. **Erweiterte Testabdeckung** — Integrations- und End-to-End-Tests für Suche, Filterung, Seitennavigation, Lade- und Fehlerzustände, Retry-Interaktionen sowie responsives Verhalten hinzufügen. Diese würden die bestehenden Unit-Tests und Hook-Tests ergänzen.

5. **Serverseitige Filterung und Seitennavigation** — Bei größeren Datenmengen Filterung, Sortierung und Seitennavigation ins Backend verlagern, um die übertragene Datenmenge zu reduzieren und die Performance des Frontends zu verbessern.
