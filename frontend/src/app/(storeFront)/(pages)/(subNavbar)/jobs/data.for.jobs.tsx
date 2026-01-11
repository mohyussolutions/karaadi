import { ReactElement } from "react";
import {
  FaUserTie,
  FaWrench,
  FaBuilding,
  FaHospital,
  FaPaintbrush,
  FaComputer,
  FaMotorcycle,
  FaChartLine,
  FaShieldHalved,
  FaHandshake,
  FaGraduationCap,
  FaEnvelope,
  FaGlobe,
  FaPhone,
} from "react-icons/fa6";

export interface JobSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  categoryTitle: string;
  descriptionSummary: string;
  postedDate: string;
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
    icon: <FaChartLine size={20} />,
  },
  {
    so: "Injineernimo & Dhismaha",
    title: "Engineering & Construction",
    icon: <FaWrench size={20} />,
  },
  {
    so: "Amniga & Sharciga",
    title: "Security & Legal",
    icon: <FaShieldHalved size={20} />,
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
    icon: <FaGraduationCap size={20} />,
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
  {
    value: "entry",
    so: "Bilow (0-2 Sano)",
    title: "Entry Level",
    icon: <FaUserTie size={16} />,
  },
  {
    value: "mid",
    so: "Dhexe (3-5 Sano)",
    title: "Mid Level",
    icon: <FaHandshake size={16} />,
  },
  {
    value: "senior",
    so: "Sare (6+ Sano)",
    title: "Senior Level",
    icon: <FaGraduationCap size={16} />,
  },
];

export const educationLevels = [
  {
    value: "highschool",
    so: "Dugsiga Sare",
    title: "High School",
    icon: <FaBuilding size={16} />,
  },
  {
    value: "diploma",
    so: "Diploma",
    title: "Diploma",
    icon: <FaGraduationCap size={16} />,
  },
  {
    value: "bachelor",
    so: "Shahaadada Koowaad",
    title: "Bachelor's",
    icon: <FaGraduationCap size={16} />,
  },
  {
    value: "master",
    so: "Shahaadada Labaad",
    title: "Master's/PhD",
    icon: <FaGraduationCap size={16} />,
  },
];

export const applicationMethods = [
  {
    value: "email",
    so: "E-mail",
    title: "Apply by Email",
    icon: <FaEnvelope size={16} />,
  },
  {
    value: "url",
    so: "Website",
    title: "Apply by Website/URL",
    icon: <FaGlobe size={16} />,
  },
  {
    value: "phone",
    so: "Taleefan",
    title: "Call/Contact by Phone",
    icon: <FaPhone size={16} />,
  },
];

