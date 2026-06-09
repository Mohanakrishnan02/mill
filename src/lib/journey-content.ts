import { IMAGES } from "./images";

export const JOURNEY = {
  yearsExperience: 23,
  foundedYear: 2003,
  videoUrl:
    "https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_25fps.mp4",
  videoPoster: IMAGES.journey.fields,
} as const;

export type JourneyStep = {
  id: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  image: string;
  icon: string;
};

export type JourneyMilestone = {
  year: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
};

export const journeySteps: JourneyStep[] = [
  {
    id: "fields",
    titleEn: "Paddy Fields",
    titleTa: "நெல் வயல்கள்",
    descEn: "We source paddy from trusted farmers across Melur and Madurai district.",
    descTa: "மேலூர் மற்றும் மதுரை மாவட்ட விவசாயிகளிடமிருந்து நம்பகமான நெல்லை தேர்ந்தெடுக்கிறோம்.",
    image: IMAGES.journey.fields,
    icon: "🌾",
  },
  {
    id: "harvest",
    titleEn: "Hand Harvest",
    titleTa: "கையால் அறுவடை",
    descEn: "Seasonal harvest at peak ripeness — only the best grains enter our mill.",
    descTa: "சரியான பழுப்பு நிலையில் அறுவடை — சிறந்த நெல் மட்டுமே ஆலைக்கு வருகிறது.",
    image: IMAGES.journey.harvest,
    icon: "✂️",
  },
  {
    id: "drying",
    titleEn: "Sun Drying",
    titleTa: "வெயிலில் உலர்த்தல்",
    descEn: "Natural sun-drying preserves aroma, taste, and traditional grain quality.",
    descTa: "இயற்கை வெயில் உலர்த்தல் — நறுமணம், சுவை, பாரம்பரிய தரத்தை காக்கிறது.",
    image: IMAGES.journey.drying,
    icon: "☀️",
  },
  {
    id: "milling",
    titleEn: "Stone Milling",
    titleTa: "கல் அரைத்தல்",
    descEn: "Traditional stone-mill process — unpolished rice with full nutrition intact.",
    descTa: "பாரம்பரிய கல் அரைப்பு — பொலிஷ் இல்லாத, முழு ஊட்டச்சத்துடன் அரிசி.",
    image: IMAGES.journey.milling,
    icon: "⚙️",
  },
  {
    id: "sorting",
    titleEn: "Hand Sorting",
    titleTa: "கையால் தேர்வு",
    descEn: "Every batch is hand-checked — broken grains and impurities removed.",
    descTa: "ஒவ்வொரு தொகுப்பும் கையால் பரிசோதனை — உடைந்த நெல், கழிவுகள் நீக்கப்படுகின்றன.",
    image: IMAGES.journey.sorting,
    icon: "🤲",
  },
  {
    id: "packing",
    titleEn: "Packed & Delivered",
    titleTa: "பேக்கிங் & டெலிவரி",
    descEn: "Fresh packs from 1 kg to 25 kg — delivered straight to your doorstep.",
    descTa: "1 kg முதல் 25 kg வரை — உங்கள் வீட்டு வாசலில் நேரடி டெலிவரி.",
    image: IMAGES.journey.packing,
    icon: "📦",
  },
];

export const journeyMilestones: JourneyMilestone[] = [
  {
    year: "2003",
    titleEn: "Mill Founded",
    titleTa: "ஆலை தொடக்கம்",
    descEn: "Jayalakshmi Vilas Rice Mill started on Sivagangai Main Road, Melur.",
    descTa: "ஜெயலட்சுமி விலாஸ் நெல் ஆலை — மேலூர் சிவகங்கை மெயின் ரோட்டில் தொடங்கியது.",
  },
  {
    year: "2010",
    titleEn: "Growing Trust",
    titleTa: "வளர்ந்த நம்பிக்கை",
    descEn: "Families across Melur and Madurai began choosing us for daily rice needs.",
    descTa: "மேலூர், மதுரை குடும்பங்கள் தினசரி அரிசிக்கு எங்களை நம்பத் தொடங்கின.",
  },
  {
    year: "2018",
    titleEn: "12 Varieties",
    titleTa: "12 வகை அரிசி",
    descEn: "Expanded to Seeraga Samba, Mapillai Samba, Karuppu Kavuni and more heritage rice.",
    descTa: "சீரக சம்பா, மாப்பிள்ளை சம்பா, கருப்பு கவுநி உள்ளிட்ட பாarம்பரிய அரிசி வகைகள்.",
  },
  {
    year: "Today",
    titleEn: "23 Years Strong",
    titleTa: "23 ஆண்டுகள்",
    descEn: "Three generations of milling expertise — now ordering online across Tamil Nadu.",
    descTa: "மூன்று தலைமுறை அனுபவம் — இன்று தமிழ்நாடு முழுவதும் ஆன்லைன் ஆர்டர்.",
  },
];

export const journeyStats = [
  { value: 23, suffix: "+", labelEn: "Years Experience", labelTa: "ஆண்டுகள் அனுபவம்" },
  { value: 12, suffix: "+", labelEn: "Rice Varieties", labelTa: "அரிசி வகைகள்" },
  { value: 100, suffix: "%", labelEn: "Traditional Process", labelTa: "பாரம்பரிய முறை" },
  { value: 5000, suffix: "+", labelEn: "Happy Families", labelTa: "மகிழ்ச்சியான குடும்பங்கள்" },
] as const;
