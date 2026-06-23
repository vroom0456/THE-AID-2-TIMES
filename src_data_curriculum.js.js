// ─────────────────────────────────────────────
// THE AID 2 TIMES — Curriculum Data
// Add resources: theory[unitN] = [{title, url}]
//                pyp.mid / pyp.endsem = [{title, url}]
//                lab.files = [{title, url}]
// ─────────────────────────────────────────────

export const BRANCHES = [
  { code: "AIDS",       name: "AI & Data Science" },
  { code: "CSE",        name: "Computer Science" },
  { code: "AIML",       name: "AI & ML" },
  { code: "IT",         name: "Information Technology" },
  { code: "CIC",        name: "CS (IoT & Cyber)" },
  { code: "ECE",        name: "Electronics & Comm" },
  { code: "EVL",        name: "EV & VLSI" },
  { code: "MECHANICAL", name: "Mechanical" },
  { code: "CIVIL",      name: "Civil" },
  { code: "BIOTECH",    name: "Bio-Technology" },
];

export const SEMS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// Credits per semester (R22A AIDS)
export const SEM_CREDITS = { 1:20, 2:22, 3:22.5, 4:23, 5:24, 6:22.5, 7:15, 8:11 };
export const TOTAL_CREDITS = 160;

// Grade boundaries: grade point → min total marks (CIE+SEE out of 100)
export const GRADE_BOUNDS = { 10:90, 9:80, 8:70, 7:60, 6:55, 5:50 };

// ── Helper to make a subject entry ──
const sub = (name, code, credits, units, hasLab = false) => ({
  name, code, credits,
  units,
  resources: {
    theory: {},                          // theory["unit1"] = [{title, url}]
    pyp:    { mid: [], endsem: [] },
    lab:    hasLab ? { files: [] } : null,
  },
});

