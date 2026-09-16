export interface SampleSyllabus {
  id: string;
  courseCode: string;
  courseName: string;
  fileName: string;
  fileSize: number;
  rawContent: string;
}

export const SAMPLE_SYLLABI: SampleSyllabus[] = [
  {
    id: "sample-cs4820",
    courseCode: "CS 4820",
    courseName: "Introduction to the Analysis of Algorithms",
    fileName: "CS4820_Algorithms_Syllabus.pdf",
    fileSize: 348200,
    rawContent: `
Course: CS 4820 - Introduction to the Analysis of Algorithms
Instructor: Prof. Jon Kleinberg
Email: kleinberg@cornell.edu
Office Hours: Mon/Wed 1:30 PM - 3:00 PM (Gates 310)

Grading Policy & Weights:
Problem Sets : 30%
Programming Projects : 20%
Prelim Exam 1 : 20%
Prelim Exam 2 : 10%
Final Examination : 20%

Schedule of Assignments and Exams:
Sep 22 - Problem Set 1: Greedy Algorithms & Interval Scheduling (5%)
Oct 01 - Problem Set 2: Divide-and-Conquer & Fast Fourier Transform (5%)
Oct 09 - Programming Project 1: Max-Flow Min-Cut Network Solver (10%)
Oct 16 - Prelim Exam 1: Greedy, Divide-and-Conquer, Dynamic Programming (20%)
Oct 27 - Problem Set 3: NP-Completeness & Reductions (5%)
Nov 08 - Problem Set 4: Approximation Algorithms (5%)
Nov 19 - Programming Project 2: Travelling Salesperson Local Search (10%)
Dec 04 - Prelim Exam 2: P vs NP & Linear Programming (10%)
Dec 14 - Final Comprehensive Examination (20%)

Late Policy: Each student gets 4 slip days total across the semester. Afterwards, 20% deduction per 24 hours.
    `.trim()
  },
  {
    id: "sample-phys2213",
    courseCode: "PHYS 2213",
    courseName: "Physics II: Electromagnetism & Optics",
    fileName: "PHYS2213_Electromagnetism.docx",
    fileSize: 421000,
    rawContent: `
Syllabus for PHYS 2213: Physics II - Electromagnetism
Instructor: Dr. Alan Sokal
Email: sokal@cornell.edu
Office Hours: Tuesday 4:00 PM - 6:00 PM (Rockefeller 220)

Weight Distribution:
Weekly WebAssign Homework : 20%
Laboratory Practicum & Reports : 25%
Midterm Exam 1 : 20%
Midterm Exam 2 : 15%
Final Exam : 20%

Semester Schedule:
Sep 25 - WebAssign 1: Coulomb's Law and Electric Fields (4%)
Oct 02 - Lab 1: Electric Field Mapping and Equipotential Lines (5%)
Oct 10 - WebAssign 2: Gauss's Law & Conductors (4%)
Oct 18 - Midterm Exam 1: Electrostatics and Potential (20%)
Oct 26 - Lab 2: RC Circuits and Time Constants (5%)
Nov 03 - WebAssign 3: Biot-Savart Law and Ampere's Law (4%)
Nov 14 - Midterm Exam 2: Magnetism and Induction (15%)
Nov 28 - Lab 3: Faraday's Law and AC Generators (5%)
Dec 12 - Final Exam: Maxwell's Equations and Optics (20%)
    `.trim()
  },
  {
    id: "sample-psyc1101",
    courseCode: "PSYCH 1101",
    courseName: "Introduction to Cognitive Psychology",
    fileName: "PSYCH1101_IntroPsych.pdf",
    fileSize: 284000,
    rawContent: `
Course: PSYCH 1101: Introduction to Cognitive Psychology
Instructor: Prof. Shimon Edelman
Email: edelman@cornell.edu
Office Hours: Friday 10:00 AM - 12:00 PM (Uris 214)

Weighting Breakdown:
Discussion Forum Reflections : 20%
Research Paper (10 pages) : 25%
Midterm Quiz Series : 25%
Final Exam : 30%

Important Due Dates:
Sep 28 - Discussion Post 1: Perception & Attention (5%)
Oct 05 - Research Paper Topic & Annotated Bibliography (5%)
Oct 14 - Midterm Quiz: Memory Models & Neural Networks (25%)
Oct 29 - Discussion Post 2: Language Acquisition (5%)
Nov 12 - Rough Draft: 10-page Research Paper (5%)
Nov 25 - Final Draft: 10-page Cognitive Science Research Paper (15%)
Dec 10 - Final Examination (30%)
    `.trim()
  }
];
