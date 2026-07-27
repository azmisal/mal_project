export const REFERRAL_SOURCES = [
  "facebook",
  "instagram",
  "tiktok",
  "google_search",
  "friend_family",
  "whatsapp_group",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  google_search: "Google Search",
  friend_family: "Friend or Family",
  whatsapp_group: "WhatsApp Group",
  other: "Other",
};

export const MARKETS = ["pakistan"] as const;
export type Market = (typeof MARKETS)[number];