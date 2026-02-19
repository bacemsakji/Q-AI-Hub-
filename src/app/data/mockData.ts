export interface Program {
  id: number;
  axis: string;
  title: string;
  description: string;
  professor: {
    name: string;
    photo: string;
  };
  color: string;
  /** Creative copy for the 3D card – about the axis idea */
  cardTagline: string;
  cardPillar: string;
}

export interface Event {
  id: number;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Talk';
  status: 'Open' | 'Closed' | 'Coming Soon';
  date: string;
  location: string;
  description: string;
}

export const programs: Program[] = [
  {
    id: 1,
    axis: 'Axe 01',
    title: 'Strategic Vision & Ecosystem Development',
    description: 'Building the strategic roadmap for Q-Ai Hub, fostering partnerships with industry leaders, and creating a sustainable innovation ecosystem that bridges academia and entrepreneurship.',
    professor: {
      name: 'Dr. Amira Ben Salah',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    color: '#00F5A0',
    cardTagline: 'Where strategy meets the future',
    cardPillar: 'Roadmaps · Partnerships · Impact',
  },
  {
    id: 2,
    axis: 'Axe 02',
    title: 'Formation & Skills Development',
    description: 'Designing cutting-edge training programs in Quantum Computing and AI, providing hands-on workshops, and developing entrepreneurial mindsets through intensive bootcamps and mentorship.',
    professor: {
      name: 'Prof. Karim Mansour',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    },
    color: '#00D9F5',
    cardTagline: 'Learn. Build. Ship.',
    cardPillar: 'Quantum & AI in your hands',
  },
  {
    id: 3,
    axis: 'Axe 03',
    title: 'Research & Innovation Labs',
    description: 'Leading advanced research in quantum algorithms, machine learning optimization, and deep tech applications. Publishing breakthrough findings and filing patents for novel innovations.',
    professor: {
      name: 'Dr. Leila Trabelsi',
      photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    },
    color: '#7B2FFF',
    cardTagline: 'From lab to breakthrough',
    cardPillar: 'Algorithms · Patents · Frontiers',
  },
  {
    id: 4,
    axis: 'Axe 04',
    title: 'Ecosystem & Community Building',
    description: 'Creating vibrant networks connecting students, alumni, investors, and tech companies. Organizing hackathons, demo days, and fostering a culture of collaboration and innovation.',
    professor: {
      name: 'Prof. Mehdi Oueslati',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    color: '#FFB800',
    cardTagline: 'Connect. Collide. Create.',
    cardPillar: 'Hackathons · Networks · Culture',
  },
  {
    id: 5,
    axis: 'Axe 05',
    title: 'Startup Incubation & Acceleration',
    description: 'Providing seed funding, legal support, and go-to-market strategies for selected startups. Offering workspace, technical infrastructure, and direct access to venture capital networks.',
    professor: {
      name: 'Dr. Sonia Khelifi',
      photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
    },
    color: 'linear-gradient(135deg, #00F5A0 0%, #0061FF 100%)',
    cardTagline: 'From idea to venture',
    cardPillar: 'Seed · Scale · Ship',
  },
];

export const events: Event[] = [
  {
    id: 1,
    title: 'Quantum AI Hackathon 2026',
    type: 'Hackathon',
    status: 'Open',
    date: 'March 15-17, 2026',
    location: 'ENICarthage Campus',
    description: '48-hour intensive hackathon focusing on quantum-enhanced machine learning solutions for real-world problems.',
  },
  {
    id: 2,
    title: 'Introduction to Quantum Computing',
    type: 'Workshop',
    status: 'Open',
    date: 'February 28, 2026',
    location: 'Online',
    description: 'Beginner-friendly workshop covering quantum gates, superposition, and basic quantum algorithms.',
  },
  {
    id: 3,
    title: 'VC Pitch Masterclass',
    type: 'Talk',
    status: 'Coming Soon',
    date: 'April 5, 2026',
    location: 'Auditorium A',
    description: 'Learn from top investors how to craft compelling pitches and secure funding for deep tech ventures.',
  },
  {
    id: 4,
    title: 'AI Ethics & Regulation Symposium',
    type: 'Talk',
    status: 'Open',
    date: 'March 22, 2026',
    location: 'Hybrid',
    description: 'Panel discussion with industry experts on responsible AI development and emerging regulatory frameworks.',
  },
  {
    id: 5,
    title: 'Deep Tech Startup Bootcamp',
    type: 'Workshop',
    status: 'Closed',
    date: 'February 10-14, 2026',
    location: 'Q-Ai Hub Space',
    description: 'Intensive 5-day program on building scalable deep tech products from ideation to MVP.',
  },
  {
    id: 6,
    title: 'Neural Networks Workshop',
    type: 'Workshop',
    status: 'Open',
    date: 'March 8, 2026',
    location: 'Lab 204',
    description: 'Hands-on session building and training neural networks for computer vision applications.',
  },
];
