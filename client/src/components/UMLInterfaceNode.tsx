import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

// Define types for the node data and props
interface UMLNodeData {
    label?: string;
    methods?: string[];
    showButtons?: boolean;
    color?: string;
    removeNode?: (id: string) => void;
    isPreview?: boolean;
}

interface UMLNodeProps extends NodeProps<UMLNodeData> {}

const UMLInterfaceNode: React.FC<UMLNodeProps> = ({ data, id }) => {
    const [label, setLabel] = useState<string>(data.label || 'Interface');
    const [methods, setMethods] = useState<string[]>(data.methods || ['method()']);
    const showButtons = data.showButtons !== undefined ? data.showButtons : true;
    const headerColor = data.color || '#FFEE93';

    // Remove the node if all methods are deleted
    useEffect(() => {
        if (methods.length === 0 && !data.isPreview) {
            data.removeNode?.(id);
        }
    }, [methods, data.removeNode, id, data.isPreview]);

    // Handle method changes
    const handleMethodChange = (index: number, value: string) => {
        const updatedMethods = [...methods];
        updatedMethods[index] = value;
        setMethods(updatedMethods);
    };

    // Delete a method
    const deleteMethod = (index: number) => {
        const updatedMethods = methods.filter((_, methodIndex) => methodIndex !== index);
        setMethods(updatedMethods);
    };

    // Add new method
    const addMethod = () => {
        setMethods([...methods, 'newMethod()']);
    };

    // Function to delete the entire node
    const handleDeleteNode = () => {
        data.removeNode?.(id);
    };

    // Set width and height dynamically based on content
    const nodeWidth = 200;
    const nodeHeight = 50 + methods.length * 25;

    return (
        <div style={{
            border: '1px solid black',
            borderRadius: '5px',
            width: `${nodeWidth}px`,
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
            backgroundColor: 'white',
        }}>
            {/* Header with background color */}
            <div style={{
                backgroundColor: headerColor,
                padding: '10px',
                borderBottom: '1px solid black',
                textAlign: 'center',
                fontWeight: 'bold',
                position: 'relative'
            }}>
                <div style={{
                    fontSize: '14px',
                    color: 'ghostwhite',
                    marginBottom: '5px'
                }}>
                    &lt;&lt;interface&gt;&gt;
                </div>
                {data.isPreview ? (
                    <div>{label}</div>
                ) : (
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                    />
                )}
                {!data.isPreview && (
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
                )}
            </div>

            {/* Methods Section */}
            {methods.length > 0 && (
                <div style={{ padding: '10px' }}>
                    {methods.map((method, index) => (
                        <div key={`method-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            {data.isPreview ? (
                                <div>{method}</div>
                            ) : (
                                <>
                                    <input
                                        value={method}
                                        onChange={(e) => handleMethodChange(index, e.target.value)}
                                        style={{ width: '85%', border: 'none', paddingBottom: '5px' }}
                                    />
                                    {showButtons && (
                                        <button
                                            onClick={() => deleteMethod(index)}
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
                                </>
                            )}
                        </div>
                    ))}
                    {showButtons && !data.isPreview && (
                        <button onClick={addMethod} style={{ width: '100%', marginTop: '5px' }}>
                            + Add Method
                        </button>
                    )}
                </div>
            )}

            {/* Node connection handles */}
            {!data.isPreview && (
                <>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="right"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Right}
                        id="right"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Left}
                        id="left"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="left"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Top}
                        id="top"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Top}
                        id="top"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="bottom"
                        style={{ background: '#555' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Bottom}
                        id="bottom"
                        style={{ background: '#555' }}
                    />
                </>
            )}
        </div>
    );
};

export default UMLInterfaceNode;
