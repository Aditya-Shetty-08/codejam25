"use client";

interface PartyStatusBannerProps {
  party: {
    status: string;
  };
}

const statusConfig = {
  waiting: {
    label: 'Waiting for Members',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  collecting_preferences: {
    label: 'Collecting Preferences',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  swiping: {
    label: 'Swiping in Progress',
    color: 'bg-green-50 border-green-200 text-green-800',
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-50 border-gray-200 text-gray-800',
  },
};

export function PartyStatusBanner({ party }: PartyStatusBannerProps) {
  const config = statusConfig[party.status as keyof typeof statusConfig] || statusConfig.waiting;

  return (
    <div className={`mb-4 p-3 rounded-lg border ${config.color}`}>
      <p className="font-semibold">{config.label}</p>
    </div>
  );
}

