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
  },
  {
    so: "Tiknoolajiyada (IT)",
    title: "IT & Technology",
    icon: <FaComputer size={20} />,
  },
  {
    so: "Daryeelka Caafimaadka",
    title: "Healthcare",
    icon: <FaHospital size={20} />,
  },
  {
    so: "Iibka & Suuqgeynta",
    title: "Sales & Marketing",
    icon: <FaUserTie size={20} />,
  },
  {
    so: "Injineernimo & Dhismaha",
    title: "Engineering & Construction",
    icon: <FaWrench size={20} />,
  },
];

export const PartTimeJobsNestedSub: JobSubCategoryItem[] = [
  {
    so: "Kaaliye Xafiis",
    title: "Office Assistant",
    icon: <FaBuilding size={20} />,
  },
  {
    so: "Shaqo Ardayeed",
    title: "Student Employment",
    icon: <FaUserTie size={20} />,
  },
  {
    so: "Bixinta Cuntada",
    title: "Food Delivery/Runner",
    icon: <FaMotorcycle size={20} />,
  },
];

export const FreelanceGigsNestedSub: JobSubCategoryItem[] = [
  {
    so: "Naqshadeeye Garaaf",
    title: "Graphic Designer",
    icon: <FaPaintbrush size={20} />,
  },
  {
    so: "Horumariyaha Shabakadda",
    title: "Web Developer",
    icon: <FaComputer size={20} />,
  },
  {
    so: "Qoraha Xorta ah",
    title: "Freelance Writer",
    icon: <FaUserTie size={20} />,
  },
];

export const jobsSubCategories: { [key: string]: JobSubCategoryItem[] } = {
  "Full-Time Jobs": FullTimeJobsNestedSub,
  "Part-Time Jobs": PartTimeJobsNestedSub,
  "Freelance/Gigs": FreelanceGigsNestedSub,
};

export const experienceLevels = [
  { value: "entry", so: "Bilow (0-2 Sano)", title: "Entry Level" },
  { value: "mid", so: "Dhexe (3-5 Sano)", title: "Mid Level" },
  { value: "senior", so: "Sare (6+ Sano)", title: "Senior Level" },
];

export const educationLevels = [
  { value: "highschool", so: "Dugsiga Sare", title: "High School" },
  { value: "diploma", so: "Diploma", title: "Diploma" },
  { value: "bachelor", so: "Shahaadada Koowaad", title: "Bachelor's" },
  { value: "master", so: "Shahaadada Labaad", title: "Master's/PhD" },
];

export const applicationMethods = [
  { value: "email", so: "E-mail", title: "Apply by Email" },
  { value: "url", so: "Website", title: "Apply by Website/URL" },
  { value: "phone", so: "Taleefan", title: "Call/Contact by Phone" },
];
