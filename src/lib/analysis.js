export const SKILL_CATALOG = {
  "Core CS": [
    { name: "DSA", regex: /\b(dsa|data structures?|algorithms?)\b/i },
    { name: "OOP", regex: /\b(oop|object[-\s]?oriented)\b/i },
    { name: "DBMS", regex: /\b(dbms|database management)\b/i },
    { name: "OS", regex: /\b(os|operating systems?)\b/i },
    { name: "Networks", regex: /\b(networks?|computer networks?)\b/i }
  ],
  Languages: [
    { name: "Java", regex: /\bjava\b/i },
    { name: "Python", regex: /\bpython\b/i },
    { name: "JavaScript", regex: /\bjavascript\b/i },
    { name: "TypeScript", regex: /\btypescript\b/i },
    { name: "C", regex: /(^|\W)c(\W|$)/i },
    { name: "C++", regex: /\bc\+\+\b/i },
    { name: "C#", regex: /\bc#\b/i },
    { name: "Go", regex: /\bgo(lang)?\b/i }
  ],
  Web: [
    { name: "React", regex: /\breact\b/i },
    { name: "Next.js", regex: /\bnext(\.js)?\b/i },
    { name: "Node.js", regex: /\bnode(\.js)?\b/i },
    { name: "Express", regex: /\bexpress\b/i },
    { name: "REST", regex: /\brest(ful)?\b/i },
    { name: "GraphQL", regex: /\bgraphql\b/i }
  ],
  Data: [
    { name: "SQL", regex: /\bsql\b/i },
    { name: "MongoDB", regex: /\bmongodb\b/i },
    { name: "PostgreSQL", regex: /\bpostgres(ql)?\b/i },
    { name: "MySQL", regex: /\bmysql\b/i },
    { name: "Redis", regex: /\bredis\b/i }
  ],
  "Cloud/DevOps": [
    { name: "AWS", regex: /\baws\b/i },
    { name: "Azure", regex: /\bazure\b/i },
    { name: "GCP", regex: /\bgcp\b|google cloud/i },
    { name: "Docker", regex: /\bdocker\b/i },
    { name: "Kubernetes", regex: /\bkubernetes\b|\bk8s\b/i },
    { name: "CI/CD", regex: /\bci\/?cd\b|continuous integration|continuous deployment/i },
    { name: "Linux", regex: /\blinux\b/i }
  ],
  Testing: [
    { name: "Selenium", regex: /\bselenium\b/i },
    { name: "Cypress", regex: /\bcypress\b/i },
    { name: "Playwright", regex: /\bplaywright\b/i },
    { name: "JUnit", regex: /\bjunit\b/i },
    { name: "PyTest", regex: /\bpytest\b/i }
  ]
};

function flattenSkills(extractedSkills) {
  return Object.values(extractedSkills).flat();
}

function hasAny(extractedSkills, values) {
  const set = new Set(flattenSkills(extractedSkills).map((item) => item.toLowerCase()));
  return values.some((value) => set.has(value.toLowerCase()));
}

function unique(list) {
  return [...new Set(list)];
}

export function extractSkills(jdText) {
  const text = jdText || "";
  const extracted = {};

  Object.entries(SKILL_CATALOG).forEach(([category, skills]) => {
    const found = skills.filter((skill) => skill.regex.test(text)).map((skill) => skill.name);
    if (found.length > 0) {
      extracted[category] = unique(found);
    }
  });

  if (Object.keys(extracted).length === 0) {
    return { "General": ["General fresher stack"] };
  }

  return extracted;
}

function withMinimum(items, fallbackItems, min = 5, max = 8) {
  const merged = unique([...items, ...fallbackItems]);
  return merged.slice(0, Math.min(Math.max(min, merged.length), max));
}

export function buildChecklist(extractedSkills) {
  const hasReact = hasAny(extractedSkills, ["React", "Next.js"]);
  const hasBackend = hasAny(extractedSkills, ["Node.js", "Express", "REST", "GraphQL"]);
  const hasData = hasAny(extractedSkills, ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"]);
  const hasCloud = hasAny(extractedSkills, ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"]);
  const hasTesting = hasAny(extractedSkills, ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"]);

  const round1 = withMinimum(
    [
      "Refresh percentages, ratios, speed-distance, and probability basics.",
      "Revise time and space complexity fundamentals.",
      "Practice 20 aptitude questions with a timer.",
      "Review language syntax and standard library basics.",
      hasData ? "Revise SQL joins and basic query writing." : "Revise basic database concepts and normalization.",
      "Prepare concise self-introduction in under 90 seconds."
    ],
    ["Create a one-page formula and concepts revision sheet."]
  );

  const round2 = withMinimum(
    [
      "Solve 8 DSA problems covering arrays, strings, and hash maps.",
      "Practice 2 medium-level recursion/backtracking problems.",
      "Revise OOP principles with practical examples.",
      "Review DBMS transactions, indexing, and normalization.",
      "Review OS process/thread scheduling and deadlock basics.",
      "Review network layers, HTTP, and TCP vs UDP differences."
    ],
    ["Write approach-first solutions before coding to improve clarity."]
  );

  const round3 = withMinimum(
    [
      "Prepare project walkthrough using problem -> approach -> trade-offs -> impact.",
      hasReact ? "Revise React component lifecycle, hooks, and state handling decisions." : "Prepare frontend architecture explanation for your project.",
      hasBackend ? "Revise API design, status codes, validation, and error handling." : "Prepare backend/service layer explanation from one project.",
      hasData ? "Review schema design and query optimization decisions from projects." : "Document how your project stores and retrieves data.",
      hasCloud ? "Explain deployment flow, environments, and release strategy." : "Prepare how you would deploy your project in production.",
      hasTesting ? "Prepare examples of unit/integration/e2e testing strategy." : "Prepare how you validated quality and prevented regressions."
    ],
    ["Build a 5-minute technical project narrative with diagrams."]
  );

  const round4 = withMinimum(
    [
      "Prepare STAR format stories for challenge, conflict, and recovery.",
      "Prepare role fit answer: why this role, why this company.",
      "Draft salary/location/notice-period responses professionally.",
      "Prepare teamwork and ownership examples with measurable outcomes.",
      "List 5 thoughtful questions to ask interviewers.",
      "Practice calm closing statement and next-steps follow-up."
    ],
    ["Record and review one mock HR round for clarity and tone."]
  );

  return {
    "Round 1: Aptitude / Basics": round1,
    "Round 2: DSA + Core CS": round2,
    "Round 3: Tech interview (projects + stack)": round3,
    "Round 4: Managerial / HR": round4
  };
}

export function buildSevenDayPlan(extractedSkills) {
  const hasReact = hasAny(extractedSkills, ["React", "Next.js"]);
  const hasBackend = hasAny(extractedSkills, ["Node.js", "Express", "REST", "GraphQL"]);
  const hasData = hasAny(extractedSkills, ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"]);
  const hasCloud = hasAny(extractedSkills, ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"]);

  return [
    { day: "Day 1", focus: "Basics + Core CS", tasks: ["Refresh OOP, DBMS, OS, and Networks quick notes.", "Solve 15 aptitude questions with a timer."] },
    { day: "Day 2", focus: "Basics + Core CS", tasks: ["Revise complexity analysis and problem solving templates.", hasData ? "Practice SQL joins, indexing, and query tuning basics." : "Review database schema basics and normalization."] },
    { day: "Day 3", focus: "DSA + Coding Practice", tasks: ["Solve 4 array/string/hashmap problems.", "Practice one timed coding round (45-60 min)."] },
    { day: "Day 4", focus: "DSA + Coding Practice", tasks: ["Solve recursion/DP or tree/graph problems based on weak areas.", "Write clean explanations for two solved problems."] },
    { day: "Day 5", focus: "Project + Resume Alignment", tasks: [hasReact ? "Revise frontend architecture and state strategy from your React project." : "Prepare frontend or UI architecture explanation from your project.", hasBackend ? "Map backend API decisions to resume bullet points." : "Map implementation decisions and outcomes to resume bullets."] },
    { day: "Day 6", focus: "Mock Interview Questions", tasks: ["Run one technical mock interview and one HR mock.", hasCloud ? "Explain deployment and monitoring decisions for your stack." : "Prepare system reliability and rollout conversation points."] },
    { day: "Day 7", focus: "Revision + Weak Areas", tasks: ["Revisit incorrect mock answers and patch weak topics.", hasData || hasBackend ? "Quick revision: API/database optimization talking points." : "Quick revision: problem-solving frameworks and communication clarity."] }
  ];
}

const questionBank = {
  DSA: [
    "How would you optimize search in sorted data and why?",
    "When would you choose a heap over quicksort in production code?"
  ],
  OOP: [
    "How do encapsulation and abstraction improve maintainability in a large codebase?"
  ],
  DBMS: [
    "Explain normalization trade-offs and when denormalization is acceptable."
  ],
  OS: [
    "What is the difference between process and thread isolation in modern OS design?"
  ],
  Networks: [
    "How do retries and timeouts interact with TCP behavior under packet loss?"
  ],
  Java: [
    "How does Java memory management impact long-running backend services?"
  ],
  Python: [
    "Where does Python's GIL affect performance, and how would you mitigate it?"
  ],
  JavaScript: [
    "How does the event loop schedule microtasks vs macrotasks in JavaScript?"
  ],
  TypeScript: [
    "How would you design safe API response types using discriminated unions?"
  ],
  "Node.js": [
    "How would you prevent event-loop blocking in a high-throughput Node.js service?"
  ],
  React: [
    "Explain state management options in React and when you would choose each.",
    "How do you reduce unnecessary re-renders in a React dashboard?"
  ],
  "Next.js": [
    "When would you use SSR vs SSG in Next.js for a placement platform?"
  ],
  REST: [
    "How do you version REST APIs without breaking existing clients?"
  ],
  GraphQL: [
    "How do you prevent over-fetching and N+1 issues in GraphQL resolvers?"
  ],
  SQL: [
    "Explain indexing and when it helps query performance.",
    "How would you analyze and optimize a slow SQL query?"
  ],
  MongoDB: [
    "When do you model data in embedded documents vs references in MongoDB?"
  ],
  PostgreSQL: [
    "What PostgreSQL features would you use for transactional consistency at scale?"
  ],
  MySQL: [
    "How do MySQL indexing choices affect write-heavy workloads?"
  ],
  Redis: [
    "Where should Redis be used as cache vs primary data store?"
  ],
  AWS: [
    "How would you design a cost-aware deployment on AWS for this platform?"
  ],
  Azure: [
    "Which Azure services would you pick for CI/CD and why?"
  ],
  GCP: [
    "How would you set up autoscaling and logging on GCP?"
  ],
  Docker: [
    "How do you optimize Docker image size and startup time?"
  ],
  Kubernetes: [
    "How would you investigate repeated pod restarts in Kubernetes?"
  ],
  "CI/CD": [
    "How would you design CI/CD gates to reduce production regressions?"
  ],
  Linux: [
    "Which Linux observability commands help diagnose CPU and memory spikes quickly?"
  ],
  Selenium: [
    "How do you decide what to automate with Selenium vs leave for manual testing?"
  ],
  Cypress: [
    "How would you stabilize flaky Cypress tests in CI?"
  ],
  Playwright: [
    "How does Playwright improve cross-browser reliability for UI tests?"
  ],
  JUnit: [
    "How would you structure JUnit tests for service and repository layers?"
  ],
  PyTest: [
    "How do fixtures in PyTest improve readability and reuse in test suites?"
  ],
  General: [
    "How would you break down an unfamiliar problem statement before coding?",
    "Describe one project where you handled ambiguity and still shipped on time.",
    "How do you prioritize bugs when both severity and customer impact differ?"
  ]
};

export function buildLikelyQuestions(extractedSkills) {
  const detectedSkills = flattenSkills(extractedSkills);
  const questions = [];

  detectedSkills.forEach((skill) => {
    (questionBank[skill] || []).forEach((q) => {
      if (questions.length < 10) {
        questions.push(q);
      }
    });
  });

  questionBank.General.forEach((q) => {
    if (questions.length < 10) {
      questions.push(q);
    }
  });

  return unique(questions).slice(0, 10);
}

export function calculateReadinessScore({ extractedSkills, company, role, jdText }) {
  const categoryCount = Math.min(6, Object.keys(extractedSkills).filter((key) => key !== "General").length);
  const categoryScore = Math.min(categoryCount * 5, 30);
  const companyScore = company?.trim() ? 10 : 0;
  const roleScore = role?.trim() ? 10 : 0;
  const jdLengthScore = (jdText || "").trim().length > 800 ? 10 : 0;

  return Math.min(100, 35 + categoryScore + companyScore + roleScore + jdLengthScore);
}

export function createAnalysisPayload({ company, role, jdText }) {
  const extractedSkills = extractSkills(jdText);
  const checklist = buildChecklist(extractedSkills);
  const plan = buildSevenDayPlan(extractedSkills);
  const questions = buildLikelyQuestions(extractedSkills);
  const readinessScore = calculateReadinessScore({ extractedSkills, company, role, jdText });

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    company: company?.trim() || "Unknown Company",
    role: role?.trim() || "Unspecified Role",
    jdText,
    extractedSkills,
    plan,
    checklist,
    questions,
    readinessScore
  };
}
