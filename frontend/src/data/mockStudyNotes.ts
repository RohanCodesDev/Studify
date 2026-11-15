export interface NoteContent {
  oneMark: {
    definition: string;
    keyRule: string;
    quickFact: string;
  };
  fiveMarks: {
    leadDefinition: string;
    corePrinciples: string[];
    diagramLabel: string;
    diagramContent: string;
    academicExample: {
      title: string;
      description: string;
    };
    sourceCitation: string;
  };
  fifteenMarks: {
    theoreticalFoundation: string;
    formalDefinitions: {
      term: string;
      explanation: string;
    }[];
    stepByStepDecomposition: {
      step: number;
      title: string;
      detail: string;
    }[];
    comparisonTable: {
      headers: [string, string, string];
      rows: [string, string, string][];
    };
    diagramLabel: string;
    diagramContent: string;
    workedProblem: {
      relation: string;
      functionalDependencies: string[];
      candidateKeys: string;
      analysis: string;
      conclusion: string;
    };
    sourceCitation: string;
  };
  crashRevision: {
    highYieldPoints: string[];
    makautRepeatAlert: string;
    commonExamMistake: string;
    quickMnemonic: string;
  };
  bilingualExplanation: {
    hinglish: string;
    bengali: string;
  };
}

export interface StudyTopicData {
  id: string;
  subjectCode: string;
  subjectName: string;
  moduleName: string;
  topicTitle: string;
  coverageStatus: "well-covered" | "thin" | "missing";
  pyqFrequency: string;
  estimatedReadTime: string;
  notes: NoteContent;
}

