export interface JobLink {
  title: string;
  category: string;
  url: string;
  labelKey?: string;
}

export const jobLinks: JobLink[] = [
  {
    title: "Shaqooyinka IT-ga",
    category: "IT",
    url: "jobs/it",
    labelKey: "jobs.links.it",
  },
  {
    title: "Shaqooyinka Garoomada",
    category: "Airport",
    url: "jobs/airports",
    labelKey: "jobs.links.airport",
  },
  {
    title: "Shaqooyinka Nadaafadda",
    category: "Public",
    url: "jobs/cleaning",
    labelKey: "jobs.links.cleaning",
  },
];
