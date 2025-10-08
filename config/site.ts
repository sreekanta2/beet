import avatar from "@/public/images/doctor.png";
import femaleAvatar from "@/public/images/female-doctor.png";
import facebook from "@/public/images/social/facebook-1.png";
import linkedin from "@/public/images/social/linkedin-1.png";
import twitter from "@/public/images/social/twitter-1.png";
import youtube from "@/public/images/social/youtube.png";
export { avatar, femaleAvatar };
export const siteConfig = {
  sidebarBg: "none",
  siteName: "MRK",
  name: "MRK247Earning ",
  url: `${process.env.NEXT_PUBLIC_API_URL || ""}`,
  description: "Show ads and earn money.",
  author: "MRK247Earning Team",

  // SEO Enhancements
  googleSiteVerification: "ABC123XYZ",
  googleAnalyticsId: "G-XXXXXXXXXX",
  ahrefsVerification: "12345abcde",

  // Content
  keywords: [
    "find doctors",
    "book doctor appointment",
    "healthcare providers",
    "medical specialists",
    "doctor ratings",
  ],

  // Social & Images
  twitterHandle: "@DoccareApp",
  ogImage: `/assets/logo.png`,
  logo: `/assets/logos.jpeg`,

  // Contact Information
  contact: {
    phone: "+8801737813575",
    email: "support@Doccare.com",
  },

  socialLinks: [
    { name: "Facebook", url: "https://facebook.com/Doccare" },
    { name: "Twitter", url: "https://twitter.com/DoccareApp" },
    { name: "Instagram", url: "https://instagram.com/DoccareApp" },
    { name: "LinkedIn", url: "https://linkedin.com/company/Doccare" },
  ],
};
export const socials = [
  {
    icon: facebook,
    href: "https://www.facebook.com",
  },
  {
    icon: linkedin,
    href: "https://www.linkedin.com/",
  },
  {
    icon: youtube,
    href: "https://www.youtube.com",
  },
  {
    icon: twitter,
    href: "https://twitter.com",
  },
];
