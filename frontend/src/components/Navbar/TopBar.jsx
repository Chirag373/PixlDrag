import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import {
    Monitor, Tablet, Smartphone,
    Settings, Eye, Share2,
    Download, Plus, Palette, Type, Layout
} from 'lucide-react';

const TopBar = () => {
    const { viewDevice, setViewDevice } = useBuilder();

    return (
        <div style={{
            height: '56px',
            backgroundColor: 'var(--bg-panel)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            color: 'var(--text-primary)'
        }}>
            {/* Left: Project Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '18px' }}>PixlDrag</div>
                <div style={{
                    fontSize: '12px',
                    backgroundColor: '#3b82f6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 500
                }}>BETA</div>
            </div>

            {/* Center: Device Controls */}
            <div style={{
                display: 'flex',
                gap: '4px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px',
                borderRadius: '6px'
            }}>
                <DeviceButton
                    active={viewDevice === 'desktop'}
                    onClick={() => setViewDevice('desktop')}
                    icon={<Monitor size={18} />}
                    label="Desktop"
                />
                <DeviceButton
                    active={viewDevice === 'tablet'}
                    onClick={() => setViewDevice('tablet')}
                    icon={<Tablet size={18} />}
                    label="Tablet"
                />
                <DeviceButton
                    active={viewDevice === 'mobile'}
                    onClick={() => setViewDevice('mobile')}
                    icon={<Smartphone size={18} />}
                    label="Mobile"
                />
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <ActionButton icon={<Eye size={18} />} label="Preview" />
                <ActionButton icon={<Share2 size={18} />} label="Publish" primary />
            </div>
        </div>
    );
};

const DeviceButton = ({ active, onClick, icon }) => (
    <button
        onClick={onClick}
        style={{
            padding: '6px 10px',
            borderRadius: '4px',
            backgroundColor: active ? 'var(--bg-panel-hover)' : 'transparent',
            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        {icon}
    </button>
);

const ActionButton = ({ icon, label, primary }) => (
    <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: primary ? 'var(--accent-primary)' : 'var(--bg-panel-hover)',
        color: primary ? '#fff' : 'var(--text-primary)',
        border: primary ? 'none' : '1px solid var(--border-color)',
        transition: 'all 0.2s'
    }}>
        {icon}
        <span>{label}</span>
    </button>
);

export default TopBar;
