import { ACCOUNT_ICONS } from "@/app/utils/icons/MainLinksIcons";
import { NavLink, OptionLink } from "@/app/utils/types/MainLinks";
export const navLinks: NavLink[] = [
  {
    name: "My Ads",
    href: "/mine/my-ads",
    icon: ACCOUNT_ICONS.fiList,
    labelKey: "mine.nav.myAds",
  },
  {
    name: "Favorites",
    href: "/mine/favorites",
    icon: ACCOUNT_ICONS.fiHeart,
    labelKey: "mine.nav.favorites",
  },
  {
    name: "Saved",
    href: "/mine/saved-searches",
    icon: ACCOUNT_ICONS.fiSearch,
    labelKey: "mine.nav.saved",
  },
  {
    name: "Tickets",
    href: "/mine/TicketHistory",
    icon: ACCOUNT_ICONS.fiClock,
    labelKey: "mine.nav.tickets",
  },
  {
    name: "Settings",
    href: "/mine/settings",
    icon: ACCOUNT_ICONS.fiSettings,
    labelKey: "mine.nav.settings",
  },

  {
    name: "Badge",
    href: "/mine/StatsBadge",
    icon: ACCOUNT_ICONS.faBullhorn,
    labelKey: "mine.nav.badge",
  },
];

export const settingsOptions: OptionLink[] = [
  {
    title: "Privacy",
    description: "Maamul xogtaada iyo dejinta asturnaanta.",
    href: "/mine/settings/privacy",
    icon: ACCOUNT_ICONS.faShieldAlt,
    colorClass: "text-blue-600",
    labelKey: "mine.settings.privacy",
  },
  {
    title: "Security",
    description: "Hagaaji ilaalinta akoonkaaga iyo qalabkaaga.",
    href: "/mine/settings/security",
    icon: ACCOUNT_ICONS.faLock,
    colorClass: "text-green-600",
    labelKey: "mine.settings.security",
  },
  {
    title: "Payment",
    description: "Maamul hababka bixinta iyo taariikhda lacag bixinta.",
    href: "/mine/settings/payment",
    icon: ACCOUNT_ICONS.faCreditCard,
    colorClass: "text-gray-700",
    labelKey: "mine.settings.payment",
  },
  {
    title: "Subscription",
    description: "Maamul xogta is-qorista iyo lacag bixinta.",
    href: "/mine/settings/subscription",
    icon: ACCOUNT_ICONS.faBell,
    colorClass: "text-gray-700",
    labelKey: "mine.settings.subscription",
  },
];

export const accountOptions: OptionLink[] = [
  {
    title: "My Ads",
    description: "See all your ads and track statistics",
    href: "/mine/my-ads",
    icon: ACCOUNT_ICONS.faBullhorn,
    colorClass: "text-green-600",
    labelKey: "mine.account.myAds",
  },
  {
    title: "My Account",
    description: "View your details on KARAADI and Smartsuuq",
    href: "/mine/account",
    icon: ACCOUNT_ICONS.faUserCircle,
    colorClass: "text-blue-600",
    labelKey: "mine.account.myAccount",
  },
  {
    title: "Settings",
    description: "Manage your account settings on KARAADI",
    href: "/mine/settings",
    icon: ACCOUNT_ICONS.faCog,
    colorClass: "text-gray-700",
    labelKey: "mine.account.settings",
  },
  {
    title: "Favorites",
    description: "View all ads you like and have saved on KARAADI",
    href: "/mine/favorites",
    icon: ACCOUNT_ICONS.faHeart,
    colorClass: "text-red-500",
    labelKey: "mine.account.favorites",
  },
  {
    title: "Saved Searches",
    description: "Manage and customize your saved searches",
    href: "/mine/saved-searches",
    icon: ACCOUNT_ICONS.faSearch,
    colorClass: "text-orange-500",
    labelKey: "mine.account.savedSearches",
  },
  {
    title: "For Businesses",
    description: "View companies you have access to",
    href: "/mine/businesses",
    icon: ACCOUNT_ICONS.faBuilding,
    colorClass: "text-pink-600",
    labelKey: "mine.account.forBusinesses",
  },
  {
    title: "Contact History",
    description: "Track your support requests and messages",
    href: "/mine/TicketHistory",
    icon: ACCOUNT_ICONS.faHistory,
    colorClass: "text-pink-600",
    labelKey: "mine.account.contactHistory",
  },
  {
    title: "My Subscriptions",
    description: "Manage your subscriptions and payment plans",
    href: "/mine/my-subscription",
    icon: ACCOUNT_ICONS.faBell,
    colorClass: "text-yellow-500",
    labelKey: "mine.account.mySubscriptions",
  },
  {
    title: "Badge",
    description: "View your badge and stats",
    href: "/mine/StatsBadge",
    icon: ACCOUNT_ICONS.faBullhorn,
    colorClass: "text-indigo-600",
    labelKey: "mine.account.badge",
  },
];

export const accountIcons = ACCOUNT_ICONS;
