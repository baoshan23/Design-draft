'use client';

import { useState, ReactNode, Children, isValidElement } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  children: ReactNode;
}

export default function TabSwitcher({ tabs, children }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  const panels = Children.toArray(children).filter(isValidElement);

  return (
    <>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {panels.map((panel) => {
        const id = (panel.props as { id?: string }).id;
        return (
          <div
            key={id}
            className="tab-content"
            style={{ display: id === activeTab ? 'block' : 'none' }}
          >
            {panel}
          </div>
        );
      })}
    </>
  );
}
