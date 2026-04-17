export interface SettingsOption {
  href: string;
  title: string;
  labelKey?: string;
  description: string;
  icon: React.ElementType;
  colorClass?: string;
}

export const settingsOptions: SettingsOption[] = [];
