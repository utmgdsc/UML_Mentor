import { Instruction } from "../components/InstructionsPopup";

export const umlDiagramInstructions: Instruction[] = [
  {
    title: "Welcome to UML Diagram Editor",
    body: "This tool allows you to create UML class diagrams. Let's go through the main features.",
    imgSrc: "../../public/images/guide_base.png",
  },
  {
    title: "Task Details & Workspace",
    body: "The problem you are to solve using the UML diagram is displayed on the left half of the screen. You may shift the size of the description screen and the workspace by dragging the divider between them.",
    imgSrc: "../../public/images/description_slider.png",
  },
  {
    title: "Adding Nodes",
    body: "Use the 'Add Class Node' and 'Add Interface Node' buttons to add new nodes to your diagram. You can drag them from the toolbar to place them precisely.",
    imgSrc: "../../public/images/add_node.png",
  },
  {
    title: "Connecting Nodes",
    body: "Click and drag from one node to another to create connections. Choose the relationship type from the dropdown menu.",
    imgSrc: "../../public/images/connecting_nodes.png",
  },
  {
    title: "Editing Nodes",
    body: "Click on a node in its various text fields to edit its name, attributes, and methods.",
    imgSrc: "../../public/images/edit_node.png",
  },
  {
    title: "Deleting Nodes",
    body: "Click on the X mark on the top right of a node to delete it. You may also select the node and press backspace to delete it.",
    imgSrc: "../../public/images/delete_node.png",
  },
  {
    title: "Deleting Edges",
    body: "Click on an edge then click the 'Delete Selected Edge' button to delete it. You may also select the edge and press backspace to delete it.",
    imgSrc: "../../public/images/delete_edge.png",
  },
  {
    title: "Saving and Exporting",
    body: "Your diagram is automatically saved. Use the 'Post Solution' button to generate an image and submit your work.",
    imgSrc: "../../public/images/post_solution.png",
  },
];
