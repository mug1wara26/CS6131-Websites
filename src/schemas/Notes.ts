const notes: Array<{
    name: string,
    points: number,
    difficulty: string,
    description?: string,
    category: string
}> = [
    {
        name: 'Web Chal 1',
        points: 50,
        difficulty: "easy",
        description: "First web chal",
        category: "Web"
    },
    {
        name: 'Web Chal 2',
        points: 100,
        difficulty: "medium",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        category: "Web"
    },
    {
        name: 'Misc Chal 1',
        points: 50,
        difficulty: "easy",
        description: "First misc chal",
        category: "Misc"
    },
    {
        name: 'Misc Chal 2',
        points: 100,
        difficulty: "medium",
        description: "Second misc chal",
        category: "Misc"
    },
    {
        name: 'Misc Chal 3',
        points: 200,
        difficulty: "hard",
        description: "Third misc chal",
        category: "Misc"
    },
    {
        name: 'Pwn Chal',
        points: 150,
        difficulty: "medium",
        description: "First pwn chal",
        category: "Pwn"
    }
]

export default notes