## 1. Create the project
npm create vite@latest the-aid-2-times -- --template react
cd the-aid-2-times

## 2. Install dependencies
npm install zustand          # state management (replaces localStorage spaghetti)
npm install                  # base vite/react deps

## 3. Folder structure
src/
├── data/
│   └── curriculum.js        ← DONE: all subjects, team, constants
│
├── store/
│   └── useStore.js          ← DONE: useUserStore, useCIEStore, usePDFStore, useUIStore
│
├── utils/
│   └── cgpaCalc.js          ← DONE: calcSGPA, calcCGPA, forecastCGPA, predictExternal
│
├── components/
│   ├── SubjectCard.jsx      ← DONE: unit accordion, PYP/Lab/Theory tabs
│   │
│   ├── Nav.jsx              ← TODO: top nav, profile button, hamburger
│   ├── Ticker.jsx           ← TODO: scrolling ticker strip
│   ├── Hero.jsx             ← TODO: animated hero section
│   ├── ResourceVault.jsx    ← TODO: reg/branch/sem selectors + renders SubjectCards
│   ├── Team.jsx             ← TODO: team grid
│   ├── Footer.jsx           ← TODO: footer
│   │
│   ├── LoginGate.jsx        ← TODO: login/register form with pfp upload
│   ├── Dashboard.jsx        ← TODO: CGPA chart + CIETracker + GradePredictor
│   ├── CIETracker.jsx       ← TODO: marks inputs per subject (lives inside Dashboard)
│   ├── CGPACalculator.jsx   ← TODO: SGPA calc + CGPA forecaster modal
│   │
│   ├── PDFViewer.jsx        ← TODO: iframe viewer + timer + notes + bookmarks
│   ├── QuickSearch.jsx      ← TODO: Ctrl+K overlay
│   └── ProfileEdit.jsx      ← TODO: edit profile modal
│
├── styles/
│   ├── globals.css          ← variables, reset, base
│   ├── nav.css
│   ├── hero.css
│   ├── resources.css
│   ├── modals.css
│   └── dashboard.css
│
├── App.jsx                  ← DONE: root shell, lazy imports
└── main.jsx                 ← entry point (unchanged from Vite default)

## 4. public/
public/
├── manifest.json            ← PWA manifest
├── sw.js                    ← Service worker (offline support)
└── icons/                   ← App icons

## 5. Component dependency map
App
 ├── LoginGate       (useUserStore)
 ├── Nav             (useUserStore, useUIStore)
 ├── Ticker          (useUIStore)
 ├── Hero            (static)
 ├── ResourceVault   (useUIStore, SUBJECTS)
 │    └── SubjectCard (useUIStore) ← DONE
 │         └── UnitRow, ResourceTabs, PDFItem
 ├── Team            (TEAM data)
 ├── Footer          (static)
 ├── PDFViewer       (useUIStore, usePDFStore)
 ├── CGPACalculator  (useUserStore, cgpaCalc)
 ├── Dashboard       (useUserStore, useCIEStore, cgpaCalc)
 │    ├── CIETracker
 │    └── GradePredictor
 └── QuickSearch     (useUIStore, SUBJECTS)

## 6. Adding PDFs (no backend needed yet)
# In curriculum.js, just fill in the resource URLs:
resources: {
  theory: {
    unit1: [{ title: "Introduction Slides", url: "https://drive.google.com/..." }],
    unit3: [{ title: "CPU Scheduling Notes", url: "https://drive.google.com/..." }],
  },
  pyp: {
    mid:    [{ title: "Mid 1 - 2023", url: "https://drive.google.com/..." }],
    endsem: [{ title: "End Sem - Nov 2023", url: "https://drive.google.com/..." }],
  },
  lab: { files: [{ title: "OS Lab Manual", url: "https://drive.google.com/..." }] },
}