export const MOCK_STUDY_TOPICS: Record<string, StudyTopicData> = {
  sess_dbms: {
    id: "sess_dbms",
    subjectCode: "PCC-CS501",
    subjectName: "Database Management Systems",
    moduleName: "Module 3: Relational Normalization",
    topicTitle: "Third Normal Form (3NF) vs Boyce-Codd Normal Form (BCNF)",
    coverageStatus: "well-covered",
    pyqFrequency: "Asked in 2019, 2021, 2023, 2024",
    estimatedReadTime: "6 min read",
    notes: {
      oneMark: {
        definition:
          "Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF where for every non-trivial functional dependency X → Y, the determinant X must be a super key of the relation.",
        keyRule: "In BCNF, every determinant MUST be a candidate or super key.",
        quickFact:
          "All BCNF relations are in 3NF, but not all 3NF relations are in BCNF (due to overlapping candidate keys).",
      },
      fiveMarks: {
        leadDefinition:
          "Third Normal Form (3NF) eliminates transitive dependencies for non-prime attributes, whereas BCNF eliminates all dependencies where the determinant is not a super key, even if the dependent attribute is prime.",
        corePrinciples: [
          "3NF Condition: For every functional dependency X → Y, either X is a super key OR Y is a prime attribute (part of some candidate key).",
          "BCNF Condition: For every functional dependency X → Y, X must strictly be a super key.",
          "Overlapping Keys: 3NF permits non-super key determinants as long as the right-hand side is prime; BCNF prohibits this entirely.",
          "Trade-off: 3NF decomposition always guarantees lossless join and dependency preservation. BCNF guarantees lossless join but may not preserve dependencies.",
        ],
        diagramLabel: "Dependency Architecture & Normal Form Hierarchy",
        diagramContent: `┌──────────────────────────────────────────────┐
│  1NF: Atomic domain values                   │
│   └── 2NF: No partial dependencies          │
│        └── 3NF: No transitive dependencies   │
│             └── BCNF: Strict super-key LHS   │
└──────────────────────────────────────────────┘`,
        academicExample: {
          title: "College Student-Advisor Relation R(StudentID, Subject, Advisor)",
          description:
            "Suppose each student has one advisor per subject, and each advisor teaches only one subject. FDs: { (StudentID, Subject) → Advisor, Advisor → Subject }. The relation is in 3NF because Subject is a prime attribute, but NOT in BCNF because Advisor is not a candidate key.",
        },
        sourceCitation: "Module 3 Slide 14 · Class Notes p. 28–32",
      },
      fifteenMarks: {
        theoreticalFoundation:
          "Relational normalization was pioneered by E.F. Codd to minimize data redundancy, insertion anomalies, update anomalies, and deletion anomalies. While 3NF successfully eliminates transitive dependencies involving non-prime attributes, it permits anomalies when relations possess multiple overlapping candidate keys. R.F. Boyce and Codd formulated BCNF in 1974 to resolve this exact anomaly.",
        formalDefinitions: [
          {
            term: "Third Normal Form (3NF)",
            explanation:
              "A relation R is in 3NF if it is in 2NF and for every non-trivial functional dependency X → Y: either X is a super key of R, or Y is a prime attribute (i.e. member of candidate key).",
          },
          {
            term: "Boyce-Codd Normal Form (BCNF)",
            explanation:
              "A relation R is in BCNF if and only if for every non-trivial functional dependency X → Y in F+, X is a super key of R.",
          },
          {
            term: "Lossless Join vs Dependency Preservation",
            explanation:
              "A decomposition D = {R1, R2} is lossless if R1 ⋈ R2 = R. A decomposition is dependency preserving if the union of FDs of all decomposed relations logically implies all FDs of the original relation.",
          },
        ],
        stepByStepDecomposition: [
          {
            step: 1,
            title: "Identify Candidate Keys & Prime Attributes",
            detail:
              "Compute the closure of all attribute subsets in relation R using Armstrong's axioms to find all candidate keys. Classify attributes as prime (belonging to candidate key) or non-prime.",
          },
          {
            step: 2,
            title: "Evaluate 3NF Compliance",
            detail:
              "Inspect every FD X → Y. If X is not a super key, check whether Y is prime. If all FDs satisfy this, R is in 3NF.",
          },
          {
            step: 3,
            title: "Locate BCNF Violations",
            detail:
              "Find any FD X → Y where X is NOT a super key (even if Y is prime). This FD violates BCNF and necessitates decomposition.",
          },
          {
            step: 4,
            title: "Decompose into BCNF Sub-relations",
            detail:
              "Decompose R into R1(X ∪ Y) and R2(R - (Y - X)). Verify that the decomposition is lossless by testing whether (R1 ∩ R2) → R1 or (R1 ∩ R2) → R2.",
          },
        ],
        comparisonTable: {
          headers: ["Evaluation Parameter", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
          rows: [
            ["Determinant Requirement", "X is super key OR Y is prime", "X MUST strictly be a super key"],
            ["Redundancy Level", "Low, but allows anomalies with overlapping keys", "Minimal / zero anomalies from functional dependencies"],
            ["Lossless Join Guarantee", "Always achievable", "Always achievable"],
            ["Dependency Preservation", "Always guaranteed", "Not guaranteed (dependencies may be lost)"],
            ["Practical Industry Choice", "Widely preferred when FD enforcement is critical", "Preferred when storage efficiency and strict integrity outweigh join costs"],
          ],
        },
        diagramLabel: "Decomposition Tree of R(StudentID, Subject, Advisor)",
        diagramContent: `Original Relation R(StudentID, Subject, Advisor)
FD1: {StudentID, Subject} → Advisor (Super Key)
FD2: Advisor → Subject (Violates BCNF because Advisor is not super key)
             │
             ├── Decompose into:
             ▼
      R1(Advisor, Subject)         R2(StudentID, Advisor)
      FD: Advisor → Subject        FD: (StudentID, Advisor) → None
      Key: Advisor                 Key: (StudentID, Advisor)
      [BCNF Verified]              [BCNF Verified]`,
        workedProblem: {
          relation: "Enrollment(StudentID, CourseCode, InstructorID)",
          functionalDependencies: [
            "{StudentID, CourseCode} → InstructorID",
            "InstructorID → CourseCode",
          ],
          candidateKeys: "Key 1: {StudentID, CourseCode}, Key 2: {StudentID, InstructorID}",
          analysis:
            "Prime attributes are {StudentID, CourseCode, InstructorID}. In FD InstructorID → CourseCode, CourseCode is a prime attribute, so relation is in 3NF. However, InstructorID is NOT a super key, hence it violates BCNF.",
          conclusion:
            "Decomposed relations: R1(InstructorID, CourseCode) and R2(StudentID, InstructorID). Both relations are now in BCNF and the join is lossless.",
        },
        sourceCitation: "MAKAUT Syllabus Module 3 · Korth & Sudarshan, Ch. 8 · p. 280–295",
      },
      crashRevision: {
        highYieldPoints: [
          "If a relation has NO overlapping candidate keys, 3NF is automatically equivalent to BCNF.",
          "3NF = 2NF + No transitive dependency on non-prime attribute.",
          "BCNF = For all X → Y, X MUST be a Super Key.",
          "Remember the Golden Rule: 3NF decomposition guarantees dependency preservation; BCNF does not.",
        ],
        makautRepeatAlert:
          "Very high probability question in Group B (5 Marks) or Group C (15 Marks subdivided with 5+10 format).",
        commonExamMistake:
          "Students often forget to mention the prime attribute condition in 3NF definition. Examiners penalize this immediately.",
        quickMnemonic: "Super key LHS or Prime RHS = 3NF. Only Super key LHS = BCNF.",
      },
      bilingualExplanation: {
        hinglish:
          "Seedhi baat: 3NF me agar LHS super key nahi bhi hai, par RHS prime attribute (candidate key ka hissa) hai, toh chalta hai. Lekin BCNF bohot strict hai—BCNF bolta hai ki LHS ko har halat me Super Key hona hi padega, chahe RHS prime ho ya non-prime.",
        bengali:
          "Shoja bhashay: 3NF-e jodi LHS super key na-o hoy, kintu RHS ekta prime attribute hoy, tahole sheta allowed. Kintu BCNF khub strict—BCNF-e protita dependency-r LHS-ke oboshyoi Super Key hotei hobe.",
      },
    },
  },
  sess_os: {
    id: "sess_os",
    subjectCode: "PCC-CS502",
    subjectName: "Operating Systems",
    moduleName: "Module 2: CPU Scheduling",
    topicTitle: "Process Synchronization & The Critical Section Problem",
    coverageStatus: "well-covered",
    pyqFrequency: "Asked in 2020, 2022, 2023",
    estimatedReadTime: "5 min read",
    notes: {
      oneMark: {
        definition:
          "The Critical Section is a segment of code where cooperating processes access and modify shared resources such as memory, files, or variables.",
        keyRule: "Only one process may execute in its critical section at any given time.",
        quickFact:
          "The three mandatory criteria for any valid critical section solution are Mutual Exclusion, Progress, and Bounded Waiting.",
      },
      fiveMarks: {
        leadDefinition:
          "The Critical Section Problem involves designing a protocol that concurrent processes can use to coordinate access to shared memory, preventing race conditions and data inconsistency.",
        corePrinciples: [
          "Mutual Exclusion: If process Pi is executing in its critical section, no other process can execute in theirs.",
          "Progress: If no process is in its critical section and some wish to enter, only processes not in remainder section decide who enters next.",
          "Bounded Waiting: There exists a bound on the number of times other processes can enter their critical sections after a process has requested entry.",
          "Peterson's Solution: A classic software-based solution for two processes using turn and flag variables.",
        ],
        diagramLabel: "Process Execution Cycle Structure",
        diagramContent: `┌──────────────────────────────────────────────┐
│  do {                                        │
│      [Entry Section]  <-- Acquire lock       │
│          CRITICAL SECTION                    │
│      [Exit Section]   <-- Release lock       │
│          REMAINDER SECTION                   │
│  } while (true);                             │
└──────────────────────────────────────────────┘`,
        academicExample: {
          title: "Producer-Consumer Shared Buffer",
          description:
            "When producer increments counter while consumer decrements counter without atomic locks, the final counter value becomes corrupted due to race conditions at the assembly instruction level.",
        },
        sourceCitation: "Module 2 · Silberschatz & Galvin, Ch. 5 · p. 195–205",
      },
      fifteenMarks: {
        theoreticalFoundation:
          "In modern multiprogramming operating systems, concurrent processes share memory and kernel data structures. When multiple processes read and write shared data concurrently, the final outcome depends on the order of thread execution. This non-deterministic hazard is termed a race condition.",
        formalDefinitions: [
          {
            term: "Race Condition",
            explanation:
              "A situation where multiple threads access and manipulate shared data concurrently and the outcome depends on the particular order in which access takes place.",
          },
          {
            term: "Peterson's Algorithm",
            explanation:
              "A software solution for two processes that satisfies mutual exclusion, progress, and bounded waiting using shared boolean flag[2] array and integer turn.",
          },
          {
            term: "Counting vs Binary Semaphores",
            explanation:
              "A semaphore S is an integer variable accessed only via wait() and signal(). Binary semaphore (0 or 1) functions as a mutex lock; counting semaphore manages multiple finite instances of a resource.",
          },
        ],
        stepByStepDecomposition: [
          {
            step: 1,
            title: "Mutual Exclusion Proof",
            detail:
              "Show that process P0 and P1 cannot both satisfy (flag[other] == true && turn == other) simultaneously. Since turn cannot be both 0 and 1, only one process enters.",
          },
          {
            step: 2,
            title: "Progress Proof",
            detail:
              "A process cannot be blocked from entering if the other process is in its remainder section, because flag[other] will be false.",
          },
          {
            step: 3,
            title: "Bounded Waiting Proof",
            detail:
              "A process cannot enter twice while the other process is waiting, because setting turn = other gives the waiting process priority on the next iteration.",
          },
          {
            step: 4,
            title: "Hardware Primitives vs Semaphores",
            detail:
              "Evaluate atomic CPU instructions like Test-and-Set and Compare-and-Swap, and contrast with OS semaphores that avoid busy waiting using sleep/wakeup queues.",
          },
        ],
        comparisonTable: {
          headers: ["Criterion", "Mutex Lock", "Counting Semaphore"],
          rows: [
            ["Definition", "Strictly binary locking primitive (locked/unlocked)", "Integer counter variable with atomic wait() & signal()"],
            ["Ownership", "Only the thread that locked the mutex can unlock it", "Any thread can signal a semaphore to increment count"],
            ["Use Case", "Exclusive access to a single shared data resource", "Controlling access to a pool of N identical resources"],
            ["Overhead", "Extremely lightweight; spinlock in kernel", "Moderate; involves process queue management"],
            ["MAKAUT Marking Priority", "Always mention ownership and binary state in 5m answer", "Always write down wait() and signal() definitions in 5m answer"],
          ],
        },
        diagramLabel: "Semaphore Wait() and Signal() Queue Architecture",
        diagramContent: `Process calls wait(S):
    S.value--;
    if (S.value < 0) {
        add this process to S.waitingQueue;
        block(); // Sleep
    }

Process calls signal(S):
    S.value++;
    if (S.value <= 0) {
        remove a process P from S.waitingQueue;
        wakeup(P);
    }`,
        workedProblem: {
          relation: "Dining Philosophers Synchronization Problem",
          functionalDependencies: [
            "5 philosophers seated around table with 5 chopsticks.",
            "Each philosopher needs both left and right chopsticks to eat.",
          ],
          candidateKeys: "Resource Allocation Graph with circular wait hazard",
          analysis:
            "If all philosophers pick up their left chopstick simultaneously, a deadlock occurs. Solution: Use asymmetric pickup (odd philosophers pick left first, even pick right first) or allow at most 4 philosophers at the table.",
          conclusion:
            "Deadlock-free and starvation-free execution achieved using semaphore array chopstick[5].",
        },
        sourceCitation: "MAKAUT Syllabus Module 2 · Silberschatz & Galvin · Ch. 6",
      },
      crashRevision: {
        highYieldPoints: [
          "The three golden requirements: 1. Mutual Exclusion, 2. Progress, 3. Bounded Waiting.",
          "Semaphores have two atomic operations: wait() (also called P) and signal() (also called V).",
          "Test-and-Set and Compare-and-Swap are atomic hardware instructions that eliminate software race conditions.",
          "Binary Semaphore = Mutex Lock without thread ownership constraint.",
        ],
        makautRepeatAlert: "Core favorite of MAKAUT examiners. Appears almost every alternate year in 5-mark short notes.",
        commonExamMistake:
          "Writing wait() and signal() without stating that their execution is strictly ATOMIC.",
        quickMnemonic: "MPB: Mutual exclusion, Progress, Bounded waiting.",
      },
      bilingualExplanation: {
        hinglish:
          "Critical Section matlab code ka wo dangerous hissa jaha shared memory access ho rahi hoti hai. Agar do process ek sath waha ghus gaye toh data corrupt ho jayega. Isliye hume lock lagana padta hai taaki ek bar me ek hi process andar jaye.",
        bengali:
          "Critical Section holo code-er shei ongsho jekhane shared data access kora hoy. Jodi eksathe duto process shekhane dhuke pore tahole data nosto hoye jabe. Tai lock bebohar kora hoy jate ek somoye ektai process dhukte pare.",
      },
    },
  },
};
