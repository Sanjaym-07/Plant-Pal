
export const CROP_LIST = [
  'Wheat',
  'Rice',
  'Corn (Maize)',
  'Soybean',
  'Potato',
  'Tomato',
  'Cotton',
  'Sugarcane',
  'Barley',
  'Lettuce',
  'Carrot',
  'Onion',
];

export const FARMING_TYPES = {
  TERRACE: 'Terrace/Rooftop Gardening',
  HOME: 'Home/Kitchen Garden',
  ORNAMENTAL: 'Ornamental & Landscaping',
  COMMERCIAL: 'Commercial Farming',
  HYDROPONICS: 'Hydroponics/Indoor Farming',
  HERBAL: 'Herbal & Medicinal Plants',
};

// FIX: The value for each key is an array of objects, so the type should be `...[]`.
export const FARMING_TYPE_DETAILS: Record<string, { name: string; label: string; type: string; placeholder?: string; options?: string[] }[]> = {
  [FARMING_TYPES.TERRACE]: [
    { name: 'city', label: 'City/Region', type: 'text', placeholder: 'e.g., San Francisco' },
    { name: 'sunlight', label: 'Sunlight Exposure (hours/day)', type: 'number', placeholder: 'e.g., 6' },
    { name: 'containerSize', label: 'Average Container Size (Liters)', type: 'number', placeholder: 'e.g., 20' },
    { name: 'climate', label: 'Climate', type: 'select', options: ['Hot', 'Temperate', 'Cold', 'Arid'] },
  ],
  [FARMING_TYPES.HOME]: [
    { name: 'sunlight', label: 'Sunlight Exposure (hours/day)', type: 'number', placeholder: 'e.g., 5' },
    { name: 'space', label: 'Available Space (sq. meters)', type: 'number', placeholder: 'e.g., 10' },
    { name: 'experience', label: 'Gardening Experience', type: 'select', options: ['Beginner', 'Intermediate', 'Expert'] },
  ],
  [FARMING_TYPES.ORNAMENTAL]: [
    { name: 'plantType', label: 'Desired Plant Type', type: 'select', options: ['Flower', 'Shrub', 'Tree', 'Groundcover', 'Vine'] },
    { name: 'maintenance', label: 'Maintenance Level', type: 'select', options: ['Low', 'Medium', 'High'] },
    { name: 'climateZone', label: 'Climate Zone', type: 'text', placeholder: 'e.g., USDA Zone 9b' },
  ],
  [FARMING_TYPES.COMMERCIAL]: [
    { name: 'region', label: 'Region/Location', type: 'text', placeholder: 'e.g., Central Plains' },
    { name: 'area', label: 'Area (hectares)', type: 'number', placeholder: 'e.g., 50' },
    { name: 'soilType', label: 'Soil Type', type: 'select', options: ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'] },
    { name: 'rainfall', label: 'Annual Rainfall (mm)', type: 'number', placeholder: 'e.g., 1200' },
  ],
  [FARMING_TYPES.HYDROPONICS]: [
    { name: 'systemType', label: 'System Type', type: 'select', options: ['Deep Water Culture (DWC)', 'Nutrient Film Technique (NFT)', 'Ebb and Flow', 'Drip System'] },
    { name: 'space', label: 'Available Space (sq. meters)', type: 'number', placeholder: 'e.g., 15' },
    { name: 'lightingType', label: 'Lighting Type', type: 'select', options: ['LED Grow Lights', 'Fluorescent', 'HID'] },
  ],
  [FARMING_TYPES.HERBAL]: [
    { name: 'use', label: 'Intended Use', type: 'select', options: ['Culinary', 'Tea', 'Medicinal', 'Aromatic'] },
    { name: 'growthHabit', label: 'Growth Habit', type: 'select', options: ['Bush', 'Vine', 'Groundcover', 'Upright'] },
    { name: 'sunlight', label: 'Sunlight Exposure (hours/day)', type: 'number', placeholder: 'e.g., 6' },
  ],
};
