export interface MockUser {
  id: string;
  name: string;
  age: number;
  profileImageUrl: string;
  interests: string[];
  university: string;
  profession: string;
  checkedInAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "Elif",
    age: 27,
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["cocktails", "music"],
    university: "ODTÜ",
    profession: "Marketing",
    checkedInAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Can",
    age: 29,
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["music", "dancing"],
    university: "Galatasaray",
    profession: "Software Dev",
    checkedInAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "user-3",
    name: "Zeynep",
    age: 25,
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["cocktails", "rooftop"],
    university: "İTÜ",
    profession: "Designer",
    checkedInAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "user-4",
    name: "Mert",
    age: 31,
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["craft-beer", "live-music"],
    university: "Boğaziçi",
    profession: "Finance",
    checkedInAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "user-5",
    name: "Selin",
    age: 26,
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["dancing", "karaoke"],
    university: "Mimar Sinan",
    profession: "Artist",
    checkedInAt: new Date().toISOString(),
  },
  {
    id: "user-6",
    name: "Arda",
    age: 28,
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    interests: ["music", "live-music"],
    university: "Bilgi",
    profession: "Musician",
    checkedInAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
];

export const getInterestEmoji = (interest: string): string => {
  const emojiMap: Record<string, string> = {
    cocktails: "🍸",
    music: "🎵",
    dancing: "💃",
    "live-music": "🎵",
    "craft-beer": "🍻",
    karaoke: "🎤",
    rooftop: "🌃",
    underground: "🌊",
    casual: "😎",
  };
  return emojiMap[interest] || "🎉";
};

export const getTimeAgo = (checkedInAt: string): string => {
  const now = Date.now();
  const checkedIn = new Date(checkedInAt).getTime();
  const diffMinutes = Math.floor((now - checkedIn) / (1000 * 60));
  
  if (diffMinutes < 1) return "Just checked in";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export const getTimeColor = (checkedInAt: string): string => {
  const now = Date.now();
  const checkedIn = new Date(checkedInAt).getTime();
  const diffMinutes = Math.floor((now - checkedIn) / (1000 * 60));
  
  if (diffMinutes < 10) return "text-green-400";
  if (diffMinutes < 60) return "text-yellow-400";
  return "text-gray-400";
};
