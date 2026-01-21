import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Box } from 'lucide-react';

const PropertiesPanel = () => {
    const { elements, selectedId, updateElementStyle, updateElementContent } = useBuilder();
    const selectedElement = selectedId ? elements[selectedId] : null;

    if (!selectedElement) {
        return (
            <div style={{
                width: '280px',
                backgroundColor: 'var(--bg-panel)',
                borderLeft: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '14px',
                height: '100%'
            }}>
                Select an element to edit
            </div>
        );
    }

    const { type, styles, content } = selectedElement;

    return (
        <div style={{
            width: '280px',
            backgroundColor: 'var(--bg-panel)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto'
        }}>
            <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600
            }}>
                <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)'
                }} />
                {type.charAt(0).toUpperCase() + type.slice(1)} Settings
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Layout Section */}
                <PropertySection title="Layout" icon={<Box size={14} />}>
                    <PropertyRow label="Width">
                        <input
                            type="text"
                            value={styles.width || 'auto'}
                            onChange={(e) => updateElementStyle(selectedId, 'width', e.target.value)}
                        />
                    </PropertyRow>
                    <PropertyRow label="Height">
                        <input
                            type="text"
                            value={styles.height || 'auto'}
                            onChange={(e) => updateElementStyle(selectedId, 'height', e.target.value)}
                        />
                    </PropertyRow>
                    <PropertyRow label="Padding">
                        <input
                            type="text"
                            value={styles.padding || '0px'}
                            onChange={(e) => updateElementStyle(selectedId, 'padding', e.target.value)}
                        />
                    </PropertyRow>
                    <PropertyRow label="Display">
                        <select
                            value={styles.display || 'block'}
                            onChange={(e) => updateElementStyle(selectedId, 'display', e.target.value)}
                        >
                            <option value="block">Block</option>
                            <option value="flex">Flex</option>
                            <option value="grid">Grid</option>
                            <option value="inline-block">Inline Block</option>
                        </select>
                    </PropertyRow>
                    {styles.display === 'flex' && (
                        <PropertyRow label="Direction">
                            <select
                                value={styles.flexDirection || 'row'}
                                onChange={(e) => updateElementStyle(selectedId, 'flexDirection', e.target.value)}
                            >
                                <option value="row">Row</option>
                                <option value="column">Column</option>
                            </select>
                        </PropertyRow>
                    )}
                </PropertySection>

                {/* Typography Section (if text) */}
                {(type === 'text' || type === 'button') && (
                    <PropertySection title="Typography" icon={<Type size={14} />}>
                        <PropertyRow label="Content">
                            <textarea
                                value={content || ''}
                                onChange={(e) => updateElementContent(selectedId, e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-panel-hover)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                    minHeight: '60px'
                                }}
                            />
                        </PropertyRow>
                        <PropertyRow label="Font Size">
                            <input
                                type="text"
                                value={styles.fontSize || '16px'}
                                onChange={(e) => updateElementStyle(selectedId, 'fontSize', e.target.value)}
                            />
                        </PropertyRow>
                        <PropertyRow label="Color">
                            <input
                                type="color"
                                value={styles.color || '#000000'}
                                onChange={(e) => updateElementStyle(selectedId, 'color', e.target.value)}
                                style={{ padding: '0', height: '30px' }}
                            />
                        </PropertyRow>
                        <PropertyRow label="Align">
                            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-panel-hover)', borderRadius: '4px', padding: '2px' }}>
                                <AlignButton align="left" current={styles.textAlign} onClick={(v) => updateElementStyle(selectedId, 'textAlign', v)} />
                                <AlignButton align="center" current={styles.textAlign} onClick={(v) => updateElementStyle(selectedId, 'textAlign', v)} />
                                <AlignButton align="right" current={styles.textAlign} onClick={(v) => updateElementStyle(selectedId, 'textAlign', v)} />
                            </div>
                        </PropertyRow>
                    </PropertySection>
                )}

                {/* Style Section */}
                <PropertySection title="Appearance" icon={<PaintBucket size={14} />}>
                    <PropertyRow label="Background">
                        <input
                            type="color"
                            value={styles.backgroundColor || 'transparent'}
                            onChange={(e) => updateElementStyle(selectedId, 'backgroundColor', e.target.value)}
                            style={{ padding: '0', height: '30px' }}
                        />
                    </PropertyRow>
                    <PropertyRow label="Border Radius">
                        <input
                            type="text"
                            value={styles.borderRadius || '0px'}
                            onChange={(e) => updateElementStyle(selectedId, 'borderRadius', e.target.value)}
                        />
                    </PropertyRow>
                </PropertySection>

            </div>
        </div>
    );
};

const PropertySection = ({ title, icon, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
            {icon}
            {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {children}
        </div>
    </div>
);

const PropertyRow = ({ label, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</label>
        {children}
    </div>
);

const AlignButton = ({ align, current, onClick }) => (
    <button
        onClick={() => onClick(align)}
        style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '2px',
            backgroundColor: current === align ? 'var(--bg-panel)' : 'transparent',
            color: current === align ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}
    >
        {align === 'left' && <AlignLeft size={14} />}
        {align === 'center' && <AlignCenter size={14} />}
        {align === 'right' && <AlignRight size={14} />}
    </button>
);

export default PropertiesPanel;
