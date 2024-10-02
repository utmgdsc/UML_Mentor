import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

// Define types for the node data and props
interface UMLNodeData {
    label?: string;
    attributes?: string[];
    showButtons?: boolean;
    color?: string;
    removeNode?: (id: string) => void;
}

interface UMLNodeProps extends NodeProps<UMLNodeData> {}

const UMLInterfaceNode: React.FC<UMLNodeProps> = ({ data, id }) => {
    const [label, setLabel] = useState<string>(data.label || 'Interface');
    const [attributes, setAttributes] = useState<string[]>(data.attributes || ['name: string']);
    const showButtons = data.showButtons !== undefined ? data.showButtons : true;  // Default to true if undefined
    const headerColor = data.color || '#FFEE93';  // Use the color passed in the node's data for the header only

    // Remove the node if all attributes and methods are deleted
    useEffect(() => {
        if (attributes.length === 0) {
            data.removeNode?.(id); // Call the removeNode function passed from App
        }
    }, [attributes, data.removeNode, id]);

    // Handle attribute changes
    const handleAttributeChange = (index: number, value: string) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index] = value;
        setAttributes(updatedAttributes);
    };

    // Delete an attribute
    const deleteAttribute = (index: number) => {
        const updatedAttributes = attributes.filter((_, attrIndex) => attrIndex !== index);
        setAttributes(updatedAttributes);
    };

    // Add new attribute
    const addAttribute = () => {
        setAttributes([...attributes, 'newAttribute: type']);
    };

    // Function to delete the entire node
    const handleDeleteNode = () => {
        data.removeNode?.(id);  // Call removeNode from App
    };

    return (
        <div style={{
            border: '1px solid black',
            borderRadius: '5px',
            width: '200px',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
        }}>
            {/* Header with random background color */}
            <div style={{
                backgroundColor: headerColor, // Only the header has the random color
                padding: '10px',
                borderBottom: '1px solid black',
                textAlign: 'center',
                fontWeight: 'bold',
                position: 'relative'
            }}>
                {/* Non-Editable text */}
                <div style={{
                    fontSize: '14px',
                    color: 'ghostwhite',
                    marginBottom: '5px'
                }}>
                    &lt;&lt;interface&gt;&gt;
                </div>

                {/* Editable text */}
                <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    style={{
                        width: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',  // Keep the input transparent
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                />
                {/* Delete Node Button in the Header */}
                <button
                    onClick={handleDeleteNode}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                    }}
                >
                    X
                </button>
            </div>

            {/* Attributes Section */}
            {attributes.length > 0 && (
                <div style={{ padding: '10px', borderBottom: '1px solid black' }}>
                    {attributes.map((attr, index) => (
                        <div key={`attr-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <input
                                value={attr}
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                style={{ width: '85%', border: 'none', paddingBottom: '5px' }}
                            />
                            {showButtons && (
                                <button
                                    onClick={() => deleteAttribute(index)}
                                    style={{
                                        marginLeft: '5px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                    {showButtons && (
                        <button onClick={addAttribute} style={{ width: '100%', marginTop: '5px' }}>
                            + Add Attribute
                        </button>
                    )}
                </div>
            )}


            {/* Node connection handles */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
            />
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />
        </div>
    );
};

export default UMLInterfaceNode;
