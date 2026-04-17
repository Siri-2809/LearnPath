import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, '../data/questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Add mock questions for Programming Fundamentals
const newMockQuestions = [
    {
        "question": "What is the purpose of using comments in code?",
        "options": [
            "To make code slower",
            "To explain code logic and improve readability",
            "To declare variables",
            "To execute code faster"
        ],
        "correctAnswer": "To explain code logic and improve readability",
        "subject": "Programming Fundamentals",
        "topic": "Best Practices",
        "difficulty": "Easy",
        "companies": ["TCS", "Infosys", "Google", "Microsoft", "Amazon"],
        "marks": 1,
        "explanation": "Comments are used to explain code, making it easier for other developers to understand the logic.",
        "testType": "mock",
        "isActive": true
    },
    {
        "question": "What does DRY principle stand for in programming?",
        "options": [
            "Don't Repeat Yourself",
            "Data Replication Yields",
            "Design Relational Yield",
            "Database Response Yield"
        ],
        "correctAnswer": "Don't Repeat Yourself",
        "subject": "Programming Fundamentals",
        "topic": "Best Practices",
        "difficulty": "Medium",
        "companies": ["Google", "Microsoft", "Amazon"],
        "marks": 1,
        "explanation": "DRY is a software development principle to reduce code repetition and duplication.",
        "testType": "mock",
        "isActive": true
    },
    {
        "question": "What is a compiler in programming?",
        "options": [
            "A tool that converts source code into machine code",
            "A variable declaration",
            "A type of loop",
            "A debugging tool"
        ],
        "correctAnswer": "A tool that converts source code into machine code",
        "subject": "Programming Fundamentals",
        "topic": "Terminology",
        "difficulty": "Easy",
        "companies": ["TCS", "Infosys", "Google", "Microsoft", "Amazon"],
        "marks": 1,
        "explanation": "A compiler translates high-level programming language code into machine-readable code.",
        "testType": "mock",
        "isActive": true
    }
];

const allQuestions = [...questions, ...newMockQuestions];

fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 4));
console.log('✅ Added 3 mock questions for Programming Fundamentals');
