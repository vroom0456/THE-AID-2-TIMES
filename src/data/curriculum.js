// ─────────────────────────────────────────────
// THE AID 2 TIMES — Curriculum Data
// Add resources: theory[unitN] = [{title, url}]
//                pyp.mid / pyp.endsem = [{title, url}]
//                lab.files = [{title, url}]
// ─────────────────────────────────────────────

export const BRANCHES = [
  { code: "AIDS",       name: "AI & Data Science" },
  { code: "AIML",       name: "AI & ML" },
  { code: "CSE",        name: "Computer Science" },
  { code: "CIC",        name: "CS (IoT & Cyber)" },
  { code: "IT",         name: "Information Technology" },
  { code: "ECE",        name: "Electronics & Comm" },
  { code: "EVL",        name: "ECE (VLSI)" },
  { code: "EEE",        name: "Electrical & Electronics" },
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

// ── Shared unit definitions (reused across branches) ──
const UNITS = {
  // Maths
  linearAlgebra: ["Partial Differentiation and Its Applications","Vector Differential Calculus and Multiple Integrals","Vector Integral Calculus","Vector Spaces and Linear Transformations","Matrices"],
  diffEqNumerical: ["First-Order Ordinary Differential Equations","Higher-Order Linear Differential Equations","Partial Differential Equations","Numerical Solutions of Equations","Numerical Differentiation and Integration"],
  probStats: ["Probability Spaces","Mathematical Distributions","Bivariate Operations","Statistical Estimations","Inference Testing"],

  // Physics / Chem
  opticsSemi: ["Wave Optics","Lasers and Holography","Fiber Optics","Quantum Mechanics","Physics of Solids & Semiconductors"],
  chemistry: ["Water Technology and Treatment","Electrochemistry and Corrosion","Polymers and Advanced Engineering Materials","Nanomaterials and Molecular Devices","Chemical Fuels and Combustion"],

  // Common I-year
  cProgramming: ["Introduction to Computing & Programming","Control Statements","Arrays and Strings","Functions and Pointers","Structures, Unions & Files"],
  english: ["Vocabulary Building","Grammar and Usage","Reading Comprehension","Writing Skills","Professional Communication"],
  engMechanics: ["Coplanar Concurrent Force Systems","Equilibrium of Coplanar Force Systems","Centroid and Centre of Gravity","Area Moment of Inertia and Mass Moment of Inertia","Friction and Kinematics of Particles"],
  basicEE: ["DC Circuits and Network Theorems","AC Circuits","Transformers","Electrical Machines","Electrical Installations & Batteries"],
  dataStructCpp: ["OOP Concepts","Algorithm Analysis & STL","Linked Lists, Stacks & Queues","Trees, AVL Trees & Heaps","Graphs, Hashing & Pattern Matching"],
  javaProg: ["Java Fundamentals","Classes & Objects","Inheritance & Polymorphism","Exception Handling & Packages","Collections & Multithreading"],
  basicElecSensors: ["Semiconductor Diodes and Rectifiers","Transistor Electronics","Operational Amplifiers","Sensor Engineering","Industrial Sensors"],
  engEcoAcc: ["Economic Laws","Operational Resource Systems","Financial Markets","Balance Accounting","Financial Investments"],

  // CSE / AIDS / AIML / CIC common
  discreteStructures: ["Mathematical Logic","Set Theory and Relations","Algebraic Structures","Graph Theory","Trees & Combinatorics"],
  daa: ["Algorithm Analysis","Divide & Conquer","Greedy Method","Dynamic Programming","Graph Algorithms & NP Problems"],
  dlDesign: ["Number Systems & Boolean Algebra","Combinational Circuits","Sequential Circuits","CPU Organization","Memory & I/O Systems"],
  dbms: ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"],
  coaArch: ["Instruction Set Architecture","Arithmetic & Logic Unit","Control Unit Design","Memory Hierarchy","I/O Organization & Pipelining"],
  computerNetworks: ["Network Fundamentals","Data Link Layer","Network Layer","Transport Layer","Application Layer"],
  operatingSystems: ["OS Fundamentals","Process Management","CPU Scheduling","Memory Management","File Systems & Deadlocks"],
  softwareEngineering: ["Software Process Models","Requirements Engineering","Design Concepts","Testing","Maintenance & Project Management"],
};

export const SUBJECTS = {
  R22A: {

    // ─────────────────────────────────────
    // AIDS — AI & Data Science (R22A)
    // ─────────────────────────────────────
    AIDS: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Data Structures using C++", "22ITC20N", 3, UNITS.dataStructCpp, true),
      ],
      III: [
        sub("Java Programming", "22ITC02N", 3, UNITS.javaProg, true),
        sub("Discrete Structures", "22CSC06", 4, UNITS.discreteStructures),
        sub("Foundations of Data Science", "22ADC01", 3,
          ["Data Science Overview","Data Types & Structures","Python for Data Science","Exploratory Data Analysis","Data Visualization Basics"]),
        sub("Digital Logic Design", "22CSC07N", 3,
          ["Number Systems & Boolean Algebra","Combinational Logic Design","Sequential Logic Design","Registers & Counters","Memory & Programmable Logic"]),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Computer Organization & Architecture", "22CSC10N", 4, UNITS.coaArch),
        sub("Database Management Systems", "22CSC11N", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Mathematical Foundations for Data Science", "22ADC02", 3,
          ["Linear Algebra Review","Multivariate Calculus","Probability Theory","Optimization Fundamentals","Statistical Inference"]),
        sub("Design & Analysis of Algorithms", "22ADC03", 3, UNITS.daa),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Statistical Learning", "22ADC05", 3,
          ["Regression Models","Classification Algorithms","Bayesian Methods","Ensemble Methods","Model Evaluation & Selection"], true),
        sub("Operating Systems", "22CSC15N", 3, UNITS.operatingSystems, true),
        sub("Artificial Intelligence", "22ADC06", 3,
          ["Intelligent Agents","Problem Solving by Search","Knowledge Representation","Planning","Uncertainty & Probabilistic Reasoning"]),
        sub("Software Engineering & Agile Methodologies", "22ADC07", 3,
          ["Software Process Models","Agile & Scrum","Requirements Engineering","Software Design","Testing & Quality Assurance"]),
      ],
      VI: [
        sub("Machine Learning", "22ADC10", 3,
          ["Supervised Learning","Unsupervised Learning","Neural Network Fundamentals","Model Evaluation","Feature Engineering & Applications"], true),
        sub("Big Data Analytics", "22ADC11", 4,
          ["Big Data Fundamentals","Hadoop Ecosystem","MapReduce","Spark Framework","Big Data Mining & Analytics"]),
        sub("Data Communication & Computer Networks", "22ADC12", 3, UNITS.computerNetworks, true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Deep Learning Techniques", "22ADC16", 3,
          ["Biological Neurons & Perceptrons","Multilayer Neural Networks","Backpropagation","CNNs","Advanced Deep Learning Models"]),
        sub("Predictive Analytics & Cryptography", "22ADC17", 4,
          ["Time Series Analysis","Forecasting Models","Cryptographic Primitives","Public Key Infrastructure","Security Applications of ML"]),
      ],
      VIII: [
        sub("Project Part-II", "22CSC39N", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // AIML — CSE (AI & Machine Learning)
    // ─────────────────────────────────────
    AIML: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Data Structures using C++", "22ITC20N", 3, UNITS.dataStructCpp, true),
      ],
      III: [
        sub("Java Programming", "22ITC02N", 3, UNITS.javaProg, true),
        sub("Discrete Structures", "22CSC06", 4, UNITS.discreteStructures),
        sub("Fundamentals of AI & ML", "22CAC01", 3,
          ["Introduction to AI","Search Algorithms","Knowledge Representation","Introduction to ML","Supervised vs Unsupervised Learning"]),
        sub("Digital Logic Design", "22CSC07N", 3,
          ["Number Systems & Boolean Algebra","Combinational Logic Design","Sequential Logic Design","Registers & Counters","Memory & Programmable Logic"]),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Computer Organization & Architecture", "22CSC10N", 4, UNITS.coaArch),
        sub("Database Management Systems", "22CSC11N", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Design & Analysis of Algorithms", "22CAC02", 3, UNITS.daa),
        sub("Foundations of Data Science", "22CAC03", 3,
          ["Data Science Overview","Data Types & Structures","Python for Data Science","Exploratory Data Analysis","Data Visualization Basics"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Mathematical Foundation for Data Science", "22CAC05", 3,
          ["Linear Algebra Review","Multivariate Calculus","Probability Theory","Optimization Fundamentals","Statistical Inference"]),
        sub("Operating Systems", "22CSC15N", 3, UNITS.operatingSystems, true),
        sub("Software Engineering & Agile Methodologies", "22CAC06", 3,
          ["Software Process Models","Agile & Scrum","Requirements Engineering","Software Design","Testing & Quality Assurance"]),
        sub("Machine Learning", "22CAC07", 3,
          ["Regression Models","Classification Algorithms","Bayesian Methods","Ensemble Methods","Model Evaluation & Selection"], true),
      ],
      VI: [
        sub("Deep Learning Foundations", "22CAC10", 3,
          ["Biological Neurons & Perceptrons","Multilayer Neural Networks","Backpropagation","CNNs","Advanced Deep Learning Models"]),
        sub("Natural Language Processing", "22CAC11", 4,
          ["NLP Fundamentals & Text Preprocessing","Lexical & Syntactic Analysis","Language Models & Word Embeddings","Information Extraction","Applications: Sentiment & QA Systems"]),
        sub("Data Communication & Computer Networks", "22CAC12N", 3, UNITS.computerNetworks, true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Reinforcement Learning & Robotics", "22CAC16", 3,
          ["MDP & Bellman Equations","Model-Free RL Methods","Policy Gradient Methods","Robot Kinematics & Control","RL Applications in Robotics"]),
        sub("Cryptography & Cyber Security", "22CAC17", 4,
          ["Cryptographic Primitives","Symmetric & Asymmetric Encryption","Public Key Infrastructure","Network Security Protocols","Cyber Threats & Defense Mechanisms"]),
      ],
      VIII: [
        sub("Project Part-II", "22CSC39N", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // CSE — Computer Science & Engineering
    // ─────────────────────────────────────
    CSE: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Data Structures using C++", "22ITC20N", 3, UNITS.dataStructCpp, true),
      ],
      III: [
        sub("Java Programming", "22ITC02N", 3, UNITS.javaProg, true),
        sub("Discrete Structures", "22CSC06", 4, UNITS.discreteStructures),
        sub("Digital Logic Design", "22CSC07N", 3,
          ["Number Systems & Boolean Algebra","Combinational Logic Design","Sequential Logic Design","Registers & Counters","Memory & Programmable Logic"]),
        sub("Design & Analysis of Algorithms", "22CSC14N", 3, UNITS.daa),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Computer Organization & Architecture", "22CSC10N", 4, UNITS.coaArch),
        sub("Database Management Systems", "22CSC11N", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Theory of Computation", "22CSC48", 3,
          ["Finite Automata","Regular Languages & Grammars","Context-Free Languages","Pushdown Automata","Turing Machines & Decidability"]),
        sub("Web Programming", "22CSC42", 3,
          ["HTML & CSS Fundamentals","JavaScript & DOM","Client-Side Frameworks","Server-Side Programming","Web Application Security"], true),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Computer Networks", "22ITC10N", 3, UNITS.computerNetworks, true),
        sub("Operating Systems", "22CSC15N", 3, UNITS.operatingSystems, true),
        sub("Software Engineering", "22CSC21N", 3, UNITS.softwareEngineering),
        sub("Fundamentals of Data Science", "22CSC59", 3,
          ["Data Science Process","Data Collection & Wrangling","Exploratory Data Analysis","Machine Learning Basics","Data Science Applications"]),
      ],
      VI: [
        sub("Compiler Design", "22CSC24N", 3,
          ["Lexical Analysis","Syntax Analysis","Semantic Analysis","Intermediate Code Generation","Code Optimization & Generation"], true),
        sub("Artificial Intelligence & Machine Learning", "22CSC50", 4,
          ["Intelligent Agents & Search","Knowledge Representation","Supervised Learning","Unsupervised Learning","Neural Networks & Deep Learning"], true),
        sub("Data Analysis & Visualization", "22CSC52", 3,
          ["Data Wrangling & Cleaning","Statistical Analysis","Visualization Libraries","Dashboard Design","Storytelling with Data"]),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Deep Learning for Computer Vision", "22CSC54", 3,
          ["CNNs & Image Classification","Object Detection Algorithms","Semantic Segmentation","Generative Models (GANs, VAEs)","Transfer Learning & Applications"]),
        sub("Network Security", "22CSC56", 4,
          ["Cryptography Fundamentals","Network Threats & Attacks","Firewalls & Intrusion Detection","Secure Protocols (SSL/TLS, IPSec)","Cyber Laws & Ethics"], true),
      ],
      VIII: [
        sub("Project Part-II", "22CSC39N", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // CIC — CSE (IoT & Cyber Security)
    // ─────────────────────────────────────
    CIC: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Data Structures using C++", "22ITC20N", 3, UNITS.dataStructCpp, true),
      ],
      III: [
        sub("Java Programming", "22ITC02N", 3, UNITS.javaProg, true),
        sub("Discrete Mathematics", "22ITC05N", 3, UNITS.discreteStructures),
        sub("Design & Analysis of Algorithms", "22CSC14N", 3, UNITS.daa, true),
        sub("Database Management Systems", "22CSC11N", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Digital Logic & Computer Architecture", "22ITC01N", 3, UNITS.dlDesign),
        sub("Fundamentals of Cyber Security & Tools", "22CIC01", 2,
          ["Cyber Security Overview","Types of Threats & Attacks","Security Tools & Techniques","Network Security Basics","Ethical & Legal Aspects"]),
      ],
      IV: [
        sub("Principles of IoT & Sensor Protocols", "22CIC02", 4,
          ["IoT Architecture & Ecosystem","Sensors, Actuators & Embedded Systems","IoT Communication Protocols (MQTT, CoAP)","Cloud Integration for IoT","IoT Security Fundamentals"], true),
        sub("Operating Systems & Shell Programming", "22CIC03", 3,
          ["OS Fundamentals & Process Management","CPU Scheduling & Memory Management","File Systems & I/O","Shell Scripting Basics","Bash Automation & Cron"]),
        sub("Computer Networks & Data Protocols", "22CIC04", 3, UNITS.computerNetworks),
        sub("Cryptography Foundations", "22CIC05", 3,
          ["Classical Cryptography","Symmetric Key Encryption","Asymmetric Key Encryption","Hash Functions & Digital Signatures","Public Key Infrastructure"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Blockchain Architecture & Frameworks", "22CIC08", 3,
          ["Blockchain Fundamentals & Consensus","Ethereum & Smart Contracts","DApps Development","Hyperledger & Enterprise Blockchain","Blockchain Security & Use Cases"]),
        sub("Web & Application Security", "22CIC09", 3,
          ["OWASP Top 10 Vulnerabilities","Web Application Attacks","Secure Coding Practices","API Security","Penetration Testing Basics"]),
        sub("Mobile & Wireless Security", "22CIC10", 3,
          ["Mobile Platform Security (Android/iOS)","Wireless Network Threats","Bluetooth & RFID Security","Mobile App Penetration Testing","MDM & Enterprise Security"]),
        sub("Microcontrollers & IoT Interfacing", "22CIC11", 3,
          ["Microcontroller Architecture","GPIO & Serial Interfaces","Sensor Integration","Real-Time OS for IoT","Edge Computing & Prototyping"], true),
      ],
      VI: [
        sub("Ethical Hacking & Penetration Testing", "22CIC15", 3,
          ["Reconnaissance & Footprinting","Scanning & Enumeration","Exploitation Techniques","Post-Exploitation & Reporting","Legal & Ethical Framework"], true),
        sub("Cyber Laws & Digital Forensics", "22CIC16", 4,
          ["Cyber Law Frameworks (IT Act)","Digital Evidence & Chain of Custody","Forensic Investigation Process","Network & Mobile Forensics","Anti-Forensics & Legal Proceedings"]),
        sub("Cloud Security Mechanisms", "22CIC17", 3,
          ["Cloud Computing Review","Cloud Threat Landscape","Identity & Access Management","Data Security in Cloud","Compliance & Governance"], true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Advanced Cryptography & Cyber Defense", "22CIC21", 3,
          ["Post-Quantum Cryptography","Homomorphic Encryption","Zero-Knowledge Proofs","Intrusion Detection & Response","SOC Operations & SIEM"]),
        sub("Software Defined Networks & Security", "22CIC22", 4,
          ["SDN Architecture & OpenFlow","NFV Fundamentals","SDN Security Challenges","Network Slicing","5G Security Overview"]),
      ],
      VIII: [
        sub("Project Part-II", "22CSC39N", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // IT — Information Technology
    // ─────────────────────────────────────
    IT: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Data Structures using C++", "22ITC20N", 3, UNITS.dataStructCpp, true),
      ],
      III: [
        sub("Digital Logic & Computer Architecture", "22ITC01N", 3, UNITS.dlDesign),
        sub("Java Programming", "22ITC02N", 3, UNITS.javaProg, true),
        sub("Discrete Mathematics", "22ITC05N", 3, UNITS.discreteStructures),
        sub("Design & Analysis of Algorithms", "22CSC14N", 3, UNITS.daa),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Database Management Systems", "22ITC06", 3,
          ["ER Model & Relational Model","SQL","Functional Dependencies","Normalization","Transactions & Recovery"], true),
        sub("Operating Systems", "22ITC07", 3, UNITS.operatingSystems),
        sub("Web Technology", "22ITC08", 3,
          ["HTML & CSS Fundamentals","JavaScript & DOM","Client-Side Frameworks","Server-Side Programming","Web Application Security"], true),
        sub("Automata Theory & Compiler Design", "22ITC09", 4,
          ["Finite Automata & Regular Languages","Context-Free Grammars & PDAs","Turing Machines","Lexical & Syntax Analysis","Semantic Analysis & Code Generation"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Computer Networks", "22ITC10N", 3, UNITS.computerNetworks, true),
        sub("Software Engineering", "22ITC14", 3, UNITS.softwareEngineering),
        sub("Object Oriented Analysis & Design", "22ITC15", 3,
          ["OOP Principles","UML Diagrams","Design Patterns","Architectural Styles","Refactoring & Code Quality"]),
        sub("Artificial Intelligence & Data Analytics", "22ITC16", 3,
          ["AI Fundamentals & Search","Knowledge Representation","Data Analytics Overview","ML Algorithms","Data Visualization & Insights"]),
      ],
      VI: [
        sub("Cloud Computing", "22ITC19", 3,
          ["Cloud Fundamentals & Deployment Models","Virtualization","IaaS, PaaS & SaaS","Cloud Storage & Databases","Cloud Security & Case Studies"]),
        sub("Cyber Security & Cryptography", "22ITC22", 4,
          ["Cryptographic Primitives","Symmetric & Asymmetric Encryption","Network Security Protocols","Web & Application Security","Cyber Laws & Forensics"]),
        sub("Mobile Application Development", "22ITC23", 3,
          ["Mobile Platforms Overview","Android Application Development","UI Design for Mobile","Data Storage & APIs","Publishing & Monetization"], true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Internet of Things Architecture", "22ITC27", 3,
          ["IoT Overview & Ecosystem","Sensors, Actuators & Embedded Systems","IoT Communication Protocols","Cloud Integration for IoT","IoT Security & Applications"]),
        sub("Distributed Systems & Architectures", "22ITC28", 4,
          ["Distributed System Models","Communication in DS","Consistency & Replication","Fault Tolerance","Microservices & Cloud-Native Architecture"]),
      ],
      VIII: [
        sub("Project Part-II", "22ITC32", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // ECE — Electronics & Communication
    // ─────────────────────────────────────
    ECE: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Engineering Mechanics", "22MEC02", 3, UNITS.engMechanics),
      ],
      III: [
        sub("Electronic Devices & Circuits", "22ECC01", 4,
          ["Semiconductor Diodes & Applications","BJT Biasing & Amplifiers","FET & MOSFET Amplifiers","Feedback Amplifiers & Oscillators","Power Amplifiers & Rectifiers"], true),
        sub("Digital System Design", "22ECC02", 3,
          ["Number Systems & Boolean Algebra","Combinational Circuit Design","Sequential Circuit Design","HDL Introduction","FPGA Basics"], true),
        sub("Signals & Systems", "22ECC03", 4,
          ["Signals Classification & Operations","LTI Systems & Convolution","Fourier Series & Fourier Transform","Laplace Transform","Z-Transform & Discrete Systems"]),
        sub("Network Analysis & Synthesis", "22ECC04", 3,
          ["Network Theorems & Two-Port Networks","Transient Analysis","Frequency Response","Filter Design Fundamentals","Network Synthesis"]),
        sub("Complex Variables & Fourier Transforms", "22MTC07", 3,
          ["Complex Numbers & Functions","Analytic Functions & Cauchy-Riemann","Complex Integration","Fourier Series","Fourier & Laplace Transforms"]),
      ],
      IV: [
        sub("Analog Integrated Circuits", "22ECC07", 4,
          ["Op-Amp Characteristics & Applications","Linear Op-Amp Circuits","Non-Linear Op-Amp Circuits","Waveform Generators","Special Purpose ICs"], true),
        sub("Electromagnetic Waves & Transmission Lines", "22ECC08", 4,
          ["Maxwell's Equations","Electromagnetic Wave Propagation","Transmission Line Theory","Standing Waves & Impedance Matching","Waveguides"]),
        sub("Analog Communications", "22ECC09", 3,
          ["AM & FM Modulation","Demodulation Techniques","Noise in Communications","Receivers & Superheterodyne","Multiplexing Techniques"]),
        sub("Microprocessors & Microcontrollers", "22ECC10", 3,
          ["8086 Architecture & Programming","Interrupts & DMA","Memory & I/O Interfacing","Microcontroller Architecture","Embedded Applications"], true),
        sub("Numerical Methods & Optimization Techniques", "22MTC11", 3,
          ["Numerical Solutions of Equations","Interpolation & Differentiation","Numerical Integration","ODE Numerical Methods","Optimization Techniques"]),
      ],
      V: [
        sub("Digital Communications", "22ECC13", 4,
          ["Sampling & Quantization","Baseband Pulse Transmission","Digital Modulation (ASK, FSK, PSK)","Error Control Coding","Spread Spectrum Techniques"]),
        sub("Digital Signal Processing", "22ECC14", 4,
          ["Discrete-Time Signals & Systems","DFT & FFT Algorithms","IIR Filter Design","FIR Filter Design","DSP Architectures & Applications"], true),
        sub("Antennas & Wave Propagation", "22ECC15", 3,
          ["Antenna Fundamentals & Parameters","Linear Antennas & Arrays","Aperture Antennas","Ground Wave & Sky Wave Propagation","Microwave Antennas"]),
      ],
      VI: [
        sub("CMOS VLSI Design", "22ECC19", 4,
          ["CMOS Inverter & Logic Gates","Combinational VLSI Design","Sequential VLSI Design","VLSI Physical Design","Low Power Design"]),
        sub("Microwave Engineering & Radar Systems", "22ECC20", 3,
          ["Microwave Transmission Lines","Microwave Components & Devices","Microwave Amplifiers & Oscillators","Radar Fundamentals","Radar Systems & Applications"]),
        sub("Computer Networks", "22ECC21", 3, UNITS.computerNetworks, true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Wireless & Mobile Communications", "22ECC25", 3,
          ["Cellular System Design","Multiple Access Techniques","GSM & CDMA Systems","4G LTE Architecture","5G & Beyond"]),
        sub("Embedded Systems & IoT", "22ECC26", 4,
          ["Embedded System Architecture","RTOS Concepts","Peripheral Interfacing","IoT Protocols & Standards","IoT Application Development"], true),
      ],
      VIII: [
        sub("Project Part-II", "22ECC30", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // EVL — Electronics Engineering (VLSI)
    // ─────────────────────────────────────
    EVL: {
      I: [
        sub("Calculus", "22MTC02", 4,
          ["Differential Calculus","Integral Calculus","Multivariable Calculus","Sequences & Series","Vector Calculus"]),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Problem Solving & Programming using Python", "22CSC40", 3,
          ["Python Basics & Data Types","Control Flow & Functions","Data Structures in Python","OOP in Python","File Handling & Libraries"], true),
      ],
      II: [
        sub("Vector Calculus & Differential Equations", "22MTC05", 4,
          ["Vector Differentiation","Vector Integration","First-Order ODEs","Higher-Order Linear ODEs","Partial Differential Equations"]),
        sub("Electromagnetic Theory & Quantum Mechanics", "22PYC06", 3,
          ["Electrostatics & Magnetostatics","Maxwell's Equations","Electromagnetic Waves","Quantum Mechanics Fundamentals","Wave Functions & Schrödinger Equation"], true),
        sub("Electronic Devices", "22ECC01", 3,
          ["Semiconductor Physics","PN Junction Diodes","BJT Characteristics","FET & MOSFET","Special Semiconductor Devices"]),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      III: [
        sub("Complex Variables & Special Functions", "22MTC19", 3,
          ["Complex Functions & Analytic Functions","Complex Integration","Taylor & Laurent Series","Special Functions","Transform Techniques"]),
        sub("Analog Circuits Analysis", "22EVC01", 3,
          ["Op-Amp Fundamentals","Linear Op-Amp Applications","Non-Linear Op-Amp Circuits","Active Filters","Waveform Generation Circuits"]),
        sub("Digital Electronics", "22EVC02", 3,
          ["Boolean Algebra & Logic Gates","Combinational Circuit Design","Sequential Circuit Design","Counters & Shift Registers","A/D & D/A Converters"]),
        sub("Network Analysis & Synthesis", "22ECC03N", 4,
          ["Network Theorems","Two-Port Network Parameters","Transient Analysis","Frequency Response & Bode Plots","Passive Network Synthesis"]),
        sub("Data Structures using C", "22ITC24", 3,
          ["Arrays & Pointers in C","Linked Lists","Stacks & Queues","Trees & Heaps","Graphs & Sorting Algorithms"], true),
        sub("Signals & Systems", "22ECC04", 3,
          ["Signals Classification & Operations","LTI Systems & Convolution","Fourier Series & Transform","Laplace Transform","Z-Transform"]),
      ],
      IV: [
        sub("Control Systems", "22ECC09", 3,
          ["Mathematical Models of Systems","Time Domain Analysis","Frequency Domain Analysis","Stability Analysis","Control System Design"]),
        sub("Linear Integrated Circuits", "22EVC04", 3,
          ["Op-Amp Characteristics","Differential & Instrumentation Amplifiers","Signal Conditioning Circuits","Voltage Regulators","Timer & PLL Circuits"]),
        sub("Verilog HDL", "22EVC05", 3,
          ["HDL Introduction & Verilog Basics","Gate-Level & Dataflow Modeling","Behavioral Modeling","Testbench Writing","Synthesis & Simulation"], true),
        sub("Digital VLSI Design", "22EVC06", 3,
          ["CMOS Logic Gate Design","Static & Dynamic CMOS","Combinational Circuit VLSI","Sequential Circuit VLSI","VLSI Design Flow"], true),
        sub("Probability Theory & Stochastic Process", "22ECC11", 3, UNITS.probStats),
      ],
      V: [
        sub("Analog VLSI Design", "22EVC10", 4,
          ["MOS Device Characteristics","Single-Stage Amplifiers","Differential Amplifiers","Current Mirrors & References","Feedback & Stability in Analog VLSI"], true),
        sub("Fabrication Technology & Testing", "22EVC11", 4,
          ["CMOS Fabrication Process Steps","Lithography & Etching","Oxidation & Diffusion","VLSI Testing Fundamentals","DFT & ATPG"]),
        sub("Computer Architecture & Parallel Processing", "22EVC12", 3,
          ["Instruction Set Architecture","Pipelining & Hazards","Memory Hierarchy","Multiprocessor Architectures","Parallel Computing Models"]),
      ],
      VI: [
        sub("System Verilog & Functional Verification", "22EVC16", 4,
          ["SystemVerilog Data Types & OOP","Interfaces & Clocking Blocks","Functional Coverage","Constrained Random Verification","UVM Methodology"]),
        sub("Physical Design & EDA Flows", "22EVC17", 3,
          ["Floorplanning & Placement","Clock Tree Synthesis","Routing & DRC/LVS","Static Timing Analysis","Parasitic Extraction & Sign-off"]),
        sub("Microcontrollers & Embedded Systems", "22EVC18", 3,
          ["Microcontroller Architecture","Programming & Interfacing","RTOS Fundamentals","Communication Protocols (UART, SPI, I2C)","Embedded System Design"], true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Low Power VLSI Design", "22EVC22", 3,
          ["Sources of Power Dissipation","Clock Gating & Power Gating","Multi-Vt & Multi-Vdd Design","Low Power Arithmetic Circuits","Power Analysis & Optimization"]),
        sub("Memory Design & Testing Architectures", "22EVC23", 4,
          ["SRAM & DRAM Cell Design","ROM & Flash Memory","Memory Timing & Power","BIST for Memories","Advanced Memory Technologies"]),
      ],
      VIII: [
        sub("Project Part-II", "22EVC27", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // EEE — Electrical & Electronics Engg.
    // ─────────────────────────────────────
    EEE: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Engineering Mechanics", "22MEC02", 3, UNITS.engMechanics),
      ],
      III: [
        sub("Electric Circuits & Networks", "22EEC03", 4,
          ["DC Circuit Analysis & Network Theorems","AC Circuit Analysis","Three-Phase Circuits","Transient Analysis","Two-Port Networks"]),
        sub("Electromagnetic Fields", "22EEC04", 3,
          ["Electrostatics & Electric Field","Electric Potential & Capacitance","Magnetostatics & Magnetic Field","Faraday's Law & Induction","Maxwell's Equations"]),
        sub("Electrical Machines-I", "22EEC05", 4,
          ["DC Generator Principles","DC Motor Characteristics","Transformer Construction & Theory","Transformer Testing","Three-Phase Transformers"], true),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
        sub("Signals & Systems", "22EEC06", 3,
          ["Signals Classification & Operations","LTI Systems & Convolution","Fourier Series & Transform","Laplace Transform","Z-Transform"]),
      ],
      IV: [
        sub("Electrical Machines-II", "22EEC08", 4,
          ["Three-Phase Induction Motor Theory","Induction Motor Starting & Speed Control","Synchronous Generator","Synchronous Motor","Special Machines"], true),
        sub("Power Systems-I", "22EEC09", 3,
          ["Power System Structure","Transmission Line Parameters","Transmission Line Modeling","Power Flow Analysis","Fault Analysis Basics"]),
        sub("Control Systems Engineering", "22EEC10", 3,
          ["Mathematical Models of Systems","Time Domain Analysis","Root Locus Technique","Frequency Domain Analysis","Control System Design"]),
        sub("Data Structures using C", "22ITC22N", 3,
          ["Arrays & Pointers in C","Linked Lists","Stacks & Queues","Trees & Heaps","Graphs & Sorting Algorithms"], true),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Power Systems-II", "22EEC13", 4,
          ["Load Flow Studies","Short Circuit Analysis","Power System Stability","Economic Load Dispatch","HVDC Transmission"]),
        sub("Power Electronics", "22EEC14", 4,
          ["Power Semiconductor Devices","AC-DC Converters (Rectifiers)","DC-DC Converters","DC-AC Inverters","AC Voltage Controllers"], true),
        sub("Electrical Measurements & Instrumentation", "22EEC15", 3,
          ["Measurement Basics & Standards","Analog & Digital Instruments","Bridges & Potentiometers","Transducers & Sensors","Data Acquisition Systems"]),
      ],
      VI: [
        sub("Power System Protection & Switchgear", "22EEC19", 4,
          ["Protective Relays & Relay Coordination","Overcurrent & Distance Protection","Differential Protection","Circuit Breakers","Switchgear & Substation Equipment"]),
        sub("Renewable Energy Sources & Grids", "22EEC20", 3,
          ["Solar PV Systems","Wind Energy Systems","Hydro & Biomass Energy","Smart Grid Concepts","Energy Storage Systems"]),
        sub("Microprocessors & Microcontrollers", "22EEC21", 3,
          ["8086 Architecture & Programming","Interrupts & DMA","Memory & I/O Interfacing","Microcontroller Architecture","Embedded Applications"], true),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Electrical Drives & Control", "22EEC25", 3,
          ["DC Drive Fundamentals","DC Drive Control Systems","Induction Motor Drive Control","Synchronous Motor Drives","Modern Drive Applications"]),
        sub("Digital Signal Processing Applications", "22EEC26", 4,
          ["Discrete-Time Signals & Systems","DFT & FFT","IIR Filter Design","FIR Filter Design","DSP Applications in Power Systems"]),
      ],
      VIII: [
        sub("Project Part-II", "22EEC30", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // MECHANICAL — Mechanical Engineering
    // ─────────────────────────────────────
    MECHANICAL: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Engineering Mechanics", "22MEC02", 3, UNITS.engMechanics),
      ],
      III: [
        sub("Metallurgy & Material Science", "22MEC03", 3,
          ["Structure of Metals and Plastic Deformation","Phase Diagrams and Equilibrium Diagrams","Iron-Iron Carbide Equilibrium Diagram","Heat Treatment of Steels and Alloying Elements","Non-Ferrous Metals, Polymers and Composites"]),
        sub("Mechanics of Materials", "22MEC04", 4,
          ["Simple Stresses and Strains","Shear Force and Bending Moment Diagrams","Bending and Shear Stresses in Beams","Deflection of Beams and Torsion of Shafts","Thin and Thick Cylinders and Columns"]),
        sub("Thermodynamics", "22MEC05", 4,
          ["Fundamental Concepts and Zeroth Law of Thermodynamics","First Law of Thermodynamics and Flow Processes","Second Law of Thermodynamics and Entropy","Pure Substances and Thermodynamic Property Relations","Gas Power Cycles and Air Standard Cycles"]),
        sub("Manufacturing Processes", "22MEC06", 3,
          ["Casting Processes and Pattern Design","Gating Systems, Melting Furnace and Casting Defects","Welding and Joining Processes","Metal Forming and Bulk Deformation Processes","Sheet Metal Operations and Powder Metallurgy"], true),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Applied Thermodynamics", "22MEC09", 4,
          ["Air Compressors (Reciprocating and Rotary)","Internal Combustion Engines (Systems and Performance)","Steam Nozzles and Steam Turbines","Gas Turbines and Jet Propulsion","Refrigeration and Air Conditioning Systems"]),
        sub("Fluid Mechanics & Hydraulic Machinery", "22MEC10", 4,
          ["Fluid Properties and Fluid Statics","Fluid Kinematics and Fluid Dynamics","Boundary Layer Theory and Pipe Flow Systems","Impact of Jets and Hydraulic Turbines","Centrifugal Pumps and Reciprocating Pumps"], true),
        sub("Kinematics of Machinery", "22MEC11", 3,
          ["Mechanisms and Simple Kinematic Chains","Velocity Analysis of Mechanisms","Acceleration Analysis of Mechanisms","Cams and Followers Profiles","Gears and Gear Trains Configurations"]),
        sub("Machine Drawing & Computer Aided Drafting", "22MEC12", 3,
          ["Introduction to Machine Drawing and Conventions","Sectional Views, Keys, Cotters and Pin Joints","Screw Threads, Riveted Joints and Welded Joints","Assembly Drawings of Machine Parts - I","Assembly Drawings of Machine Parts - II"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Dynamics of Machinery", "22MEC15", 4,
          ["Static and Dynamic Force Analysis of Mechanisms","Turning Moment Diagrams and Flywheels","Balancing of Rotating and Reciprocating Masses","Governors (Mechanical and Centrifugal)","Gyroscopic Effects and Mechanical Vibrations"]),
        sub("Heat Transfer", "22MEC16", 4,
          ["Modes of Heat Transfer and Steady State Heat Conduction","Transient Conduction and Extended Surfaces (Fins)","Convective Heat Transfer (Free and Forced)","Radiation Heat Transfer and Shape Factors","Heat Exchangers (LMTD, NTU methods) and Mass Transfer"]),
        sub("Design of Machine Elements", "22MEC17", 3,
          ["Design Considerations, Materials and Mechanical Properties","Design for Static Strengths and Stress Concentration Factors","Design for Fatigue Strengths and Variable Loading","Design of Shafts, Keys and Couplings","Design of Permanent and Temporary Joints"]),
      ],
      VI: [
        sub("Design of Transmission Systems", "22MEC21", 4,
          ["Design of Flexible Elements (Belts, Ropes and Chains)","Design of Spur Gears and Helical Gears","Design of Bevel Gears and Worm Gears","Design of Bearings (Sliding Contact and Rolling Contact)","Design of Clutches, Brakes and IC Engine Components"]),
        sub("Machining & Machine Tools", "22MEC22", 3,
          ["Theory of Metal Cutting and Tool Life","Lathe Machines and Boring Operations","Shaper, Slotter, Planer and Drilling Machines","Milling, Grinding and Superfinishing Machine Tools","Unconventional Machining Processes (EDM, ECM, USM)"]),
        sub("Operations Research", "22MEC23", 3,
          ["Linear Programming Formulations and Simplex Method","Transportation and Assignment Problems Optimization","Network Models (PERT/CPM Schedulers)","Sequencing Models and Queuing Systems Analytics","Game Theory and Dynamic Programming"]),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("CAD/CAM & Automation", "22MEC27", 3,
          ["Computer Graphics, Geometric Modeling and CAD Hardware","NC, CNC and DNC Systems Architecture","CNC Part Programming (G-Codes and M-Codes)","Group Technology and Flexible Manufacturing Systems (FMS)","Industrial Robotics and Factory Automation Systems"]),
        sub("Automobile Engineering", "22MEC28", 4,
          ["Vehicle Classification, Engine Components and Chassis Systems","Fuel Supply Systems (SI and CI Engines) and Lubrication","Cooling Systems, Ignition Systems and Electrical Subsystems","Transmission Systems, Steering Mechanisms and Brakes","Suspension Systems, Emissions Control and Electric Vehicles"]),
      ],
      VIII: [
        sub("Project Part-II", "22MEC32", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // CIVIL — Civil Engineering
    // ─────────────────────────────────────
    CIVIL: {
      I: [
        sub("Linear Algebra & Calculus", "22MTC01", 4, UNITS.linearAlgebra),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Differential Equations & Numerical Methods", "22MTC04", 4, UNITS.diffEqNumerical),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Engineering Mechanics", "22MEC02", 3, UNITS.engMechanics),
      ],
      III: [
        sub("Strength of Materials-I", "22CEC01", 4,
          ["Simple Stresses and Strains","Shear Force and Bending Moment Diagrams","Bending Stresses in Beams","Shear Stresses in Beams","Torsion of Circular Shafts and Springs"]),
        sub("Fluid Mechanics", "22CEC02", 4,
          ["Fluid Properties and Fluid Statics","Fluid Kinematics and Dynamics","Flow Measurement and Fluid Flows in Pipes","Laminar and Turbulent Flows","Boundary Layer Theory and Drag/Lift Concepts"], true),
        sub("Surveying & Geomatics", "22CEC03", 3,
          ["Fundamental Surveying, Chain and Compass Surveying","Levelling and Contour Mapping","Theodolite Surveying and Trigonometric Levelling","Tacheometric Surveying and Curve Setting","Advanced Surveying, Total Station, GPS and Photogrammetry"], true),
        sub("Engineering Geology", "22CEC04", 3,
          ["Physical Geology and Mineralogy","Petrology (Igneous, Sedimentary, and Metamorphic Rocks)","Structural Geology (Folds, Faults, and Joints)","Rock Mechanics and Geophysical Exploration Methods","Geological Hazards, Dam and Tunnel Site Investigations"]),
        sub("Basic Electronics & Sensors", "22ECC36", 3, UNITS.basicElecSensors, true),
      ],
      IV: [
        sub("Strength of Materials-II", "22CEC07", 4,
          ["Principal Stresses and Strains","Deflection of Beams (Analytical and Graphical Methods)","Columns and Struts (Euler's and Rankine's Theories)","Thin and Thick Cylinders","Direct and Bending Stresses, Unsymmetrical Bending"]),
        sub("Hydraulic Machinery & Water Resources", "22CEC08", 4,
          ["Impact of Jets and Hydro-Turbine Principles","Performance of Hydraulic Turbines and Pumps","Hydrology, Precipitation and Runoff Formulations","Hydrographs, Flood Routing and Ground Water Hydrology","Irrigation Requirements, Canals and Water Distribution Networks"]),
        sub("Structural Analysis-I", "22CEC09", 3,
          ["Propped Cantilevers and Fixed Beams","Continuous Beams and Theorem of Three Moments","Energy Theorems and Deflection Computations","Moving Loads and Influence Lines for Beams","Analysis of Static Indeterminate Pin-Jointed Frames"]),
        sub("Concrete Technology", "22CEC10", 3,
          ["Cement Types, Aggregate Classifications and Water Quality","Admixtures, Fresh Concrete Properties and Workability","Hardened Concrete Properties, Strength Tests and Durability","Mix Design Layouts (IS and ACI Standard Methods)","Special Concretes and Non-Destructive Testing (NDT)"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Structural Analysis-II", "22CEC13", 4,
          ["Slope Deflection Method for Frames and Continuous Beams","Moment Distribution Method (Sway and Non-Sway Cases)","Kani's Method of Structural Analysis","Approximate Methods of Structural Analysis","Matrix Flexibility and Stiffness Methods Baselines"]),
        sub("Design of Reinforced Concrete Structures", "22CEC14", 4,
          ["Design Philosophies, Working Stress and Limit State Principles","Limit State Design for Flexure (Singly and Doubly Reinforced)","Limit State Design for Shear, Torsion and Bond Mechanics","Design of Reinforced Concrete One-Way and Two-Way Slabs","Design of Short Columns and Axially Loaded Footings"]),
        sub("Geotechnical Engineering", "22CEC15", 3,
          ["Soil Index Properties, Classifications and Phase Relations","Permeability, Seepage Analysis and Flow Nets Matrix","Soil Compaction Mechanics and One-Dimensional Consolidation","Shear Strength Properties of Soil and Failure Theories","Soil Exploration Patterns and Field Testing Techniques"], true),
      ],
      VI: [
        sub("Design of Steel Structures", "22CEC19", 4,
          ["Design Philosophies, Plastic Analysis and Bolted Connections","Design of Welded Connections and Tension Members","Design of Compression Members and Built-up Columns","Design of Column Bases and Gusseted Foundations","Design of Flexural Members (Beams and Plate Girders)"]),
        sub("Transportation Engineering", "22CEC20", 3,
          ["Highway Planning, Geometric Design and Cross-Sections","Traffic Engineering, Intersections and Design Controls","Pavement Material Characterizations and Structural Design","Railway Track Engineering, Geometrics and Signaling","Airport Planning, Runway Layouts and Harbors Basics"]),
        sub("Environmental Engineering", "22CEC21", 3,
          ["Water Demands, Sourcing and Water Quality Metrics","Water Treatment Operations (Sedimentation, Filtration, Disinfection)","Sewage Configurations, Characteristics and Drainage Layouts","Wastewater Treatment Systems (Activated Sludge, Trickling Filters)","Air and Noise Pollution Engineering, Solid Waste Metrics"]),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Estimation, Costing & Project Management", "22CEC25", 3,
          ["Types of Estimates, Detailed Estimation of Buildings","Earthwork Estimations, Rate Analysis Constants and Specifications","Contracts, Tenders and Valuations of Properties","Project Management Networks (PERT and CPM Systems)","Resource Schedulers, Cost Optimization and Project Crashing"]),
        sub("Foundation Engineering", "22CEC26", 4,
          ["Earth Pressure Theories (Rankine and Coulomb Models)","Stability Analysis of Slopes (Infinite and Finite Slopes)","Bearing Capacity of Shallow Foundations and Settlement Analysis","Pile Foundations, Group Efficiency and Capacity Estimations","Well Foundations, Caissons and Expansive Soils Treatments"]),
      ],
      VIII: [
        sub("Project Part-II", "22CEC30", 4, []),
      ],
    },

    // ─────────────────────────────────────
    // BIOTECH — Biotechnology
    // ─────────────────────────────────────
    BIOTECH: {
      I: [
        sub("Mathematics-I / Basics of Biology-I", "22MTC03/22BTC01N", 4,
          ["Sequences and Series","Calculus of One Variable (Differentiation)","Integral Calculus and Applications","Matrices and Determinants","Eigenvalues, Eigenvectors and Quadratic Forms"]),
        sub("Chemistry", "22CYC01", 3, UNITS.chemistry, true),
        sub("Problem Solving & Programming using C", "22CSC01N", 3, UNITS.cProgramming, true),
        sub("English", "22EGC01N", 2, UNITS.english),
        sub("Engineering Graphics", "22MEC01N", 2.5,
          ["Drawing Fundamentals","Orthographic Projections","Isometric Views","Section of Solids","Development of Surfaces"]),
      ],
      II: [
        sub("Mathematics-II / Basics of Biology-II", "22MTC06/22BTC02N", 4,
          ["Vector Differentiation","Vector Integration","First-Order Ordinary Differential Equations","Higher-Order Linear Ordinary Differential Equations","Partial Differential Equations"]),
        sub("Optics & Semiconductor Physics", "22PYC01", 3, UNITS.opticsSemi, true),
        sub("Basic Electrical Engineering", "22EEC01", 3, UNITS.basicEE, true),
        sub("Engineering Mechanics", "22MEC02", 3, UNITS.engMechanics),
      ],
      III: [
        sub("Process Calculation & Reaction Engineering", "22BTC03", 3,
          ["Material Balances without Chemical Reactions","Material Balances with Chemical Reactions","Energy Balances and Thermochemistry","Kinetics of Homogeneous Chemical Reactions","Interpretation of Batch Reactor Data and Ideal Reactor Design"]),
        sub("Biochemistry", "22BTC04", 3,
          ["Carbohydrates and Lipids: Structures and Properties","Amino Acids, Peptides and Proteins Conformations","Nucleic Acids Structures and Bioenergetics Principles","Intermediary Metabolism and Carbohydrate Pathways","Lipid, Amino Acid and Nucleotide Metabolism"], true),
        sub("Microbiology", "22BTC05", 3,
          ["History of Microbiology and Diversity of Microorganisms","Microbial Morphology, Isolation and Culturing Techniques","Nutritional Requirements and Microbial Growth Dynamics","Control of Microorganisms (Physical and Chemical Methods)","Industrial and Medical Microbiology Applications"], true),
        sub("Cell & Molecular Biology", "22BTC06", 3,
          ["Cell Structure, Organelles and Membrane Transport","Signal Transduction and Cell Cycle Regulation","DNA Replication and Repair Mechanisms","Transcription and RNA Processing Mechanisms","Translation and Regulation of Gene Expression"], true),
        sub("Genetics", "22BTC07", 3,
          ["Mendelian Principles and Extensions of Mendelian Inheritance","Chromosomal Basis of Inheritance, Linkage and Mapping","Gene Mutations, DNA Repair and Transposable Elements","Bacterial Genetics and Viral Replication Cycles","Quantitative Genetics and Population Genetics"]),
      ],
      IV: [
        sub("Fluid Mechanics & Heat Transfer", "22BTC10", 4,
          ["Fluid Statics, Dynamics and Flow Measurement","Flow of Incompressible Fluids in Pipes and Boundary Layer","Mixing and Agitation Systems for Bioprocess Fluids","Conduction and Convective Heat Transfer Principles","Radiation, Boiling, Condensation and Design of Heat Exchangers"], true),
        sub("Bioprocess Engineering Principles", "22BTC11", 4,
          ["Introduction to Bioprocesses and Media Optimization","Sterilization Principles (Media and Air Sterilization)","Enzyme Kinetics and Immobilized Enzyme Systems","Cell Growth Kinetics and Stoichiometry of Bioprocesses","Bioreactor Operating Configurations (Batch, Fed-batch, Continuous)"], true),
        sub("Enzyme Technology", "22BTC12", 3,
          ["Classification, Extraction and Purification of Enzymes","Mechanics of Enzyme Action and Catalysis","Enzyme Kinetics and Inhibition Models","Methods and Kinetics of Enzyme Immobilization","Industrial and Medical Applications of Enzymes"], true),
        sub("Instrumental Methods of Analysis", "22BTC13", 3,
          ["UV-Visible and Infrared Spectroscopy","NMR Spectroscopy and Mass Spectrometry","Chromatographic Separation Techniques (TLC, GC, HPLC)","Electrophoresis and Centrifugation Analytical Methods","X-ray Diffraction and Microscopic Analysis (SEM, TEM)"]),
        sub("Probability & Statistics", "22MTC12", 4, UNITS.probStats),
      ],
      V: [
        sub("Bioprocess Reaction Engineering", "22BTC16", 4,
          ["Gas-Liquid Mass Transfer in Bioprocess Systems (kLa evaluations)","Bioreactor Scale-up Criteria and Sizing","Non-Ideal Flow and RTD Analytics in Bioreactors","Sintered Material and Heterogeneous Catalysis Systems","Sizing and Performance of Multi-Reactor Systems"]),
        sub("Molecular Pathogenesis & Immunology", "22BTC17", 4,
          ["Cells and Organs of the Immune System","Antigens, Antibodies and Antigen-Antibody Interactions","MHC Molecules, Antigen Presentation and T-Cell Activation","Effector Mechanisms of Immune Response and Hypersensitivity","Host-Pathogen Interactions and Molecular Pathogenesis Mechanisms"], true),
        sub("Genetic Engineering Principles", "22BTC18", 3,
          ["Tools of Genetic Engineering (Restriction Enzymes and Cloning Vectors)","Construction of Genomic and cDNA Libraries","DNA Sequencing, PCR and Hybridization Profiling","Expression of Heterologous Genes in E.coli and Yeast Systems","Applications and Bio-safety Guidelines of Recombinant DNA Technology"], true),
      ],
      VI: [
        sub("Downstream Processing & Bioseparations", "22BTC22", 4,
          ["Primary Separation Operations (Cell Disruption, Filtration, Centrifugation)","Enrichment Operations (Precipitation, Liquid-Liquid Extraction)","Membrane-Based Bioseparations (Ultrafiltration, Microfiltration, Dialysis)","High-Resolution Chromatography Systems (Affinity, Ion-Exchange, Gel)","Product Finishing Operations (Crystallization, Drying, Lyophilization)"], true),
        sub("Plant & Animal Biotechnology", "22BTC23", 3,
          ["Plant Tissue Culture Foundations and Micropropagation","Production of Transgenic Plants and Crop Improvement Schemes","Animal Cell Culture Infrastructure, Media and Cell Lines","Transgenic Animal Technology and Gene Targeting Strategies","Industrial Production of Biopharmaceuticals via Cell Systems"]),
        sub("Bioinformatics & Computational Biology", "22BTC24", 3,
          ["Biological Repositories and Primary Database Architecture","Sequence Alignment Methods (Pairwise, Multiple, BLAST Matrix)","Molecular Phylogenetics and Structural Tree Configurations","Structural Bioinformatics and Protein Modeling Frameworks","Functional Genomics, Proteomics Analytics and Computer-Aided Drug Design"]),
        sub("Engineering Economics & Accountancy", "22MBC01", 3, UNITS.engEcoAcc),
      ],
      VII: [
        sub("Bioprocess Plant Design & Economics", "22BTC28", 3,
          ["Bioprocess Plant Layout, Safety and Piping Standards","Design and Sizing of Fermentation Vessel Infrastructure","Sizing of Auxiliary Equipment (Utilities, Sterile Utilities)","Cost Sizing Schedulers, Capital Invest Estimates and Economics","Depreciation Models, Profitability Metrics and Plant Optimization"]),
        sub("Food & Pharmaceutical Biotechnology", "22BTC29", 4,
          ["Food Spoilage Parameters and Biochemical Preservation","Fermented Food Production Systems and Industrial Bioproducts","Drug Discovery Pathways and Pharmacokinetic Baselines","Industrial Production of Vaccines, Antibiotics and Biosimilars","Regulatory Affairs, Regulatory Frameworks (FDA, EMA) and GMP Guidelines"]),
      ],
      VIII: [
        sub("Project Part-II", "22BTC33", 4, []),
      ],
    },

  }, // end R22A

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
