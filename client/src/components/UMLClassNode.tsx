import { useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, NodeResizer, NodeResizeControl } from '@xyflow/react';
import { memo } from 'react';

interface UMLNodeData {
    label?: string;
    attributes?: string[];
    methods?: string[];
    color?: string;
    removeNode?: (id: string) => void;
    updateNodeData?: (id: string, newData: Partial<UMLNodeData>) => void;
    isPreview?: boolean;
}

interface UMLNodeProps extends NodeProps<UMLNodeData> {}

const UMLClassNode: React.FC<UMLNodeProps> = ({ data, id, selected }) => {
    const [label, setLabel] = useState<string>(data.label || 'ClassName');
    const [attributes, setAttributes] = useState<string>(data.attributes?.join('\n') || '');
    const [methods, setMethods] = useState<string>(data.methods?.join('\n') || '');
    const headerColor = data.color || '#FFEE93';

    const attributesRef = useRef<HTMLTextAreaElement>(null);
    const methodsRef = useRef<HTMLTextAreaElement>(null);
    const labelRef = useRef<HTMLInputElement>(null);
    const nodeRef = useRef<HTMLDivElement>(null);

    const [nodeWidth, setNodeWidth] = useState(200);
    const [nodeHeight, setNodeHeight] = useState(200);

    useEffect(() => {
        let maxWidth = 150;
        const fontSize = 14;
        const fontFamily = 'Arial, sans-serif';
        const font = `${fontSize}px ${fontFamily}`;
        
        let labelWidth = 0;
        if (labelRef.current) {
            const labelText = labelRef.current.value;
            labelWidth = measureTextWidth(labelText, font);
        }
        
        let attributesMaxWidth = 0;
        const attributesLines = attributes.split('\n');
        attributesLines.forEach(line => {
            const lineWidth = measureTextWidth(line, font);
            attributesMaxWidth = Math.max(attributesMaxWidth, lineWidth);
        });
        
        let methodsMaxWidth = 0;
        const methodsLines = methods.split('\n');
        methodsLines.forEach(line => {
            const lineWidth = measureTextWidth(line, font);
            methodsMaxWidth = Math.max(methodsMaxWidth, lineWidth);
        });

        maxWidth = Math.max(maxWidth, labelWidth, attributesMaxWidth, methodsMaxWidth);
        const padding = 30;
        setNodeWidth(maxWidth + padding);
    }, [label, attributes, methods]);

    const measureTextWidth = (text: string, font: string): number => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return 0;
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    };

    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        setLabel(newLabel);
        data.updateNodeData?.(id, { label: newLabel });
    };

    const handleAttributesChange = (e) => {
        const newAttributes = e.target.value;
        setAttributes(newAttributes);
        data.updateNodeData?.(id, { attributes: newAttributes.split('\n') });
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
                ref={nodeRef}
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
                        flexShrink: 0,
                    }}
                >
                    <input
                        ref={labelRef}
                        value={label}
                        onChange={handleLabelChange}
                        placeholder="Class Name"
                        style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif',
                            whiteSpace: 'pre',
                            overflow: 'hidden',
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
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        flex: 1,
                        padding: '7px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <textarea
                            ref={attributesRef}
                            value={attributes}
                            onChange={handleAttributesChange}
                            placeholder="Attributes"
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
            </div>
</>
    );
};


export default memo(UMLClassNode);