"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagInput } from '@/components/tagInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LANGUAGES = ['English', 'German', 'French', 'Spanish', 'Bengali', 'Hindi', 'Korean', 'Japanese', 'Chinese', 'Arabic', 'Russian', 'Portuguese', 'Italian'];

interface PreferenceFormProps {
  partySlug: string;
  hasSubmitted: boolean;
  onSubmitted: () => void;
}

export function PreferenceForm({ partySlug, hasSubmitted, onSubmitted }: PreferenceFormProps) {
  const [genreTags, setGenreTags] = useState<string[]>([]);
  const [languageTags, setLanguageTags] = useState<string[]>([]);
  const [songs, setSongs] = useState('');
  const [ageRating, setAgeRating] = useState('');
  const [era, setEra] = useState('');
  const [spotifyUrls, setSpotifyUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user ID
      const { getUserId } = await import('@/lib/party/session');
      const userId = await getUserId();

      // Build preferences object
      const preferences: Record<string, string[]> = {};
      
      if (genreTags.length > 0) {
        preferences.preferredGenres = genreTags;
      }
      if (languageTags.length > 0) {
        preferences.preferredLanguages = languageTags;
      }
      if (ageRating) {
        preferences.preferredAgeRating = [ageRating];
      }
      if (era) {
        preferences.preferredEra = [era];
      }

      // Parse Spotify URLs from songs input
      const urls = songs
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('https://open.spotify.com/track/'));

      const response = await fetch(`/api/party/${partySlug}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit-preferences',
          preferences,
          spotifyUrls: urls.length > 0 ? urls : undefined,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit preferences');
      }

      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit preferences');
    } finally {
      setLoading(false);
    }
  };

  if (hasSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferences Submitted ✓</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Waiting for other members to submit their preferences...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Preferred Genres</Label>
            <TagInput tags={genreTags} onTagsChange={setGenreTags} />
          </div>

          <div className="space-y-2">
            <Label>Spotify Song URLs (one per line)</Label>
            <textarea
              value={songs}
              onChange={(e) => setSongs(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="w-full min-h-[100px] p-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <Label>Age Rating</Label>
            <Select value={ageRating} onValueChange={setAgeRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select age rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Age Ratings</SelectLabel>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                  <SelectItem value="PG-13">PG-13</SelectItem>
                  <SelectItem value="R">R</SelectItem>
                  <SelectItem value="NC-17">NC-17</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Languages</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((language) => {
                const isSelected = languageTags.includes(language);
                return (
                  <Button
                    key={language}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (!isSelected) {
                        setLanguageTags([...languageTags, language]);
                      } else {
                        setLanguageTags(languageTags.filter(t => t !== language));
                      }
                    }}
                  >
                    {language}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Era</Label>
            <Select value={era} onValueChange={setEra}>
              <SelectTrigger>
                <SelectValue placeholder="Select era" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Eras</SelectLabel>
                  <SelectItem value="1950s">1950s</SelectItem>
                  <SelectItem value="1960s">1960s</SelectItem>
                  <SelectItem value="1970s">1970s</SelectItem>
                  <SelectItem value="1980s">1980s</SelectItem>
                  <SelectItem value="1990s">1990s</SelectItem>
                  <SelectItem value="2000s">2000s</SelectItem>
                  <SelectItem value="2010s">2010s</SelectItem>
                  <SelectItem value="2020s">2020s</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

