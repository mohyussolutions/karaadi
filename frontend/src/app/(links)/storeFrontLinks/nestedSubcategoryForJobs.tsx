import { ReactElement } from "react";
import {
  FaUserTie,
  FaWrench,
  FaBuilding,
  FaHospital,
  FaPaintbrush,
  FaComputer,
  FaMotorcycle,
} from "react-icons/fa6";

export interface JobSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
  labelKey?: string;
}

export const jobMainCategoriesSo: { [key: string]: string } = {
  "Full-Time Jobs": "Shaqo Waqti Buuxa",
  "Part-Time Jobs": "Shaqo Waqti Gaaban",
  "Freelance/Gigs": "Shaqo Xor ah / Kiish",
};

export const FullTimeJobsNestedSub: JobSubCategoryItem[] = [
  {
    so: "Maamulka & Xafiiska",
    title: "Administration & Office",
    icon: <FaBuilding size={20} />,
    labelKey: "subcategories.jobsNested.fullTime.administrationOffice",
  },
  {
    so: "Tiknoolajiyada (IT)",
    title: "IT & Technology",
    icon: <FaComputer size={20} />,
    labelKey: "subcategories.jobsNested.fullTime.itTechnology",
  },
  {
    so: "Daryeelka Caafimaadka",
    title: "Healthcare",
    icon: <FaHospital size={20} />,
    labelKey: "subcategories.jobsNested.fullTime.healthcare",
  },
  {
    so: "Iibka & Suuqgeynta",
    title: "Sales & Marketing",
    icon: <FaUserTie size={20} />,
    labelKey: "subcategories.jobsNested.fullTime.salesMarketing",
  },
  {
    so: "Injineernimo & Dhismaha",
    title: "Engineering & Construction",
    icon: <FaWrench size={20} />,
    labelKey: "subcategories.jobsNested.fullTime.engineeringConstruction",
  },
];

export const PartTimeJobsNestedSub: JobSubCategoryItem[] = [
  {
    so: "Kaaliye Xafiis",
    title: "Office Assistant",
    icon: <FaBuilding size={20} />,
    labelKey: "subcategories.jobsNested.partTime.officeAssistant",
  },
  {
    so: "Shaqo Ardayeed",
    title: "Student Employment",
    icon: <FaUserTie size={20} />,
    labelKey: "subcategories.jobsNested.partTime.studentEmployment",
  },
  {
    so: "Bixinta Cuntada",
    title: "Food Delivery/Runner",
    icon: <FaMotorcycle size={20} />,
    labelKey: "subcategories.jobsNested.partTime.foodDeliveryRunner",
  },
];

export const FreelanceGigsNestedSub: JobSubCategoryItem[] = [
  {
    so: "Naqshadeeye Garaaf",
    title: "Graphic Designer",
    icon: <FaPaintbrush size={20} />,
    labelKey: "subcategories.jobsNested.freelance.graphicDesigner",
  },
  {
    so: "Horumariyaha Shabakadda",
    title: "Web Developer",
    icon: <FaComputer size={20} />,
    labelKey: "subcategories.jobsNested.freelance.webDeveloper",
  },
  {
    so: "Qoraha Xorta ah",
    title: "Freelance Writer",
    icon: <FaUserTie size={20} />,
    labelKey: "subcategories.jobsNested.freelance.freelanceWriter",
  },
];

export const jobsSubCategories: { [key: string]: JobSubCategoryItem[] } = {
  "Full-Time Jobs": FullTimeJobsNestedSub,
  "Part-Time Jobs": PartTimeJobsNestedSub,
  "Freelance/Gigs": FreelanceGigsNestedSub,
};

export const experienceLevels = [
  {
    value: "entry",
    so: "Bilow (0-2 Sano)",
    title: "Entry Level",
    labelKey: "subcategories.jobsNested.experienceLevels.entry",
  },
  {
    value: "mid",
    so: "Dhexe (3-5 Sano)",
    title: "Mid Level",
    labelKey: "subcategories.jobsNested.experienceLevels.mid",
  },
  {
    value: "senior",
    so: "Sare (6+ Sano)",
    title: "Senior Level",
    labelKey: "subcategories.jobsNested.experienceLevels.senior",
  },
];

export const educationLevels = [
  {
    value: "highschool",
    so: "Dugsiga Sare",
    title: "High School",
    labelKey: "subcategories.jobsNested.educationLevels.highschool",
  },
  {
    value: "diploma",
    so: "Diploma",
    title: "Diploma",
    labelKey: "subcategories.jobsNested.educationLevels.diploma",
  },
  {
    value: "bachelor",
    so: "Shahaadada Koowaad",
    title: "Bachelor's",
    labelKey: "subcategories.jobsNested.educationLevels.bachelor",
  },
  {
    value: "master",
    so: "Shahaadada Labaad",
    title: "Master's/PhD",
    labelKey: "subcategories.jobsNested.educationLevels.master",
  },
];

export const applicationMethods = [
  {
    value: "email",
    so: "E-mail",
    title: "Apply by Email",
    labelKey: "subcategories.jobsNested.applicationMethods.email",
  },
  {
    value: "url",
    so: "Website",
    title: "Apply by Website/URL",
    labelKey: "subcategories.jobsNested.applicationMethods.url",
  },
  {
    value: "phone",
    so: "Taleefan",
    title: "Call/Contact by Phone",
    labelKey: "subcategories.jobsNested.applicationMethods.phone",
  },
];
