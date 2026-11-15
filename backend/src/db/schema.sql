-- ============================================================
-- Studify Core PostgreSQL Database Schema (Neon + pgvector)
-- ============================================================

-- 1. Enable pgvector and uuid extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subjects (MAKAUT Syllabus)
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    department_code VARCHAR(10) REFERENCES departments(code) ON DELETE CASCADE,
    regulation VARCHAR(20) DEFAULT '2018',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Syllabus Modules (Chapters)
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE CASCADE,
    module_number INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_code, module_number)
);

-- 5. Syllabus Topics
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    pyq_frequency VARCHAR(100),
    weightage_marks INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Student Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
    id VARCHAR(100) PRIMARY KEY,
    subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE CASCADE,
    current_module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    current_chapter_name VARCHAR(250),
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    topics_covered INT DEFAULT 0,
    total_topics INT DEFAULT 1,
    last_studied VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Ingested Document Chunks (with Vector Embedding & Full-Text Search)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) REFERENCES study_sessions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    page_number INT,
    section_title VARCHAR(255),
    content_text TEXT NOT NULL,
    -- 1536 dimensions for standard text-embedding-3 or 768 for open embeddings
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Full-Text search index on chunk content
CREATE INDEX IF NOT EXISTS idx_chunks_fts ON document_chunks USING gin(to_tsvector('english', content_text));

-- 8. Generated Section-by-Section Study Notes (Cached AI Output)
CREATE TABLE IF NOT EXISTS generated_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) REFERENCES study_sessions(id) ON DELETE CASCADE,
    section_index INT NOT NULL,
    section_title VARCHAR(300) NOT NULL,
    next_section_title VARCHAR(300),
    total_sections INT NOT NULL DEFAULT 1,
    source_chunk_ids UUID[],
    provider_used VARCHAR(50),
    note_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, section_index)
);

-- 9. Question Bank & PYQ Repository
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE CASCADE,
    module_number INT,
    marks_category INT NOT NULL CHECK (marks_category IN (1, 5, 15)),
    question_text TEXT NOT NULL,
    options JSONB, -- For 1-mark MCQs: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer TEXT,
    explanation TEXT,
    pyq_years INT[], -- e.g. {2019, 2021, 2023}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Seed Initial MAKAUT Data if Empty
INSERT INTO departments (code, name)
VALUES 
    ('CSE', 'Computer Science & Engineering'),
    ('IT', 'Information Technology'),
    ('ECE', 'Electronics & Communication Engineering')
ON CONFLICT (code) DO NOTHING;

INSERT INTO subjects (code, name, semester, department_code, regulation)
VALUES 
    ('PCC-CS501', 'Database Management Systems', 5, 'CSE', '2018'),
    ('PCC-CS502', 'Operating Systems', 5, 'CSE', '2018')
ON CONFLICT (code) DO NOTHING;

INSERT INTO modules (subject_code, module_number, name)
VALUES
    ('PCC-CS501', 1, 'Module 1: Relational Data Model & ER'),
    ('PCC-CS501', 2, 'Module 2: Relational Algebra & SQL'),
    ('PCC-CS501', 3, 'Module 3: Relational Normalization (3NF & BCNF)'),
    ('PCC-CS501', 4, 'Module 4: Transaction Processing & Concurrency'),
    ('PCC-CS502', 1, 'Module 1: OS Structures & Processes'),
    ('PCC-CS502', 2, 'Module 2: CPU Scheduling & Synchronization')
ON CONFLICT (subject_code, module_number) DO NOTHING;

INSERT INTO study_sessions (id, subject_code, current_chapter_name, progress_percent, topics_covered, total_topics, last_studied)
VALUES
    ('sess_dbms', 'PCC-CS501', 'Module 3: Relational Normalization (3NF & BCNF)', 68, 4, 6, 'Today, 11:30 AM'),
    ('sess_os', 'PCC-CS502', 'Module 2: Process Scheduling & Synchronization', 42, 3, 7, 'Yesterday')
ON CONFLICT (id) DO UPDATE SET
    progress_percent = EXCLUDED.progress_percent,
    current_chapter_name = EXCLUDED.current_chapter_name;
