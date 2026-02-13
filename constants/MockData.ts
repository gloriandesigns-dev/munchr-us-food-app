import { Colors } from './Colors';

export const HERO_SLIDES = [
  {
    id: '1',
    title: 'CROWD\nFAVOURITES',
    subtitle: 'Loved by people around you',
    image: 'https://www.dropbox.com/scl/fi/zvu6sclq0bvp072kpvwcw/WhatsApp-Image-2026-02-13-at-6.09.41-PM-9.webp?rlkey=fqpqvcav5eksb51qcsuql58nn&st=1mh2l67c&dl=1',
    bgColor: '#205C55',
    accentColor: '#FFD700',
    isVeg: false, 
  },
  {
    id: '2',
    title: 'HEALTHIER\nOPTIONS',
    subtitle: 'Fresh & Organic choices',
    image: 'https://www.dropbox.com/scl/fi/66d66kjhvra31ut84f08b/high-angle-shot-plates-salad-fresh-fruits-vegetable-wooden-surface_181624-46700.avif?rlkey=1n242ea4wzh1o8jbszbjrur2z&st=gzv3bfrb&dl=1',
    bgColor: '#8B4513',
    accentColor: '#90EE90',
    isVeg: true,
  },
  {
    id: '3',
    title: 'CHEF\'S\nSPECIAL',
    subtitle: 'Curated just for you',
    image: 'https://www.dropbox.com/scl/fi/3wew3vw6nowqoblre2ia9/nisaba-2026-01-12-16-12-07.webp?rlkey=ksu0zdqx2kuyf9lns7t3ustnv&st=dktu2woe&dl=1', 
    bgColor: '#C71585',
    accentColor: '#FFB6C1',
    isVeg: true,
  }
];

