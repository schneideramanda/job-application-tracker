'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

type Tabs = 'organize' | 'hired' | 'boards';

type TabData = {
  key: Tabs;
  title: string;
  image: string;
};

export default function ImageTabs() {
  const [activeTab, setActiveTab] = useState<Tabs>('organize');

  const tabs: TabData[] = [
    { key: 'organize', title: 'Organize Applications', image: '/hero-images/hero1.png' },
    { key: 'hired', title: 'Get Hired', image: '/hero-images/hero2.png' },
    { key: 'boards', title: 'Manage Boards', image: '/hero-images/hero3.png' },
  ];

  const activeTabData = tabs.find(tab => tab.key === activeTab) ?? tabs[0];

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2 justify-center mb-8">
            {/* Tabs */}
            {tabs.map(({ key, title }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === key ? 'bg-primary' : 'bg-secondary text-muted-foreground'}`}>
                {title}
              </Button>
            ))}
          </div>
          {/* Images */}
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-border shadow-xl">
            <Image src={activeTabData.image} alt={activeTabData.title} width={1200} height={800} />
          </div>
        </div>
      </div>
    </section>
  );
}
