import { STATIC_NAV_ITEMS } from "./staticNavItems";
import { getAuthNavItem } from "./authNavItem";

export const getNavItems = (isUserValid: boolean, notificationCount = 0) => {
  const staticItems = STATIC_NAV_ITEMS.map((item) => {
    const Icon = item.icon;
    const showBadge = item.hasBadge && notificationCount > 0;
    return {
      labelKey: item.labelKey,
      href: item.href,
      icon: showBadge ? (
        <div className="relative flex items-center justify-center">
          <Icon size={item.iconSize} />
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            {notificationCount}
          </span>
        </div>
      ) : (
        <Icon size={item.iconSize} />
      ),
    };
  });
  const authItem = getAuthNavItem(isUserValid);
  const AuthIcon = authItem.icon;
  return [
    ...staticItems,
    {
      labelKey: authItem.labelKey,
      href: authItem.href,
      icon: <AuthIcon size={authItem.iconSize} />,
    },
  ];
};

export { STATIC_NAV_ITEMS };
