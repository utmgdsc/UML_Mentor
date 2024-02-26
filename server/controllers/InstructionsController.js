const instructions = [
    {title: "Getting Started", body: "This is a new instruction"},
    {title: "How to Submit Challanges", body: "This is another instruction"},
    {title: "Best Practices", body: "This is another instruction"},
    // add more instructions as needed
]

exports.getInstructions = (req, res) => {
    res.json(instructions);
}