// server/services/uml/UMLFormatter.js

const convertToPlantUML = (diagram) => {
  let uml = "@startuml\n\n";

  // Define classes and interfaces
  diagram.nodes.forEach(node => {
    if (node.type === "umlInterface") {
      uml += `interface "${node.label}" {\n`;
    } else {
      uml += `class "${node.label}" {\n`;
    }

    // Add attributes
    if (node.attributes && node.attributes.length) {
      node.attributes.forEach(attr => {
        uml += `  ${attr}\n`;
      });
    }

    // Add methods
    if (node.methods && node.methods.length) {
      node.methods.forEach(method => {
        uml += `  ${method}\n`;
      });
    }

    uml += "}\n\n";
  });

  // Define relationships
  diagram.edges.forEach(edge => {
    const source = diagram.nodes.find(n => n.id === edge.source)?.label;
    const target = diagram.nodes.find(n => n.id === edge.target)?.label;

    if (source && target) {
      switch (edge.type) {
        case "Inheritance":
          uml += `${target} <|-- ${source}\n`;
          break;
        case "Implementation":
          uml += `${target} <|.. ${source}\n`;
          break;
        case "Composition":
          uml += `${target} *-- ${source}\n`;
          break;
        case "Aggregation":
          uml += `${target} o-- ${source}\n`;
          break;
        default:
          uml += `${target} -- ${source}\n`;
      }
    }
  });

  uml += "\n@enduml";
  return uml;
}

export const ReturnFunction = () =>{

 const formatForAI = (nodes, edges) => {
  const diagram = {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      label: node.data.label || (node.type === "umlInterface" ? "Interface" : "Class"),
      attributes: node.type === "umlInterface" ? [] : node.data.attributes || [],
      methods: node.data.methods || [],
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.data?.edgeType,
    })),
  };

  const plantUML = convertToPlantUML(diagram);

  return `
UML Diagram Description:
- Total Classes/Interfaces: ${diagram.nodes.length}
- Total Relationships: ${diagram.edges.length}

PlantUML Representation:
${plantUML}

Diagram Structure Summary:
${generateStructureSummary(diagram)}
  `.trim();
}


const generateStructureSummary = (diagram) => {
  let summary = "\nClasses and Interfaces:\n";

  diagram.nodes.forEach(node => {
    summary += `\n${node.type === "umlInterface" ? "Interface" : "Class"}: ${node.label}\n`;
    if (node.attributes && node.attributes.length) {
      summary += "  Attributes:\n";
      node.attributes.forEach(attr => summary += `    - ${attr}\n`);
    }
    if (node.methods && node.methods.length) {
      summary += "  Methods:\n";
      node.methods.forEach(method => summary += `    - ${method}\n`);
    }
  });

  return summary;
}
return {formatForAI, generateStructureSummary};}
