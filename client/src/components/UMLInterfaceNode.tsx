import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { NodeResizer, NodeResizeControl  } from '@xyflow/react';
// Define types for the node data and props
interface UMLNodeData {
    label?: string;
    methods?: string[];
    color?: string;
    removeNode?: (id: string) => void;
    updateNodeData?: (id: string, newData: Partial<UMLNodeData>) => void;
    isPreview?: boolean;
}

interface UMLNodeProps extends NodeProps<UMLNodeData> {}

const UMLInterfaceNode: React.FC<UMLNodeProps> = ({ data, id }) => {
    const [label, setLabel] = useState<string>(data.label || 'InterfaceName');
    const [methods, setMethods] = useState<string>(data.methods?.join('\n') || '');
    const headerColor = data.color || '#FFEE93';

    const methodsRef = useRef<HTMLTextAreaElement>(null);
    const labelRef = useRef<HTMLInputElement>(null);

    const [nodeWidth, setNodeWidth] = useState<number>(200); // Initial minimum width

    // Function to measure the width of text using canvas
    const measureTextWidth = (text: string, font: string): number => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return 0;
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    };

    useEffect(() => {
        // Adjust the height of the methods text area
        // if (methodsRef.current) {
        //     methodsRef.current.style.height = 'auto';
        //     methodsRef.current.style.height = `${methodsRef.current.scrollHeight}px`;
        // }

        // Initialize maxWidth with the minimum width
        let maxWidth = 150;

        // Define font settings
        const fontSize = 14; // Adjust font size if needed
        const fontFamily = 'Arial, sans-serif';
        const font = `${fontSize}px ${fontFamily}`;

        // Measure width of the label
        let labelWidth = 0;
        if (labelRef.current) {
            const labelText = labelRef.current.value;
            labelWidth = measureTextWidth(labelText, font);
        }

        // Measure the maximum width required by methods
        let methodsMaxWidth = 0;
        const methodsLines = methods.split('\n');
        methodsLines.forEach(line => {
            const lineWidth = measureTextWidth(line, font);
            methodsMaxWidth = Math.max(methodsMaxWidth, lineWidth);
        });

        // Determine the maximum width required
        maxWidth = Math.max(maxWidth, labelWidth, methodsMaxWidth);

        // Add padding to the calculated width
        const padding = 30; // Adjust padding as needed
        setNodeWidth(maxWidth + padding);
    }, [label, methods]);

    // Handlers for input changes
    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        setLabel(newLabel);
        data.updateNodeData?.(id, { label: newLabel });
    };

    const handleMethodsChange = (e) => {
        const newMethods = e.target.value;
        setMethods(newMethods);
        data.updateNodeData?.(id, { methods: newMethods.split('\n') });
    };

    const controlStyle = {
        background: 'transparent',
        border: 'none',
      };


      function ResizeIcon() {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ff0071"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', right: 5, bottom: 5 }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="16 20 20 20 20 16" />
            <line x1="14" y1="14" x2="20" y2="20" />
            <polyline points="8 4 4 4 4 8" />
            <line x1="4" y1="4" x2="10" y2="10" />
          </svg>
        );
      }

    return (
        <>
      <NodeResizeControl style={controlStyle} minWidth={200} minHeight={200}>
        <ResizeIcon />
      </NodeResizeControl>        
      <div
            style={{
                height: '100%',
                width: '100%',
                border: '1px solid black',
                borderRadius: '5px',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    backgroundColor: headerColor,
                    padding: '10px',
                    borderBottom: '1px solid black',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    position: 'relative',
                }}
            >
                <input
                    ref={labelRef}
                    value={label}
                    onChange={handleLabelChange}
                    placeholder="Interface Name"
                    style={{
                        width: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'pre', // Prevent text wrapping
                        overflow: 'hidden', // Hide overflow
                    }}
                />
                <button
                    onClick={() => data.removeNode?.(id)}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontWeight: 'bold',
                    }}
                >
                    X
                </button>
            </div>
            <div style={{ 
                        flex: 1,
                        padding: '7px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <textarea
                            ref={methodsRef}
                            value={methods}
                            onChange={handleMethodsChange}
                            placeholder="Methods"
                            style={{
                                width: '100%',
                                height: '100%',
                                resize: 'none',
                                border: 'solid 1px black',
                                overflow: 'auto',
                                whiteSpace: 'pre',
                                fontSize: '14px',
                                fontFamily: 'Arial, sans-serif',
                            }}
                        />
                    </div>
            {!data.isPreview && (
                <>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="right"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Right}
                        id="right"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Left}
                        id="left"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="left"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Top}
                        id="top"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Top}
                        id="top"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="bottom"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                    <Handle
                        type="target"
                        position={Position.Bottom}
                        id="bottom"
                        style={{ background: '#a9a9a9', width: '10px', height: '10px', borderRadius: '2px' }}
                    />
                </>
            )}
        </div></>
    );
};

export default memo(UMLInterfaceNode);