export const jobPostingsData: JobPosting[] = [
  {
    id: 1,
    title: "Senior Frontend Developer (React/Next.js)",
    company: "SomTech Innovations",
    location: "Mogadishu, Somalia (Remote Hybrid)",
    salaryRange: "$1,500 - $2,500 / Month",
    categoryTitle: "IT & Technology",
    descriptionSummary:
      "Looking for an experienced React/Next.js developer to lead the frontend development of our flagship product. Must have 5+ years of experience in modern JavaScript frameworks.",
    postedDate: "2025-12-10",
  },
  {
    id: 2,
    title: "Financial Analyst",
    company: "Hormuud Telecom",
    location: "Hargeisa, Somaliland",
    salaryRange: "$1,200 - $1,800 / Month",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "We are hiring a Financial Analyst to perform financial forecasting, reporting, and operational metrics tracking. CPA or CFA certification is a plus.",
    postedDate: "2025-12-09",
  },
  {
    id: 3,
    title: "Logistics Coordinator",
    company: "East Africa Shipping",
    location: "Berbera, Somaliland",
    salaryRange: "$800 - $1,200 / Month",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Coordinate and monitor supply chain operations. Ensure timely and accurate delivery of goods. Experience in customs clearance preferred.",
    postedDate: "2025-12-08",
  },
  {
    id: 4,
    title: "Digital Marketing Specialist",
    company: "Media Mogul Co.",
    location: "Nairobi, Kenya (Remote)",
    salaryRange: "$1,000 - $1,600 / Month",
    categoryTitle: "Sales & Marketing",
    descriptionSummary:
      "Develop, implement, and manage marketing campaigns that promote our products and services. Strong focus on SEO/SEM and social media advertising.",
    postedDate: "2025-12-05",
  },
  {
    id: 5,
    title: "Human Resources Assistant",
    company: "Local NGO Partnership",
    location: "Garowe, Puntland",
    salaryRange: "$600 - $900 / Month",
    categoryTitle: "Office Assistant",
    descriptionSummary:
      "Assist the HR manager with daily administrative tasks, including record keeping, scheduling interviews, and managing payroll inquiries. Part-Time opportunity.",
    postedDate: "2025-12-03",
  },
  {
    id: 6,
    title: "Technical Writer (Freelance)",
    company: "Global Documentation Hub",
    location: "Worldwide (Remote)",
    salaryRange: "$50 - $100 / Hour",
    categoryTitle: "Freelance Writer",
    descriptionSummary:
      "Seeking a freelance technical writer to create clear and concise documentation for software products. Excellent English writing skills required.",
    postedDate: "2025-12-01",
  },
  {
    id: 109,
    title: "Director of Planning",
    company: "Maamulka Somaliland - Wasaaradda Qorsheynta",
    location: "Hargeisa",
    salaryRange: "Govt Scale SL-15",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Overseeing national development plans and donor coordination.",
    postedDate: "2025-11-29",
  },
  {
    id: 110,
    title: "Education Policy Analyst",
    company: "Maamulka Puntland - Wasaaradda Waxbarashada",
    location: "Garowe",
    salaryRange: "Govt Scale PL-10",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Analyzing and developing curriculum and education standards.",
    postedDate: "2025-11-28",
  },
  {
    id: 111,
    title: "Water Resources Engineer",
    company: "Maamulka Galmudug - Wasaaradda Biyaha",
    location: "Dhuusamareeb",
    salaryRange: "Govt Scale GM-12",
    categoryTitle: "Engineering & Construction",
    descriptionSummary:
      "Managing borehole drilling projects and water sustainability.",
    postedDate: "2025-11-27",
  },
  {
    id: 112,
    title: "Regional Security Coordinator",
    company: "Maamulka Koofur Galbeed - Wasaaradda Amniga",
    location: "Baydhabo",
    salaryRange: "Govt Scale KG-9",
    categoryTitle: "Security & Legal",
    descriptionSummary:
      "Coordinating security efforts across the region with local forces.",
    postedDate: "2025-11-26",
  },
  {
    id: 113,
    title: "Livestock Health Officer",
    company: "Maamulka Jubbaland - Wasaaradda Xoolaha",
    location: "Kismaayo",
    salaryRange: "Govt Scale JL-8",
    categoryTitle: "Healthcare",
    descriptionSummary:
      "Monitoring and managing animal health and disease control programs.",
    postedDate: "2025-11-25",
  },
  {
    id: 114,
    title: "Urban Planner",
    company: "Maamulka Banadir (Gobolka Banaadir)",
    location: "Mogadishu",
    salaryRange: "Govt Scale B-11",
    categoryTitle: "Engineering & Construction",
    descriptionSummary:
      "Designing city layout, infrastructure, and zoning regulations.",
    postedDate: "2025-11-24",
  },
  {
    id: 115,
    title: "Logistics Manager",
    company: "Waaqoooyi Bari Logistics",
    location: "Bossaso",
    salaryRange: "$1,500 - $2,500 USD",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Managing shipping routes, inventory, and supply chain efficiency.",
    postedDate: "2025-11-23",
  },
  {
    id: 101,
    title: "Senior Public Health Officer",
    company: "Wasaaradda Caafimaadka",
    location: "Mogadishu",
    salaryRange: "Govt Scale 12",
    categoryTitle: "Healthcare",
    descriptionSummary:
      "Managing national vaccination programs and public health awareness campaigns.",
    postedDate: "2025-11-22",
  },
  {
    id: 102,
    title: "Maritime Security Analyst",
    company: "Wasaaradda Kalluumeysiga",
    location: "Bosaso/Coastal Regions",
    salaryRange: "Govt Scale 10",
    categoryTitle: "Security & Legal",
    descriptionSummary:
      "Analyzing threats and coordinating with security forces to protect maritime resources.",
    postedDate: "2025-11-21",
  },
  {
    id: 103,
    title: "Hydrogeologist",
    company: "Wasaaradda Macdanta & Qayraadka",
    location: "Garowe",
    salaryRange: "Govt Scale 11",
    categoryTitle: "Engineering & Construction",
    descriptionSummary:
      "Studying groundwater resources and advising on water exploration projects.",
    postedDate: "2025-11-20",
  },
  {
    id: 104,
    title: "Financial Accountant",
    company: "Wasaaradda Gaashaandhigga",
    location: "Mogadishu",
    salaryRange: "Govt Scale 9",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Handling payroll and budget allocation for defense personnel and operations.",
    postedDate: "2025-11-19",
  },
  {
    id: 105,
    title: "Mobile Money Developer (Backend)",
    company: "Hormuud Telecom (EVC Plus Team)",
    location: "Mogadishu",
    salaryRange: "$2,000 - $3,500 USD",
    categoryTitle: "IT & Technology",
    descriptionSummary:
      "Developing and optimizing core backend services for mobile money platform.",
    postedDate: "2025-11-18",
  },
  {
    id: 106,
    title: "Branch Manager",
    company: "Dahabshiil Bank",
    location: "Kismaayo",
    salaryRange: "Competitive/Experience Based",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Managing daily branch operations, staff performance, and customer satisfaction.",
    postedDate: "2025-11-17",
  },
  {
    id: 107,
    title: "Digital Marketing Specialist",
    company: "Hormuud Telecom",
    location: "Hargeisa",
    salaryRange: "Negotiable",
    categoryTitle: "Sales & Marketing",
    descriptionSummary:
      "Running paid ads campaigns and managing social media presence.",
    postedDate: "2025-11-16",
  },
  {
    id: 108,
    title: "Credit Risk Analyst",
    company: "Dahabshiil Bank",
    location: "Mogadishu",
    salaryRange: "$1,800 - $2,800 USD",
    categoryTitle: "Administration & Office",
    descriptionSummary:
      "Evaluating credit applications and assessing financial risk for loans.",
    postedDate: "2025-11-15",
  },
  {
    id: 201,
    title: "Part-Time Administrative Assistant",
    company: "Local Law Firm",
    location: "Hargeisa",
    salaryRange: "$400/Month",
    categoryTitle: "Office Assistant",
    descriptionSummary:
      "Assisting with legal documentation and client scheduling (20 hours/week).",
    postedDate: "2025-11-14",
  },
  {
    id: 301,
    title: "Freelance Technical Writer (IT Docs)",
    company: "Macadda Tech Solutions",
    location: "Remote",
    salaryRange: "$60 per article",
    categoryTitle: "Freelance Writer",
    descriptionSummary:
      "Creating clear, concise technical documentation and user guides.",
    postedDate: "2025-11-13",
  },
  {
    id: 302,
    title: "Graphic Designer",
    company: "Digital Arts Agency",
    location: "Mogadishu (Remote)",
    salaryRange: "$800 - $1,200 / Month",
    categoryTitle: "Graphic Designer",
    descriptionSummary:
      "Design marketing materials and brand assets using Adobe Suite.",
    postedDate: "2025-11-12",
  },
  {
    id: 303,
    title: "Web Developer",
    company: "E-Commerce Start-up",
    location: "Hargeisa",
    salaryRange: "$1,200 - $1,800 / Month",
    categoryTitle: "Web Developer",
    descriptionSummary:
      "Build and maintain responsive e-commerce websites using WordPress and Shopify.",
    postedDate: "2025-11-11",
  },
];
