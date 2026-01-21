import React, { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder } from '../../context/BuilderContext';
import { MousePointer2 } from 'lucide-react';
import ResizeHandles from './ResizeHandles';

const DesignCanvas = () => {
    const { viewDevice, selectElement, selectedId } = useBuilder();

    const getWidth = () => {
        switch (viewDevice) {
            case 'tablet': return '768px';
            case 'mobile': return '375px';
            default: return '100%';
        }
    };

    return (
        <div
            onClick={() => selectElement(null)}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                display: 'flex',
                justifyContent: 'center',
                padding: '40px 0 0 0',
                overflow: 'auto',
                position: 'relative'
            }}
        >
            <div
                style={{
                    width: getWidth(),
                    minHeight: '1000px', // More like a real long page
                    backgroundColor: '#fff',
                    transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    position: 'relative',
                    paddingBottom: '100px'
                }}
            >
                <ElementRenderer id="root" />
            </div>

            {/* Breadcrumb / Overlay info for selected item could go here */}
        </div>
    );
};

const ElementRenderer = ({ id }) => {
    const { elements, selectedId, selectElement } = useBuilder();
    const element = elements[id];
    const [isHovered, setIsHovered] = useState(false);
    const elementRef = useRef(null);

    // Logic to determine if an element can accept children
    const containerTypes = ['root', 'container', 'section', 'row', 'column', 'grid', 'form', 'list', 'div'];
    const isContainer = containerTypes.includes(element?.type);

    const { setNodeRef, isOver } = useDroppable({
        id: id,
        disabled: !isContainer,
        data: {
            type: element?.type
        }
    });

    if (!element) return null;

    const handleClick = (e) => {
        e.stopPropagation();
        selectElement(id);
    };

    const isSelected = selectedId === id;

    const commonStyles = {
        ...element.styles,
        position: 'relative',
        outline: isSelected ? '2px solid #3b82f6' : (isHovered ? '1px solid #60a5fa' : 'none'),
        outlineOffset: isSelected ? '-2px' : '0px',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : (element.styles.backgroundColor || 'transparent'),
        cursor: 'default',
        transition: 'all 0.1s ease',
        pointerEvents: 'auto'
    };

    // Label tag for selection highlighting (Bubble style)
    const SelectionLabel = () => isSelected ? (
        <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-2px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px 4px 0 0',
            zIndex: 50,
            textTransform: 'uppercase',
            fontWeight: 600,
            pointerEvents: 'none'
        }}>
            {element.type}
        </div>
    ) : null;

    const preventDefault = (e) => e.preventDefault();

    // Render children recursively
    const children = element.children?.map(childId => (
        <ElementRenderer key={childId} id={childId} />
    ));

    const contentProps = {
        onClick: handleClick,
        onMouseEnter: (e) => { e.stopPropagation(); setIsHovered(true); },
        onMouseLeave: (e) => { e.stopPropagation(); setIsHovered(false); },
        style: commonStyles,
    };

    // Combine refs
    const setRef = (node) => {
        if (isContainer) setNodeRef(node);
        elementRef.current = node;
    };

    const EmptyPlaceholder = () => (
        (element.children.length === 0 && element.type !== 'root' && !isOver) ? (
            <div style={{
                width: '100%',
                height: '100%',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#f9fafb',
                pointerEvents: 'none'
            }}>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>Empty {element.type}</span>
            </div>
        ) : null
    );

    const Handles = () => isSelected ? <ResizeHandles id={id} elementRef={elementRef} /> : null;

    // --- RENDERERS BY TYPE ---

    if (isContainer) {
        const Tag = element.type === 'form' ? 'form'
            : element.type === 'list' ? 'ul'
                : 'div';

        return (
            <Tag
                ref={setRef}
                onSubmit={preventDefault}
                {...contentProps}
            >
                <SelectionLabel />
                {children}
                <EmptyPlaceholder />
                <Handles />
            </Tag>
        );
    }

    // Interactive Wrappers - Wrap safely ref
    const Wrapper = ({ children }) => (
        <div ref={setRef} style={{ display: 'inline-block', position: 'relative', width: 'fit-content' }} {...contentProps}>
            <SelectionLabel />
            {children}
            <Handles />
        </div>
    );

    if (element.type === 'input') return <Wrapper><input readOnly value={element.content} placeholder="Input" style={{ width: '100%', border: 'none', background: 'transparent' }} /></Wrapper>;
    if (element.type === 'button') return <Wrapper><button onClick={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }}>{element.content}</button></Wrapper>;
    if (element.type === 'textarea') return <Wrapper><textarea readOnly value={element.content} style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none' }} /></Wrapper>;

    // Simple elements
    if (element.type === 'heading') return <h1 ref={setRef} {...contentProps}><SelectionLabel />{element.content}<Handles /></h1>;
    if (element.type === 'text') return <p ref={setRef} {...contentProps}><SelectionLabel />{element.content}<Handles /></p>;
    if (element.type === 'image') return <div ref={setRef} {...contentProps}><SelectionLabel /><img src={element.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><Handles /></div>;

    // Default fallthrough
    return (
        <div ref={setRef} {...contentProps}>
            <SelectionLabel />
            {element.content || element.type}
            <Handles />
        </div>
    );
};

export default DesignCanvas;
