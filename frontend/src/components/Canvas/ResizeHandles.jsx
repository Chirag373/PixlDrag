import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { RefreshCw, RotateCw } from 'lucide-react';

const ResizeHandles = ({ id, elementRef }) => {
    const { updateElementStyle, elements } = useBuilder();
    const element = elements[id];
    const [isResizing, setIsResizing] = useState(false);

    const dragStartRef = useRef(null);

    useEffect(() => {
        if (isResizing) {
            const handleMouseMove = (e) => {
                if (!dragStartRef.current) return;

                const {
                    startX, startY,
                    startWidth, startHeight,
                    type,
                    centerX, centerY
                } = dragStartRef.current;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                if (type === 'rotate') {
                    const x = e.clientX - centerX;
                    const y = e.clientY - centerY;
                    const deg = Math.atan2(y, x) * (180 / Math.PI) + 90;
                    updateElementStyle(id, 'transform', `rotate(${deg}deg)`);
                    return;
                }

                // Resizing Logic
                let newWidth = startWidth;
                let newHeight = startHeight;

                if (type.includes('right')) newWidth = Math.max(20, startWidth + deltaX);
                if (type.includes('left')) newWidth = Math.max(20, startWidth - deltaX);
                if (type.includes('bottom')) newHeight = Math.max(20, startHeight + deltaY);
                if (type.includes('top')) newHeight = Math.max(20, startHeight - deltaY);

                if (type.includes('width')) updateElementStyle(id, 'width', `${newWidth}px`);
                if (type.includes('height')) updateElementStyle(id, 'height', `${newHeight}px`);

                // For corner resizing, we update both if applicable
                if (['ne', 'nw', 'se', 'sw'].includes(type) || type.includes('-')) {
                    if (type.includes('right') || type.includes('left')) updateElementStyle(id, 'width', `${newWidth}px`);
                    if (type.includes('bottom') || type.includes('top')) updateElementStyle(id, 'height', `${newHeight}px`);
                }
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                dragStartRef.current = null;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, id, updateElementStyle]);

    const handleMouseDown = (e, type) => {
        e.stopPropagation();
        e.preventDefault();
        if (!elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();

        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
            type,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };

        setIsResizing(true);
        document.body.style.userSelect = 'none';
    };

    const handleStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: '#fff',
        border: '1px solid #3b82f6',
        zIndex: 51,
        pointerEvents: 'auto'
    };

    const cornerHandleStyle = {
        ...handleStyle,
        width: '12px',
        height: '12px',
    };

    const rotateHandleStyle = {
        position: 'absolute',
        width: '16px',
        height: '16px',
        backgroundColor: '#fff',
        border: '1px solid #3b82f6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        zIndex: 52,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };


    return (
        <>
            {/* Border Overlay */}
            <div style={{ position: 'absolute', inset: -1, border: '1px solid #3b82f6', pointerEvents: 'none', zIndex: 50 }} />

            {/* --- Resize Handles (Corners) --- */}
            {/* Top-Left */}
            <div onMouseDown={(e) => handleMouseDown(e, 'nw-resize')} style={{ ...cornerHandleStyle, top: '-6px', left: '-6px', cursor: 'nw-resize' }} />
            {/* Top-Right */}
            <div onMouseDown={(e) => handleMouseDown(e, 'ne-resize')} style={{ ...cornerHandleStyle, top: '-6px', right: '-6px', cursor: 'ne-resize' }} />
            {/* Bottom-Left */}
            <div onMouseDown={(e) => handleMouseDown(e, 'sw-resize')} style={{ ...cornerHandleStyle, bottom: '-6px', left: '-6px', cursor: 'sw-resize' }} />
            {/* Bottom-Right */}
            <div onMouseDown={(e) => handleMouseDown(e, 'se-resize')} style={{ ...cornerHandleStyle, bottom: '-6px', right: '-6px', cursor: 'se-resize' }} />

            {/* --- Resize Handles (Sides) --- */}
            <div onMouseDown={(e) => handleMouseDown(e, 'top-height')} style={{ ...handleStyle, top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '6px', cursor: 'ns-resize' }} />
            <div onMouseDown={(e) => handleMouseDown(e, 'bottom-height')} style={{ ...handleStyle, bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '6px', cursor: 'ns-resize' }} />
            <div onMouseDown={(e) => handleMouseDown(e, 'left-width')} style={{ ...handleStyle, left: '-5px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '20px', cursor: 'ew-resize' }} />
            <div onMouseDown={(e) => handleMouseDown(e, 'right-width')} style={{ ...handleStyle, right: '-5px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '20px', cursor: 'ew-resize' }} />

            {/* --- Rotation Handles (Corners Offset) --- */}
            <div onMouseDown={(e) => handleMouseDown(e, 'rotate')} style={{ ...rotateHandleStyle, top: '-25px', left: '-25px' }}><RefreshCw size={10} color="#3b82f6" /></div>
            <div onMouseDown={(e) => handleMouseDown(e, 'rotate')} style={{ ...rotateHandleStyle, top: '-25px', right: '-25px' }}><RefreshCw size={10} color="#3b82f6" /></div>
            <div onMouseDown={(e) => handleMouseDown(e, 'rotate')} style={{ ...rotateHandleStyle, bottom: '-25px', left: '-25px' }}><RefreshCw size={10} color="#3b82f6" /></div>
            <div onMouseDown={(e) => handleMouseDown(e, 'rotate')} style={{ ...rotateHandleStyle, bottom: '-25px', right: '-25px' }}><RefreshCw size={10} color="#3b82f6" /></div>
        </>
    );
};

export default ResizeHandles;
