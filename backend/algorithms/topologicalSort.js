/**
 * LearnPath - Topological Sort Algorithm
 * --------------------------------------
 * Generates a prerequisite-based learning path using Kahn's Algorithm.
 * This ensures subjects are learned in the correct order.
 *
 * Example:
 * Input:
 * [
 *   { name: "Algorithms", prerequisites: ["Data Structures"] },
 *   { name: "Data Structures", prerequisites: ["Programming Fundamentals"] },
 *   { name: "Programming Fundamentals", prerequisites: [] }
 * ]
 *
 * Output:
 * [
 *   "Programming Fundamentals",
 *   "Data Structures",
 *   "Algorithms"
 * ]
 */

/**
 * Performs topological sorting using Kahn's Algorithm.
 *
 * @param {Array} subjects - Array of subject objects.
 * @param {Array} targetSubjects - Optional array of subject names required by a company.
 * @returns {Array} Sorted array of subject names.
 */
const topologicalSort = (subjects, targetSubjects = []) => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
        return [];
    }

    // Filter only the required subjects if provided
    let filteredSubjects = subjects;

    if (targetSubjects.length > 0) {
        const subjectMap = new Map(
            subjects.map((subj) => [subj.name, subj])
        );

        const requiredSubjects = new Set();

        // Recursive function to include prerequisites
        const includePrerequisites = (subjectName) => {
            if (!subjectMap.has(subjectName) || requiredSubjects.has(subjectName)) {
                return;
            }

            requiredSubjects.add(subjectName);
            const subject = subjectMap.get(subjectName);

            if (subject.prerequisites && subject.prerequisites.length > 0) {
                subject.prerequisites.forEach(includePrerequisites);
            }
        };

        targetSubjects.forEach(includePrerequisites);

        filteredSubjects = subjects.filter((subj) =>
            requiredSubjects.has(subj.name)
        );
    }

    // Initialize adjacency list and in-degree map
    const adjacencyList = new Map();
    const inDegree = new Map();

    filteredSubjects.forEach((subject) => {
        adjacencyList.set(subject.name, []);
        inDegree.set(subject.name, 0);
    });

    // Build graph
    filteredSubjects.forEach((subject) => {
        if (subject.prerequisites && subject.prerequisites.length > 0) {
            subject.prerequisites.forEach((prereq) => {
                if (adjacencyList.has(prereq)) {
                    adjacencyList.get(prereq).push(subject.name);
                    inDegree.set(subject.name, inDegree.get(subject.name) + 1);
                }
            });
        }
    });

    // Initialize queue with nodes having 0 in-degree
    const queue = [];
    inDegree.forEach((degree, subject) => {
        if (degree === 0) {
            queue.push(subject);
        }
    });

    // Perform Kahn's Algorithm
    const sortedOrder = [];

    while (queue.length > 0) {
        const current = queue.shift();
        sortedOrder.push(current);

        adjacencyList.get(current).forEach((neighbor) => {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        });
    }

    // Detect circular dependency
    if (sortedOrder.length !== filteredSubjects.length) {
        throw new Error(
            "Cycle detected in subject prerequisites. Topological sort not possible."
        );
    }

    return sortedOrder;
};

export default topologicalSort;