export const CATEGORIES = [
  { id: '1', name: 'All', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', isVeg: true },
  { id: '2', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000&auto=format&fit=crop', isVeg: false },
  { id: '3', name: 'Chicken', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2000&auto=format&fit=crop', isVeg: false },
  { id: '4', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop', isVeg: true },
  { id: '5', name: 'Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop', isVeg: true },
  { id: '6', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', isVeg: true },
];

export const FEATURED_RESTAURANTS = [
    {
        id: '1',
        name: 'Foo Asian Tapas',
        rating: '4.3',
        ratingCount: '3.6k+',
        time: '25-30 mins',
        distance: '1 km',
        offer: '30% OFF up to $75',
        images: [
            'https://images.unsplash.com/photo-1541696490-8744a5dc0228?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2000&auto=format&fit=crop',
        ],
        socialProof: 'Nicole & 1 more',
        tags: ['Chinese', 'Asian', 'Dim Sum', 'Bowl'],
        price: '$$$',
        isVeg: true,
    },
    {
        id: '2',
        name: 'P.F. Chang\'s',
        rating: '4.1',
        ratingCount: '600+',
        time: '30-40 mins',
        distance: '2.5 km',
        offer: 'Flat $10 OFF',
        images: [
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1892&auto=format&fit=crop',
        ],
        socialProof: 'Mike & 3 others',
        tags: ['Asian', 'Chinese', 'Family', 'Chicken'],
        price: '$$',
        isVeg: true,
    }
];

export const NEW_FOR_YOU = [
    {
        id: '1',
        name: 'The Tiny Tub',
        rating: '4.1',
        time: '20-25 mins',
        offer: 'Flat $7.5 OFF',
        social: '10+ orders by friends',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2000&auto=format&fit=crop', // Fixed Image
        isVeg: true,
        tags: ['Dessert', 'Sweet'],
    },
    {
        id: '2',
        name: 'The Third House',
        rating: '4.1',
        time: '20-25 mins',
        offer: '50% OFF',
        social: '10+ orders by friends',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965&auto=format&fit=crop',
        isVeg: true,
        tags: ['North Indian', 'Curry', 'Bowl'],
    },
    {
        id: '3',
        name: 'Goila Butter Chicken',
        rating: '4.0',
        time: '30-35 mins',
        offer: 'Items at $9',
        social: '10+ orders by friends',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop',
        isVeg: false,
        tags: ['North Indian', 'Chicken', 'Biryani'],
    }
];

export const FEED_RESTAURANTS = [
    {
        id: '101',
        name: 'Pizza Hut',
        rating: '4.0',
        time: '30-35 mins',
        distance: '2 mi',
        offer: '50% OFF',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop',
        tags: ['Pizza', 'Fast Food', 'Italian'],
        promoted: false,
        isVeg: true,
    },
    {
        id: '102',
        name: 'Burger King',
        rating: '3.9',
        time: '15-20 mins',
        distance: '0.8 mi',
        offer: 'Free Whopper',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop',
        tags: ['Burger', 'American', 'Chicken', 'Fast Food'],
        promoted: true,
        isVeg: false,
    },
    {
        id: '103',
        name: 'Taco Bell',
        rating: '4.2',
        time: '20-25 mins',
        distance: '1.5 mi',
        offer: '',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1960&auto=format&fit=crop',
        tags: ['Mexican', 'Tacos', 'Bowl'],
        promoted: false,
        isVeg: true,
    },
    {
        id: '104',
        name: 'Subway',
        rating: '4.1',
        time: '10-15 mins',
        distance: '0.5 mi',
        offer: 'Buy 1 Get 1',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1887&auto=format&fit=crop', // Fixed Image
        tags: ['Sandwich', 'Healthy', 'Bowl'],
        promoted: false,
        isVeg: true,
    },
    {
        id: '105',
        name: 'Biryani By Kilo',
        rating: '4.4',
        time: '40-45 mins',
        distance: '3 mi',
        offer: 'Flat 20% OFF',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000&auto=format&fit=crop',
        tags: ['Biryani', 'North Indian', 'Chicken'],
        promoted: false,
        isVeg: false,
    },
    {
        id: '106',
        name: 'Persian Darbar',
        rating: '4.1',
        time: '35-40 mins',
        distance: '2.2 mi',
        offer: 'Flat 50% OFF',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop',
        tags: ['Biryani', 'Mughlai', 'Chicken'],
        promoted: false,
        isVeg: false,
    },
    {
        id: '107',
        name: 'Maiz Mexican Kitchen',
        rating: '4.4',
        time: '25-30 mins',
        distance: '1.2 mi',
        offer: 'Flat $100 OFF',
        image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=1974&auto=format&fit=crop',
        tags: ['Mexican', 'Bowl', 'Healthy'],
        promoted: false,
        isVeg: true,
    }
];

export const EXPLORE_MORE = [
    { id: '1', name: 'Offers', icon: 'pricetag', color: '#FF6B6B' },
    { id: '2', name: 'Gourmet', icon: 'ribbon', color: '#FFD93D' },
    { id: '3', name: 'Healthy', icon: 'leaf', color: '#6BCB77' },
    { id: '4', name: 'Pocket', icon: 'wallet', color: '#4D96FF' },
];

export const FILTERS = ['Filters', 'Near & Fast', 'New to you', 'Schedule', 'Rating 4.0+'];

// --- Detailed Restaurant Data for Dynamic Page ---
export const RESTAURANT_DETAILS: Record<string, any> = {
    '101': {
        id: '101',
        name: 'Pizza Hut',
        rating: '4.0',
        ratingCount: '5K+',
        distance: '2.0 mi',
        address: '123 Main St, New York, NY',
        time: '30-35 mins',
        offer: '50% OFF',
        offerCount: 3,
        images: [
            'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop',
        ],
        featuredDish: 'Pepperoni Feast',
        tags: ['Frequently reordered', '1 dish loved by Mike'],
        menuSections: [
            {
                title: 'Recommended for you',
                data: [
                    { 
                        id: 'm1', 
                        name: 'Pepperoni Pizza', 
                        price: 18.00, 
                        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop', 
                        isVeg: false, 
                        desc: 'Classic pepperoni with mozzarella.', 
                        customizable: true, 
                        isBestseller: true,
                        customizationGroups: [
                            {
                                id: 'cg1',
                                title: 'Choose Crust',
                                type: 'single',
                                required: true,
                                options: [
                                    { id: 'o1', name: 'Pan Pizza', price: 0, type: 'veg' },
                                    { id: 'o2', name: 'Stuffed Crust', price: 2.50, type: 'veg' },
                                    { id: 'o3', name: 'Thin Crust', price: 0, type: 'veg' }
                                ]
                            },
                            {
                                id: 'cg2',
                                title: 'Add Extra Cheese',
                                type: 'multiple',
                                required: false,
                                options: [
                                    { id: 'o4', name: 'Mozzarella', price: 1.50, type: 'veg' },
                                    { id: 'o5', name: 'Cheddar', price: 1.50, type: 'veg' }
                                ]
                            }
                        ]
                    },
                    { id: 'm2', name: 'Margherita', price: 15.00, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop', isVeg: true, desc: 'Fresh basil, mozzarella, and tomato sauce.', customizable: true },
                ]
            },
            {
                title: 'Veggie Delights',
                data: [
                    { id: 'm3', name: 'Veggie Supreme', price: 19.50, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', isVeg: true, desc: 'Loaded with bell peppers, onions, and olives.', customizable: false },
                    { id: 'm4', name: 'Cheese Sticks', price: 8.50, image: 'https://images.unsplash.com/photo-1548340748-432e07026f9d?q=80&w=2070&auto=format&fit=crop', isVeg: true, desc: 'Garlic butter breadsticks with cheese.', customizable: false },
                ]
            }
        ]
    },
    '107': {
        id: '107',
        name: 'Maiz Mexican Kitchen',
        rating: '4.4',
        ratingCount: '8.2K+',
        distance: '1.4 km',
        address: 'Andheri Lokhandwala, Andheri West',
        time: '25-30 mins',
        offer: 'Free delivery above $15',
        offerCount: 5,
        images: [
            'https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1964&auto=format&fit=crop',
        ],
        featuredDish: 'Fajita Black Bean Burrito',
        tags: ['1 dish loved by nicole', 'Frequently reordered'],
        menuSections: [
            {
                title: 'Recommended for you',
                data: [
                    { 
                        id: 'm1', 
                        name: 'Chipotle Chicken Burrito Bowl', 
                        price: 12.50, 
                        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1964&auto=format&fit=crop', 
                        isVeg: false, 
                        desc: 'Serves 1 | Chipotle chicken, choice of brown/white rice, beans, salsa.', 
                        customizable: true, 
                        isBestseller: true,
                        customizationGroups: [
                            {
                                id: 'cg1',
                                title: 'Choice of Rice',
                                type: 'single',
                                required: true,
                                options: [
                                    { id: 'o1', name: 'Cilantro Lime Rice (White)', price: 0, type: 'veg' },
                                    { id: 'o2', name: 'Brown Rice', price: 0, type: 'veg' },
                                ]
                            },
                            {
                                id: 'cg2',
                                title: 'Choice of Beans',
                                type: 'single',
                                required: true,
                                options: [
                                    { id: 'o3', name: 'Black Beans', price: 0, type: 'veg' },
                                    { id: 'o4', name: 'Pinto Beans', price: 0, type: 'veg' },
                                ]
                            },
                            {
                                id: 'cg3',
                                title: 'Add Extras',
                                type: 'multiple',
                                required: false,
                                options: [
                                    { id: 'o5', name: 'Guacamole', price: 2.50, type: 'veg' },
                                    { id: 'o6', name: 'Sour Cream', price: 1.00, type: 'veg' },
                                    { id: 'o7', name: 'Extra Chicken', price: 3.50, type: 'non-veg' },
                                ]
                            }
                        ]
                    },
                    { id: 'm2', name: 'Nachos Supreme', price: 10.50, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=1935&auto=format&fit=crop', isVeg: true, desc: 'Chips topped with cheese, jalapenos, and sour cream.', customizable: true, isBestseller: true },
                ]
            },
            {
                title: 'Burrito Bowls',
                data: [
                    { id: 'm3', name: 'Veggie Bean Bowl', price: 11.00, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop', isVeg: true, desc: 'Healthy mix of beans, corn, and avocado.', customizable: true },
                    { id: 'm4', name: 'Spicy Beef Bowl', price: 13.50, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=1988&auto=format&fit=crop', isVeg: false, desc: 'Spicy ground beef with rice and veggies.', customizable: true },
                ]
            },
            {
                title: 'Sides & Extras',
                data: [
                    { id: 'm5', name: 'Guacamole', price: 4.00, image: 'https://images.unsplash.com/photo-1604542031651-522b9a8cf18d?q=80&w=2000&auto=format&fit=crop', isVeg: true, desc: 'Freshly made guacamole.', customizable: false },
                    { id: 'm6', name: 'Chips & Salsa', price: 3.50, image: 'https://images.unsplash.com/photo-1623689046286-01d812cc8ba7?q=80&w=2070&auto=format&fit=crop', isVeg: true, desc: 'Crispy corn chips with house salsa.', customizable: false },
                ]
            }
        ]
    }
};

// Helper to fallback if specific ID not found
export const getRestaurantDetails = (id: string) => {
    if (RESTAURANT_DETAILS[id]) return RESTAURANT_DETAILS[id];

    // Fallback Mock
    const base = FEED_RESTAURANTS.find(r => r.id === id) || FEED_RESTAURANTS[0];
    return {
        ...base,
        ratingCount: '1K+',
        address: 'Downtown, New York, NY',
        offerCount: 2,
        images: [
            base.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop'
        ],
        featuredDish: 'Special Dish',
        tags: ['Popular', 'Highly Rated'],
        menuSections: [
            {
                title: 'Recommended',
                data: [
                    { id: 'm1', name: 'Signature Dish', price: 15.99, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop', isVeg: true, desc: 'Chef\'s special creation.', customizable: true, isBestseller: true },
                    { id: 'm2', name: 'Classic Meal', price: 12.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop', isVeg: false, desc: 'A classic favorite.', customizable: false },
                ]
            },
            {
                title: 'Mains',
                data: [
                    { id: 'm3', name: 'Family Platter', price: 25.99, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop', isVeg: false, desc: 'Great for sharing.', customizable: true },
                ]
            }
        ]
    };
};
