"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PartyResultsProps {
  partySlug: string;
}

export function PartyResults({ partySlug }: PartyResultsProps) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [partySlug]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/party/${partySlug}/results`);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const { rankings: rankingsData } = await response.json();
      setRankings(rankingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading results...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-red-600">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Rankings 🏆</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankings.map((movie, index) => (
            <div
              key={movie.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400 w-8">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{movie.title}</h3>
                  <div className="flex gap-2 mt-1">
                    {movie.genres.map((genre: string) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {Math.round(movie.elo_rating)}
                </div>
                <div className="text-sm text-gray-600">ELO Rating</div>
                <div className="text-xs text-gray-500 mt-1">
                  {movie.right_swipes} likes, {movie.left_swipes} passes
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

