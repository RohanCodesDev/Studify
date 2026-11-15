import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { query, pool } from "./index";

const QUESTIONS_SEED = [
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "Which of the following conditions is mandatory for a decomposition of schema R into R1 and R2 to be a lossless join decomposition?",
    options: JSON.stringify([
      "(R1 ∩ R2) → R1 or (R1 ∩ R2) → R2 must hold in F+",
      "(R1 ∪ R2) must form a primary key for R",
      "(R1 ∩ R2) must be an empty set (disjoint schemas)",
      "All functional dependencies in F must be preserved in R1",
    ]),
    correctAnswer: "(R1 ∩ R2) → R1 or (R1 ∩ R2) → R2 must hold in F+",
    explanation:
      "For a decomposition of relation R into (R1, R2) to be lossless, the common attributes (R1 ∩ R2) must form a superkey of at least one of the decomposed relations (R1 or R2). This ensures no spurious tuples are generated when performing a natural join.",
    pyqYears: [2022, 2019],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "A relation schema R is in Boyce-Codd Normal Form (BCNF) if, for every non-trivial functional dependency X → Y in F+:",
    options: JSON.stringify([
      "X is a superkey of R",
      "Y is a prime attribute of R",
      "X is a subset of some candidate key",
      "Y does not belong to any candidate key",
    ]),
    correctAnswer: "X is a superkey of R",
    explanation:
      "BCNF requires that for every non-trivial functional dependency X → Y, the determinant X must strictly be a superkey of R. Unlike 3NF, BCNF does not allow the exception where Y is a prime attribute.",
    pyqYears: [2023, 2021],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "What is the key difference between 3NF and BCNF regarding functional dependency X → Y?",
    options: JSON.stringify([
      "In 3NF, Y can be a prime attribute if X is not a superkey; in BCNF, X must always be a superkey",
      "3NF eliminates multivalued dependencies, while BCNF eliminates partial dependencies",
      "BCNF relations are not guaranteed to be in 3NF",
      "3NF requires relations to be in 4NF",
    ]),
    correctAnswer:
      "In 3NF, Y can be a prime attribute if X is not a superkey; in BCNF, X must always be a superkey",
    explanation:
      "In 3NF, for X → Y, either X is a superkey OR Y is a prime attribute (part of a candidate key). BCNF eliminates this second relaxed condition, making BCNF strictly stronger than 3NF.",
    pyqYears: [2022, 2018],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "Which of the following statements regarding BCNF decomposition is always true?",
    options: JSON.stringify([
      "BCNF decomposition is always lossless, but may not preserve all functional dependencies",
      "BCNF decomposition always preserves all functional dependencies",
      "BCNF decomposition never produces a lossless join",
      "BCNF decomposition is only applicable to relations with composite primary keys",
    ]),
    correctAnswer:
      "BCNF decomposition is always lossless, but may not preserve all functional dependencies",
    explanation:
      "Any relation can always be decomposed into BCNF such that the decomposition is lossless. However, dependency preservation is NOT guaranteed in BCNF (unlike 3NF, which can achieve both lossless join and dependency preservation simultaneously).",
    pyqYears: [2023, 2020],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "A relation R is in Second Normal Form (2NF) if and only if it is in 1NF and:",
    options: JSON.stringify([
      "No non-prime attribute is partially dependent on any candidate key",
      "No prime attribute is transitively dependent on the primary key",
      "Every functional dependency determinant is a candidate key",
      "It contains no multivalued attributes or composite keys",
    ]),
    correctAnswer:
      "No non-prime attribute is partially dependent on any candidate key",
    explanation:
      "2NF eliminates partial functional dependencies. A partial dependency occurs when a non-prime attribute depends on only a proper subset of a composite candidate key.",
    pyqYears: [2021, 2017],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "Given relation R(A, B, C) with FD set F = { A → B, B → C }. What is the candidate key and highest normal form of R?",
    options: JSON.stringify([
      "Candidate Key: A; Normal Form: 2NF (violates 3NF due to transitive dependency)",
      "Candidate Key: B; Normal Form: BCNF",
      "Candidate Key: AB; Normal Form: 1NF",
      "Candidate Key: C; Normal Form: 3NF",
    ]),
    correctAnswer:
      "Candidate Key: A; Normal Form: 2NF (violates 3NF due to transitive dependency)",
    explanation:
      "The closure of A is A+ = {A, B, C}, so A is the unique candidate key. The relation is in 2NF because the key is single-attribute (no partial dependency). However, for B → C, B is not a superkey and C is not prime, which represents a transitive dependency violating 3NF.",
    pyqYears: [2022, 2020],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText: "A functional dependency X → Y is termed 'trivial' if:",
    options: JSON.stringify([
      "Y is a subset of X (Y ⊆ X)",
      "X is a subset of Y (X ⊆ Y)",
      "X and Y have no attributes in common (X ∩ Y = ∅)",
      "X is the primary key of the relation",
    ]),
    correctAnswer: "Y is a subset of X (Y ⊆ X)",
    explanation:
      "A dependency X → Y is trivial if the attributes in Y are already present in X (Y ⊆ X). Such dependencies always hold true in any legal relation instance without imposing any constraint.",
    pyqYears: [2019, 2018],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "Which of Armstrong's Axioms states that if X → Y holds and Z is a set of attributes, then XZ → YZ holds?",
    options: JSON.stringify([
      "Augmentation Rule",
      "Transitivity Rule",
      "Reflexivity Rule",
      "Pseudotransitivity Rule",
    ]),
    correctAnswer: "Augmentation Rule",
    explanation:
      "The Augmentation Rule states that adding the same attributes Z to both sides of a valid functional dependency preserves validity: If X → Y, then XZ → YZ (or X ∪ Z → Y ∪ Z).",
    pyqYears: [2021, 2019],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "What is a 'Spurious Tuple' in relational database design?",
    options: JSON.stringify([
      "A false/invalid record generated when joining tables that were decomposed with a lossy join",
      "A duplicate tuple that exists in a normalized table",
      "A record containing null values in the primary key column",
      "An orphaned foreign key record with no matching parent",
    ]),
    correctAnswer:
      "A false/invalid record generated when joining tables that were decomposed with a lossy join",
    explanation:
      "Spurious tuples are erroneous records that appear when decomposing a relation schema without ensuring the lossless join property. When the decomposed relations are joined back via natural join, extra tuples that never existed in the original relation are created.",
    pyqYears: [2023, 2018],
  },
  {
    subjectCode: "PCC-CS501",
    moduleNumber: 3,
    marks: 1,
    questionText:
      "What is a 'Canonical Cover' (or Minimal Cover) Fc for a set of functional dependencies F?",
    options: JSON.stringify([
      "A minimal equivalent set of dependencies with no redundant dependencies and no extraneous attributes",
      "The set of all possible dependencies logically implied by F (closure F+)",
      "A set containing only the primary key dependencies",
      "The subset of dependencies that only hold in BCNF",
    ]),
    correctAnswer:
      "A minimal equivalent set of dependencies with no redundant dependencies and no extraneous attributes",
    explanation:
      "A canonical cover Fc is an irreducible, minimal set of functional dependencies that has the exact same closure as F (Fc+ = F+). In Fc, every RHS has a single attribute, no dependency is redundant, and no attribute is extraneous.",
    pyqYears: [2022, 2021],
  },
];

async function seed() {
  console.log("Seeding question_bank in Neon PostgreSQL...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const q of QUESTIONS_SEED) {
      await client.query(
        `
        INSERT INTO question_bank (
          subject_code,
          module_number,
          marks_category,
          question_text,
          options,
          correct_answer,
          explanation,
          pyq_years
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [
          q.subjectCode,
          q.moduleNumber,
          q.marks,
          q.questionText,
          q.options,
          q.correctAnswer,
          q.explanation,
          q.pyqYears,
        ]
      );
    }
    await client.query("COMMIT");
    console.log(`Successfully seeded ${QUESTIONS_SEED.length} questions into question_bank!`);
    process.exit(0);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to seed question_bank:", err);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
