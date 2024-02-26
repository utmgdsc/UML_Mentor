const instructions = [
    {title: "New Instruction", body: "This is a new instruction"},
    {title: "Another Instruction", body: "This is another instruction"},
    // add more instructions as needed
]

exports.getInstructions = (req, res) => {
    res.json(instructions);
}