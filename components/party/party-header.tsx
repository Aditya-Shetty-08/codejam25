"use client";

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PartyHeaderProps {
  party: {
    name: string | null;
    slug: string;
    status: string;
  };
}

export function PartyHeader({ party }: PartyHeaderProps) {
  const [copied, setCopied] = useState(false);
  const partyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/party/${party.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(partyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">
        {party.name || 'Movie Party'}
      </h1>
      <div className="flex items-center gap-2">
        <code className="px-2 py-1 bg-gray-100 rounded text-sm">{partyUrl}</code>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

