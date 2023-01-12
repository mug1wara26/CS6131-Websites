const ctfs: Array<{
    name: string,
    ctfid: string,
    description?: string,
    date: number,
    format: string,
    location: string,
    link: string
}> = [
    {
        name: "Stack The Flags",
        ctfid: "1",
        description: "GovTech Organised CTF",
        date: 1669946400,
        format: "Jeopardy",
        location: "Online",
        link: "https://jts.tech.gov.sg/2022/stack-the-flags"
    },
    {
        name: "Cyberthon",
        ctfid: "2",
        description: "HCI Organised CTF",
        date: 1651885200,
        format: "Jeopardy",
        location: "Online",
        link: "https://www.cyberthon.hci.edu.sg"
    }
]

export default ctfs