"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MemberListProps {
  members: Array<{
    id: string;
    user_id: string;
    role: 'host' | 'member';
    has_submitted_preferences: boolean;
    has_completed_swiping: boolean;
    swipes_completed: number;
  }>;
  totalMovies?: number;
}

export function MemberList({ members, totalMovies = 10 }: MemberListProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {member.role === 'host' ? '👑 Host' : 'Member'}
                </span>
                {member.has_submitted_preferences && (
                  <Badge variant="outline" className="text-xs">
                    Preferences ✓
                  </Badge>
                )}
                {member.has_completed_swiping && (
                  <Badge variant="outline" className="text-xs">
                    Done ✓
                  </Badge>
                )}
              </div>
              {member.swipes_completed > 0 && (
                <span className="text-sm text-gray-600">
                  {member.swipes_completed}/{totalMovies} swipes
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

