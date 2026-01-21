import React, { createContext, useContext, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

const BuilderContext = createContext(null);

export const useBuilder = () => useContext(BuilderContext);

const initialElements = {
    'root': {
        id: 'root',
        type: 'container',
        styles: {
            width: '100%',
            minHeight: '100%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            gap: '12px'
        },
        children: []
    }
};

export const BuilderProvider = ({ children }) => {
    const [elements, setElements] = useState(initialElements);
    const [selectedId, setSelectedId] = useState(null);
    const [viewDevice, setViewDevice] = useState('desktop');

    const addElement = useCallback((type, parentId = 'root') => {
        const newId = nanoid();
        const newElement = {
            id: newId,
            type,
            styles: getDefaultStyles(type),
            content: getDefaultContent(type),
            children: []
        };

        setElements(prev => {
            const parent = prev[parentId];
            if (!parent) return prev;

            return {
                ...prev,
                [parentId]: {
                    ...parent,
                    children: [...parent.children, newId]
                },
                [newId]: newElement
            };
        });

        setSelectedId(newId);
    }, []);

    const updateElementStyle = useCallback((id, styleProp, value) => {
        setElements(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                styles: {
                    ...prev[id].styles,
                    [styleProp]: value
                }
            }
        }));
    }, []);

    const updateElementContent = useCallback((id, content) => {
        setElements(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                content
            }
        }));
    }, []);

    const selectElement = useCallback((id) => {
        setSelectedId(id);
    }, []);

    return (
        <BuilderContext.Provider value={{
            elements,
            selectedId,
            viewDevice,
            setViewDevice,
            addElement,
            updateElementStyle,
            updateElementContent,
            selectElement
        }}>
            {children}
        </BuilderContext.Provider>
    );
};

const getDefaultStyles = (type) => {
    const base = { boxSizing: 'border-box' };

    switch (type) {
        // Structure
        case 'container':
        case 'form':
            return { ...base, display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px', border: '1px dashed #e5e7eb', minHeight: '80px', width: '100%' };
        case 'section':
            return { ...base, width: '100%', padding: '40px 20px', backgroundColor: 'transparent' };
        case 'row':
            return { ...base, display: 'flex', flexDirection: 'row', width: '100%', gap: '16px', minHeight: '50px' };
        case 'column':
            return { ...base, display: 'flex', flexDirection: 'column', flex: 1, padding: '8px', border: '1px dotted #ccc', minHeight: '50px' };
        case 'grid':
            return { ...base, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%', minHeight: '100px' };

        // Typography
        case 'heading':
            return { ...base, fontSize: '32px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0', lineHeight: 1.2 };
        case 'text':
        case 'richtext':
            return { ...base, fontSize: '16px', color: '#374151', lineHeight: 1.5, margin: '0 0 10px 0' };
        case 'link':
            return { ...base, color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' };
        case 'label':
            return { ...base, fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' };

        // Forms
        case 'input':
            return { ...base, width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', outline: 'none' };
        case 'textarea':
            return { ...base, width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '100px', resize: 'vertical' };
        case 'select':
            return { ...base, width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' };
        case 'checkbox':
            return { ...base, width: '16px', height: '16px', margin: '0 8px 0 0', cursor: 'pointer' };
        case 'radio':
            return { ...base, width: '16px', height: '16px', margin: '0 8px 0 0', cursor: 'pointer', borderRadius: '50%' };

        // Interactive
        case 'button':
            return { ...base, padding: '10px 24px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px' };

        // Media
        case 'image':
            return { ...base, width: '100%', height: 'auto', borderRadius: '0px', display: 'block' };
        case 'video-embed':
            return { ...base, width: '100%', height: 'auto', aspectRatio: '16/9', backgroundColor: '#000' };
        case 'youtube':
            return { ...base, width: '100%', aspectRatio: '16/9', border: 'none' };
        case 'list':
            return { ...base, paddingLeft: '20px', margin: '0 0 16px 0', listStyleType: 'disc' };

        default:
            return base;
    }
};

const getDefaultContent = (type) => {
    switch (type) {
        case 'heading': return 'Heading Text';
        case 'text': return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';
        case 'richtext': return 'Rich text block content...';
        case 'link': return 'Click Here';
        case 'button': return 'Submit';
        case 'label': return 'Field Label';
        case 'input': return '';
        case 'textarea': return '';
        case 'image': return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80';
        case 'youtube': return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        default: return '';
    }
};