export const SUBJECTS = {
  R22A: {
    AIDS: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4,
          ["Partial Differentiation","Vector Differential Calculus","Vector Integral Calculus","Vector Spaces","Eigen Values & Eigen Vectors"]),
        sub("Optics & Semiconductor Physics", "22PYC01", 3,
          ["Wave Optics","Lasers, Holography & Fiber Optics","Quantum Mechanics","Free Electron Theory & Band Theory","Semiconductors"], true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3,
          ["Problem Solving & C Fundamentals","Control Statements & Functions","Arrays & Strings","Pointers","Structures, Unions & Files"], true),
        sub("English", "22HSC01", 2,
          ["Reading Skills","Vocabulary & Grammar","Writing Skills","Professional Communication","Presentation Skills"]),
        sub("Engineering Graphics", "22MEC01", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4,
          ["First Order DEs","Higher Order DEs","Numerical Solutions","Interpolation & Numerical Differentiation","Infinite Series"]),
        sub("Data Structures using C++", "22ITC20N", 3,
          ["OOP Concepts","Algorithm Analysis & STL","Linked Lists, Stacks & Queues","Trees, AVL Trees & Heaps","Graphs, Hashing & Pattern Matching"], true),
        sub("Basic Electrical Engineering", "22EEC01", 3,
          ["DC Circuits","AC Circuits","Transformers","DC Machines","Induction Motors & Electrical Installations"], true),
        sub("Chemistry", "22CYC01", 3,
          ["Molecular Orbital Theory","Chemical Kinetics","Electrochemistry","Stereochemistry & Polymers","Nanomaterials & Drugs"], true),
      ],
      III: [
        sub("Mathematical & Statistical Foundations", "22MTC07", 3,
          ["Probability Theory","Random Variables","Probability Distributions","Statistical Estimation","Hypothesis Testing & Regression"]),
        sub("Discrete Mathematics", "22ITC05N", 3,
          ["Mathematical Logic","Relations & Functions","Algebraic Structures","Graph Theory","Trees & Combinatorics"]),
        sub("Exploratory Data Analysis & Visualization", "22ADC31N", 2,
          ["Data Collection & Cleaning","Data Wrangling","Exploratory Analysis","Data Visualization","Dashboarding & R Programming"], true),
        sub("Java Programming", "22ITC02N", 3,
          ["Java Fundamentals","Classes & Objects","Inheritance & Polymorphism","Exception Handling & Packages","Collections & Multithreading"], true),
        sub("Design & Analysis of Algorithms", "22CSC14N", 3,
          ["Algorithm Analysis","Divide & Conquer","Greedy Method","Dynamic Programming","Graph Algorithms & NP Problems"]),
        sub("Digital Logic & Computer Architecture", "22ITC01N", 3,
          ["Number Systems & Boolean Algebra","Combinational Circuits","Sequential Circuits","CPU Organization","Memory & I/O Systems"]),
      ],
      IV: [
        sub("Stochastic Process & Queueing Theory", "22MTC16", 3,
          ["Bivariate Distributions","Stochastic Processes","Markov Chains","Poisson Processes","Queueing Models"]),
        sub("Fundamentals of Machine Learning", "22ADC41N", 3,
          ["Introduction to ML","Supervised Learning","Unsupervised Learning","Model Evaluation","Feature Engineering & Applications"], true),
        sub("Database Management Systems", "22CSC11N", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Enterprise Application Development", "22ITC08N", 3,
          ["Web Technologies","HTML & CSS","JavaScript","Servlets & JSP","MVC Architecture"], true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3,
          ["Managerial Economics","Demand & Supply Analysis","Cost & Production Analysis","Financial Accounting","Capital Budgeting"]),
      ],
      V: [
        sub("Advanced Artificial Neural Networks", "22ADC51N", 3,
          ["Biological Neurons & Perceptrons","Multilayer Neural Networks","Backpropagation","CNNs","Advanced Deep Learning Models"], true),
        sub("Introduction to Data Science", "22ADC52N", 3,
          ["Data Science Process","Data Collection","Data Preprocessing","Data Mining & Analytics","Applications of Data Science"], true),
        sub("Operating Systems", "22CSC15N", 3,
          ["OS Fundamentals","Process Management","CPU Scheduling","Memory Management","File Systems & Deadlocks"], true),
        sub("Software Engineering", "22CSC21N", 3,
          ["Software Process Models","Requirements Engineering","Design Concepts","Testing","Maintenance & Project Management"]),
        sub("Computer Networks", "22ITC10N", 3,
          ["Network Fundamentals","Data Link Layer","Network Layer","Transport Layer","Application Layer"], true),
      ],
      VI: [
        sub("Artificial Intelligence", "22ADC61N", 3,
          ["Intelligent Agents","Problem Solving by Search","Knowledge Representation","Planning","Uncertainty & Probabilistic Reasoning"], true),
        sub("Industrial Internet of Things", "22CIC07N", 3,
          ["IoT Fundamentals","Sensors & Actuators","IoT Communication Protocols","Cloud & IoT Platforms","Industrial IoT Applications"], true),
        sub("Cloud Computing", "22ITC29N", 3,
          ["Cloud Fundamentals","Virtualization","Cloud Services","Cloud Storage","Security & Case Studies"], true),
      ],
      VII: [
        sub("Principles of Big Data Analytics", "22ADC71N", 3,
          ["Big Data Fundamentals","Hadoop Ecosystem","MapReduce","Spark Framework","Big Data Mining & Analytics"], true),
      ],
      VIII: [
        sub("Project Phase II", "22ADC82N", 4, []),
      ],
    },
    CSE: {
      I: [
        sub("Engineering Physics", "22PYC01", 3,
          ["Wave Optics","Lasers","Quantum Mechanics","Band Theory","Semiconductors"], true),
      ],
    },
  },
  R21A: {
    AIDS: {
      I: [
        sub("Mathematics I (R21A)", "21MTC01", 4, ["Unit 1","Unit 2","Unit 3","Unit 4","Unit 5"]),
      ],
    },
  },
};

export const TEAM = [
  {
    name: "Varun Teja Cherukuthota",
    role: "Founder",
    dept: "AIDS, 3rd Year",
    quote: "The goal of THE AID 2 TIMES is to eliminate the friction between students and the resources they need. Everything should be one click away.",
    isFounder: true,
  },
  { name: "Teja Praharsha",       role: "Moderator", dept: "AIDS, 3rd Year" },
  { name: "Hannish Reddi",        role: "Moderator", dept: "AIDS, 3rd Year" },
  { name: "Aishwarya Veldandi",   role: "Moderator", dept: "EVL, 3rd Year"  },
  { name: "Sai Sankeerth Reddy",  role: "Moderator", dept: "MECH, 3rd Year" },
  { name: "Laasya",               role: "Moderator", dept: "AIDS, 3rd Year" },
];