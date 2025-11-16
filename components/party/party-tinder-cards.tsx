"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { TinderCards } from '@/components/tinder-cards';
import { moviesToCardData } from '@/lib/elo_rating/movieToCardData';
import { subscribeToParty, unsubscribeFromParty } from '@/lib/party/realtime';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PartyTinderCardsProps {
  partySlug: string;
  onComplete: () => void;
}

export function PartyTinderCards({ partySlug, onComplete }: PartyTinderCardsProps) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipedMovies, setSwipedMovies] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const swipingInProgress = useRef<Set<string>>(new Set()); // Track swipes currently being processed

  // Fetch movies
  useEffect(() => {
    fetchMovies();
  }, [partySlug]);

  // Set up realtime for movie updates
  useEffect(() => {
    if (!movies.length) return;

    // Get party ID from first movie
    const partyId = movies[0]?.party_id;
    if (!partyId) return;

    const ch = subscribeToParty(partyId, {
      onMovieUpdate: (updatedMovie) => {
        setMovies((prev) =>
          prev.map((m) =>
            m.movie_id === updatedMovie.movie_id ? updatedMovie : m
          )
        );
      },
    });

    setChannel(ch);

    return () => {
      if (ch) {
        unsubscribeFromParty(ch);
      }
    };
  }, [movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/party/${partySlug}/movies`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const { movies: moviesData } = await response.json();
      
      // Convert to Movie format for TinderCards
      const convertedMovies = moviesData.map((m: any) => ({
        id: m.movie_id,
        title: m.title,
        genres: m.genres,
        expected_score: Number(m.expected_score),
      }));

      setMovies(convertedMovies);

      // Get user's existing swipes
      const { getUserId } = await import('@/lib/party/session');
      const userId = await getUserId();
      
      const swipesRes = await fetch(`/api/party/${partySlug}/swipes?userId=${encodeURIComponent(userId)}`);
      if (swipesRes.ok) {
        const { swipes } = await swipesRes.json();
        setSwipedMovies(new Set(swipes.map((s: any) => s.movie_id)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (cardId: string | undefined, direction: 'right' | 'left') => {
    if (!cardId) return;

    // Don't swipe if already swiped OR if currently being processed
    if (swipedMovies.has(cardId) || swipingInProgress.current.has(cardId)) {
      console.log('[SWIPE] Skipping - already swiped or in progress:', cardId);
      return;
    }

    // Mark as in progress to prevent duplicate calls
    swipingInProgress.current.add(cardId);

    // Optimistically update UI to prevent double swipes
    const newSwipedSet = new Set([...swipedMovies, cardId]);
    setSwipedMovies(newSwipedSet);

    try {
      const { getUserId } = await import('@/lib/party/session');
      const userId = await getUserId();
      
      const response = await fetch(`/api/party/${partySlug}/swipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: cardId,
          direction,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // If swipe already exists, that's okay - just log it
        if (data.error && data.error.includes('already recorded')) {
          console.log('Swipe already recorded (this is fine)');
          // Check if all movies swiped (using the new set)
          if (newSwipedSet.size >= movies.length) {
            onComplete();
          }
          // Remove from in-progress set
          swipingInProgress.current.delete(cardId);
          return;
        }
        // Revert optimistic update on other errors
        setSwipedMovies(swipedMovies);
        // Remove from in-progress set
        swipingInProgress.current.delete(cardId);
        throw new Error(data.error || 'Failed to record swipe');
      }

      // Check if all movies swiped (using the new set)
      if (newSwipedSet.size >= movies.length) {
        onComplete();
      }

      // Remove from in-progress set after successful swipe
      swipingInProgress.current.delete(cardId);
    } catch (err) {
      console.error('Error recording swipe:', err);
      // Revert optimistic update on error
      setSwipedMovies((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
      // Remove from in-progress set
      swipingInProgress.current.delete(cardId);
    }
  };

  const cardsData = useMemo(() => {
    if (movies.length === 0) return [];
    
    // Filter out already swiped movies
    const unswipedMovies = movies.filter(m => !swipedMovies.has(m.id));
    return moviesToCardData(unswipedMovies);
  }, [movies, swipedMovies]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading movies...</p>
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

  if (movies.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>No movies available. The host needs to generate movies first.</p>
        </CardContent>
      </Card>
    );
  }

  const remainingCount = movies.length - swipedMovies.size;

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            Swipe through movies ({remainingCount} remaining)
          </CardTitle>
        </CardHeader>
      </Card>

      {remainingCount > 0 ? (
        <TinderCards
          cardsData={cardsData}
          onSwipe={handleSwipe}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg font-semibold mb-2">All done! 🎉</p>
            <p className="text-gray-600">
              Waiting for other members to finish swiping...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

