import React from 'react';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { useBuilder } from '../../context/BuilderContext';
import TopBar from '../Navbar/TopBar';
import Toolbox from '../Sidebar/Toolbox';
import PropertiesPanel from '../Properties/PropertiesPanel';
import DesignCanvas from '../Canvas/DesignCanvas';
import { createPortal } from 'react-dom';

const MainLayout = () => {
    const { addElement } = useBuilder();
    const [activeDragItem, setActiveDragItem] = React.useState(null);

    const handleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        setActiveDragItem(null);

        // If dropped over a valid drop zone
        if (over && over.id) {
            const type = active.data.current?.type;
            if (type) {
                // over.id is the ID of the container we dropped onto
                addElement(type, over.id);
            }
        }
    };

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={pointerWithin}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
                <TopBar />
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <Toolbox />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <DesignCanvas />
                    </div>
                    <PropertiesPanel />
                </div>
            </div>

            {createPortal(
                <DragOverlay>
                    {activeDragItem ? (
                        <div style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--bg-panel)',
                            border: '1px solid var(--accent-primary)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            {activeDragItem.type}
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}

        </DndContext>
    );
};

export default MainLayout;
