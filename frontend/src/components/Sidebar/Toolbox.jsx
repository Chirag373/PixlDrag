import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
    Type, Image as ImageIcon, Box, Layout,
    Columns, PlayCircle, FormInput, Heading,
    List, CheckSquare, AlignLeft, Link,
    MousePointer2, Grid, Video,
    ToggleLeft, ListOrdered, ChevronDown, ChevronRight,
    Search, SlidersHorizontal, Settings
} from 'lucide-react';

const Toolbox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        structure: true,
        typography: true,
        forms: true,
        media: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div style={{
            width: '280px',
            backgroundColor: '#1a1d23',
            borderRight: '1px solid #2a2e37',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            color: '#e5e7eb',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #2a2e37' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Add Elements</span>
                    <Settings size={14} style={{ cursor: 'pointer', opacity: 0.7 }} />
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            backgroundColor: '#22262e',
                            border: '1px solid #374151',
                            borderRadius: '4px',
                            padding: '8px 8px 8px 32px',
                            color: '#d1d5db',
                            fontSize: '12px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Elements List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 20px 0' }} className="custom-scrollbar">

                <ToolboxSection
                    title="Structure"
                    id="structure"
                    expanded={expandedSections.structure}
                    onToggle={() => toggleSection('structure')}
                >
                    <ToolboxItem type="section" icon={<Layout size={16} />} label="Section" />
                    <ToolboxItem type="container" icon={<Box size={16} />} label="Container" />
                    <ToolboxItem type="grid" icon={<Grid size={16} />} label="Grid" />
                    <ToolboxItem type="row" icon={<Columns size={16} />} label="Columns" />
                    <ToolboxItem type="div" icon={<Box size={16} />} label="Div Block" />
                </ToolboxSection>

                <ToolboxSection
                    title="Typography"
                    id="typography"
                    expanded={expandedSections.typography}
                    onToggle={() => toggleSection('typography')}
                >
                    <ToolboxItem type="heading" icon={<Heading size={16} />} label="Heading" />
                    <ToolboxItem type="text" icon={<Type size={16} />} label="Paragraph" />
                    <ToolboxItem type="link" icon={<Link size={16} />} label="Text Link" />
                    <ToolboxItem type="richtext" icon={<AlignLeft size={16} />} label="Rich Text" />
                    <ToolboxItem type="list" icon={<List size={16} />} label="List" />
                </ToolboxSection>

                <ToolboxSection
                    title="Forms"
                    id="forms"
                    expanded={expandedSections.forms}
                    onToggle={() => toggleSection('forms')}
                >
                    <ToolboxItem type="form" icon={<Layout size={16} />} label="Form Block" />
                    <ToolboxItem type="label" icon={<Type size={16} />} label="Label" />
                    <ToolboxItem type="input" icon={<FormInput size={16} />} label="Input" />
                    <ToolboxItem type="select" icon={<ListOrdered size={16} />} label="Select" />
                    <ToolboxItem type="textarea" icon={<Type size={16} />} label="Text Area" />
                    <ToolboxItem type="checkbox" icon={<CheckSquare size={16} />} label="Checkbox" />
                    <ToolboxItem type="radio" icon={<ToggleLeft size={16} />} label="Radio" />
                    <ToolboxItem type="button" icon={<MousePointer2 size={16} />} label="Submit Button" />
                </ToolboxSection>

                <ToolboxSection
                    title="Media"
                    id="media"
                    expanded={expandedSections.media}
                    onToggle={() => toggleSection('media')}
                >
                    <ToolboxItem type="image" icon={<ImageIcon size={16} />} label="Image" />
                    <ToolboxItem type="video-embed" icon={<Video size={16} />} label="Video" />
                    <ToolboxItem type="youtube" icon={<PlayCircle size={16} />} label="YouTube" />
                    <ToolboxItem type="lottie" icon={<PlayCircle size={16} />} label="Lottie Animation" />
                </ToolboxSection>

            </div>
        </div>
    );
};

const ToolboxSection = ({ title, children, expanded, onToggle }) => (
    <div style={{ borderBottom: '1px solid #2a2e37' }}>
        <div
            onClick={onToggle}
            style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: expanded ? '#22262e' : 'transparent',
                transition: 'background-color 0.2s'
            }}
        >
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
            {expanded ? <ChevronDown size={14} color="#9ca3af" /> : <ChevronRight size={14} color="#9ca3af" />}
        </div>

        {expanded && (
            <div style={{
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                backgroundColor: '#1f2329'
            }}>
                {children}
            </div>
        )}
    </div>
);

const ToolboxItem = ({ type, icon, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `toolbox-${type}`,
        data: {
            type: type,
            isToolboxItem: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '16px 8px',
                backgroundColor: '#2a2e37',
                borderRadius: '4px',
                border: '1px solid transparent',
                cursor: 'grab',
                transition: 'all 0.2s',
                color: '#9ca3af',
                ':hover': {
                    borderColor: '#3b82f6',
                    color: '#e5e7eb',
                    backgroundColor: '#323842'
                }
            }}
            {...listeners}
            {...attributes}
            className="toolbox-item"
        >
            <div style={{ color: '#60a5fa' }}>{icon}</div>
            <span style={{ fontSize: '11px', fontWeight: 500, textAlign: 'center' }}>{label}</span>

            <style>{`
        .toolbox-item:hover {
          border-color: #4b5563 !important;
          background-color: #374151 !important;
          color: #f3f4f6 !important;
        }
      `}</style>
        </div>
    );
};

export default Toolbox;
