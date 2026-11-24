import { MatcherStep } from '../types';

export const MATCHER_STEPS: MatcherStep[] = [
  {
    id: 'budget',
    stepNumber: 1,
    title: 'Aap shuruwat mein kitna paisa laga sakte ho?',
    subtitle: 'Apna comfortable budget chuno (udhaar mat lo)',
    type: 'single',
    options: [
      {
        id: 'zero_low',
        label: '₹0 se ₹2,000',
        hint: 'Bilkul kam risk, phone ya skill se shuru',
        icon: '🪙',
      },
      {
        id: 'low_mid',
        label: '₹2,000 se ₹10,000',
        hint: 'Chota samaan aur basic setup',
        icon: '💵',
      },
      {
        id: 'mid',
        label: '₹10,000 se ₹25,000',
        hint: 'Tools, stock ya kitchen setup',
        icon: '💼',
      },
      {
        id: 'high',
        label: '₹25,000 se zyada',
        hint: 'Dukaan, machine ya bada stock',
        icon: '🏪',
      },
    ],
  },
  {
    id: 'time',
    stepNumber: 2,
    title: 'Roz kaam ko kitna time de sakte ho?',
    subtitle: 'Imandari se batao taaki sahi plan bane',
    type: 'single',
    options: [
      {
        id: 'part_1_2',
        label: '1 - 2 Ghante Roz',
        hint: 'Job, college ya ghar ke kaam ke saath',
        icon: '⏱️',
      },
      {
        id: 'part_3_4',
        label: '3 - 4 Ghante Roz',
        hint: 'Part-time serious side business',
        icon: '⚡',
      },
      {
        id: 'full_time',
        label: '6+ Ghante (Full Time)',
        hint: 'Pura dhyan business badhane mein',
        icon: '🚀',
      },
    ],
  },
  {
    id: 'skill',
    stepNumber: 3,
    title: 'Aapko kis tarah ka kaam pasand hai ya aata hai?',
    subtitle: 'Jo natural lage wohi chuno',
    type: 'single',
    options: [
      {
        id: 'food',
        label: 'Khana / Nashta Banana',
        hint: 'Tiffin, chai-snacks, mithai, achaar',
        icon: '🍱',
      },
      {
        id: 'repair_craft',
        label: 'Hath ka Kaam / Repair',
        hint: 'AC/Fridge, RO, Mobile, Silai, Beauty',
        icon: '🔧',
      },
      {
        id: 'trade_sell',
        label: 'Bechna aur Baat-cheet',
        hint: 'Kapde, Kirana, Reselling, Deal banana',
        icon: '🛍️',
      },
      {
        id: 'digital',
        label: 'Phone / Social Media',
        hint: 'Reels, Canva, Google Maps, WhatsApp',
        icon: '📱',
      },
      {
        id: 'field_service',
        label: 'Local Service / Ghoom-phir ke',
        hint: 'Car/Bike Wash, Delivery, Society Service',
        icon: '🛵',
      },
    ],
  },
  {
    id: 'context',
    stepNumber: 4,
    title: 'Kahan se kaam karoge aur sabse bada darr kya hai?',
    subtitle: 'Dono mein se ek-ek chuno',
    type: 'dual',
    groups: [
      {
        key: 'mode',
        label: 'Kaam karne ka tareeka (Location / Mode):',
        options: [
          { id: 'home_online', label: 'Ghar se / Online', icon: '🏠' },
          { id: 'local_area', label: 'Gali-Mohalla / Society', icon: '🏘️' },
          { id: 'market_shop', label: 'Market / Dukaan-to-Dukaan', icon: '🏪' },
        ],
      },
      {
        key: 'fear',
        label: 'Aapka sabse bada darr (Biggest Fear):',
        options: [
          { id: 'money_loss', label: 'Paise doobne ka darr', icon: '😰' },
          { id: 'no_customers', label: 'Customer kaise milenge?', icon: '🤷' },
          { id: 'confidence', label: 'Log kya kahenge / Sharm', icon: '🫣' },
        ],
      },
    ],
  },
];
