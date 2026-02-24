export interface AdminEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    status: 'Open' | 'Closed' | 'Upcoming';
    applicants: number;
    maxCapacity: number;
    image: string;
    description: string;
    questions: EventQuestion[];
    evaluationCriteria?: EvaluationCriterion[];
}

export interface EventQuestion {
    id: string;
    text: string;
    type: 'Long Text' | 'Short Text' | 'File Upload' | 'URL' | 'Multiple Choice' | 'Yes/No';
    required: boolean;
}

export interface EvaluationCriterion {
    id?: string;
    key?: string;
    label: string;
    description: string;
    color?: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    startup: string;
    startupId: string;
    avatar: string;
    status: 'Active' | 'Pending' | 'Suspended';
    bio: string;
    skills: string[];
    applied: number;
    accepted: number;
    joinDate: string;
    phone: string;
    linkedin: string;
    github: string;
    applications: UserApplication[];
}

export interface UserApplication {
    eventTitle: string;
    eventId: string;
    date: string;
    status: 'Accepted' | 'Rejected' | 'Pending' | 'Under Review';
    score?: number;
}

export interface Applicant {
    id: string;
    userId: string;
    name: string;
    email: string;
    startup: string;
    avatar: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Under Review';
    submittedAt: string;
    answers: { question: string; answer: string; type: 'text' | 'file' | 'url' }[];
}

export interface Startup {
    id: string;
    name: string;
    founderId: string;
    founderName: string;
    logo: string;
    industry: string;
    stage: 'Idea' | 'Pre-Seed' | 'Seed' | 'Series A';
    status: 'Active' | 'On Hold' | 'Graduated' | 'Pending' | 'Rejected';
    pitchDate?: string;
    description: string;
    foundedDate: string;
    teamSize: number;
    funding: string;
    progress: number;
    milestones: Milestone[];
    metrics: { label: string; value: string }[];
    members: { name: string; role: string; avatar: string }[];
}

export interface Milestone {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    date: string;
    description: string;
}

export const questionSuggestions: string[] = [
    'Describe your innovation and how it relates to this event\'s theme.',
    'What problem does your startup solve?',
    'Upload your pitch deck.',
    'Link to your GitHub repository or demo.',
    'What is your business model?',
    'Describe your team and their relevant experience.',
    'What is your current traction or progress?',
    'Upload a technical whitepaper or documentation.',
    'What funding have you received so far?',
    'How do you plan to scale your solution?',
    'What is your competitive advantage?',
    'Provide a link to your product demo or prototype.',
    'What are your key milestones for the next 12 months?',
    'Describe the market opportunity and target audience.',
    'What partnerships or collaborations do you have?',
    'Upload your financial projections document.',
];

export const evaluationCriteria: EvaluationCriterion[] = [
    { key: 'technicalDepth', label: 'Technical Depth', description: 'Quality of technology and innovation', color: '#00E5FF' },
    { key: 'businessModel', label: 'Business Model', description: 'Revenue strategy and market fit', color: '#00FFC2' },
    { key: 'oralPresentation', label: 'Oral Presentation', description: 'Communication and clarity of pitch', color: '#7B2FFF' },
    { key: 'marketPotential', label: 'Market Potential', description: 'Size of opportunity and growth potential', color: '#6366f1' },
    { key: 'teamCapability', label: 'Team Capability', description: 'Skills, experience, and team dynamics', color: '#f59e0b' },
    { key: 'innovation', label: 'Innovation & Originality', description: 'Uniqueness of approach and solution', color: '#ec4899' },
    { key: 'scalability', label: 'Scalability', description: 'Ability to grow and expand the solution', color: '#14b8a6' },
    { key: 'socialImpact', label: 'Social Impact', description: 'Positive societal and environmental contribution', color: '#8b5cf6' },
];

export const adminEvents: AdminEvent[] = [
    {
        id: '1',
        title: 'Quantum Hackathon 2026',
        date: 'March 15-17, 2026',
        location: 'Q-AI Innovation Lab, Tunis',
        category: 'Quantum Computing',
        status: 'Open',
        applicants: 45,
        maxCapacity: 60,
        image: 'https://picsum.photos/seed/quantum/600/400',
        description: 'A 48-hour hackathon challenging teams to build quantum algorithms that solve real-world optimization problems in logistics, healthcare, and finance.',
        questions: [
            { id: 'q1', text: 'Describe your innovation and how it uses quantum computing.', type: 'Long Text', required: true },
            { id: 'q2', text: 'Upload your pitch deck.', type: 'File Upload', required: true },
            { id: 'q3', text: 'Link to your GitHub repository.', type: 'URL', required: false },
        ],
    },
    {
        id: '2',
        title: 'AI Workshop Series',
        date: 'April 5-7, 2026',
        location: 'TechHub Campus, Sousse',
        category: 'Artificial Intelligence',
        status: 'Open',
        applicants: 78,
        maxCapacity: 100,
        image: 'https://picsum.photos/seed/aiworkshop/600/400',
        description: 'Intensive 3-day workshop covering transformer architectures, reinforcement learning, and deploying production ML pipelines.',
        questions: [
            { id: 'q1', text: 'What is your experience with machine learning?', type: 'Long Text', required: true },
            { id: 'q2', text: 'Upload your CV or resume.', type: 'File Upload', required: true },
            { id: 'q3', text: 'Link to any published research or projects.', type: 'URL', required: false },
        ],
    },
    {
        id: '3',
        title: 'Robotics Innovation Showcase',
        date: 'May 10, 2026',
        location: 'National Science Center, Sfax',
        category: 'Robotics',
        status: 'Upcoming',
        applicants: 32,
        maxCapacity: 50,
        image: 'https://picsum.photos/seed/robotics/600/400',
        description: 'Showcase your robotics prototypes to industry experts and investors. Top 3 teams receive seed funding and mentorship.',
        questions: [
            { id: 'q1', text: 'Describe your robotics project.', type: 'Long Text', required: true },
            { id: 'q2', text: 'Upload a video demo or presentation.', type: 'File Upload', required: true },
        ],
    },
    {
        id: '4',
        title: 'Blockchain & Web3 Summit',
        date: 'June 20-21, 2026',
        location: 'Digital Innovation Park, Ariana',
        category: 'Blockchain',
        status: 'Upcoming',
        applicants: 56,
        maxCapacity: 80,
        image: 'https://picsum.photos/seed/blockchain/600/400',
        description: 'Explore decentralized finance, smart contracts, and the future of Web3 infrastructure with leading blockchain developers.',
        questions: [
            { id: 'q1', text: 'Describe your experience with blockchain technologies.', type: 'Long Text', required: true },
            { id: 'q2', text: 'Upload your pitch deck.', type: 'File Upload', required: true },
            { id: 'q3', text: 'Link to any deployed smart contracts or dApps.', type: 'URL', required: false },
        ],
    },
    {
        id: '5',
        title: 'BioTech Innovation Lab',
        date: 'February 1-3, 2026',
        location: 'Medical Research Institute, Monastir',
        category: 'BioTech',
        status: 'Closed',
        applicants: 41,
        maxCapacity: 40,
        image: 'https://picsum.photos/seed/biotech/600/400',
        description: 'Hands-on lab sessions combining computational biology with AI-driven drug discovery.',
        questions: [
            { id: 'q1', text: 'What is your background in biotech or life sciences?', type: 'Long Text', required: true },
            { id: 'q2', text: 'Upload your research proposal.', type: 'File Upload', required: true },
        ],
    },
    {
        id: '6',
        title: 'Cybersecurity CTF Challenge',
        date: 'July 8-9, 2026',
        location: 'CyberArena, Bizerte',
        category: 'Cybersecurity',
        status: 'Open',
        applicants: 63,
        maxCapacity: 80,
        image: 'https://picsum.photos/seed/cybersecurity/600/400',
        description: 'Capture-the-flag competition testing skills in penetration testing, cryptography, reverse engineering, and incident response.',
        questions: [
            { id: 'q1', text: 'Describe your cybersecurity skills and certifications.', type: 'Long Text', required: true },
            { id: 'q2', text: 'Link to your CTF profile or writeups.', type: 'URL', required: false },
        ],
    },
];

export const adminUsers: AdminUser[] = [
    {
        id: 'u1', name: 'Amine Ben Ali', email: 'amine.benali@mail.com', role: 'Founder & CEO',
        startup: 'NeuroQuant Solutions', startupId: 's1', avatar: 'AB', status: 'Active',
        bio: 'Quantum computing researcher turned entrepreneur. Building hybrid quantum-neural networks for drug discovery.',
        skills: ['Quantum Computing', 'Machine Learning', 'Python', 'Qiskit'],
        applied: 4, accepted: 3, joinDate: 'Jan 2025', phone: '+216 555 0101',
        linkedin: 'linkedin.com/in/aminebenali', github: 'github.com/aminebenali',
        applications: [
            { eventTitle: 'Quantum Hackathon 2026', eventId: '1', date: 'Feb 28, 2026', status: 'Accepted', score: 9.2 },
            { eventTitle: 'AI Workshop Series', eventId: '2', date: 'Mar 10, 2026', status: 'Accepted', score: 8.7 },
            { eventTitle: 'BioTech Innovation Lab', eventId: '5', date: 'Jan 15, 2026', status: 'Accepted', score: 8.5 },
            { eventTitle: 'Cybersecurity CTF Challenge', eventId: '6', date: 'Jun 20, 2026', status: 'Pending' },
        ],
    },
    {
        id: 'u2', name: 'Sara Meziane', email: 'sara.mez@mail.com', role: 'CTO',
        startup: 'Carthage Vision', startupId: 's2', avatar: 'SM', status: 'Active',
        bio: 'Computer vision specialist with 5 years of experience in autonomous systems.',
        skills: ['Computer Vision', 'PyTorch', 'CUDA', 'Edge Computing'],
        applied: 3, accepted: 2, joinDate: 'Mar 2025', phone: '+216 555 0202',
        linkedin: 'linkedin.com/in/sarameziane', github: 'github.com/saramez',
        applications: [
            { eventTitle: 'AI Workshop Series', eventId: '2', date: 'Mar 12, 2026', status: 'Accepted', score: 9.5 },
            { eventTitle: 'Robotics Innovation Showcase', eventId: '3', date: 'Apr 15, 2026', status: 'Accepted', score: 8.9 },
            { eventTitle: 'Blockchain & Web3 Summit', eventId: '4', date: 'May 28, 2026', status: 'Rejected' },
        ],
    },
    {
        id: 'u3', name: 'Youcef Krim', email: 'youcef.k@mail.com', role: 'Lead Engineer',
        startup: 'ChainSecure', startupId: 's3', avatar: 'YK', status: 'Active',
        bio: 'Blockchain security expert specializing in smart contract auditing and DeFi protocol design.',
        skills: ['Solidity', 'Rust', 'Smart Contracts', 'Cryptography'],
        applied: 2, accepted: 2, joinDate: 'Jun 2025', phone: '+216 555 0303',
        linkedin: 'linkedin.com/in/youcefkrim', github: 'github.com/youcefkrim',
        applications: [
            { eventTitle: 'Blockchain & Web3 Summit', eventId: '4', date: 'May 25, 2026', status: 'Accepted', score: 9.8 },
            { eventTitle: 'Cybersecurity CTF Challenge', eventId: '6', date: 'Jun 18, 2026', status: 'Accepted', score: 9.1 },
        ],
    },
    {
        id: 'u4', name: 'Lina Hadj', email: 'lina.hadj@mail.com', role: 'Research Lead',
        startup: 'BioData TN', startupId: 's4', avatar: 'LH', status: 'Active',
        bio: 'Bioinformatics researcher combining AI with genomic analysis to accelerate personalized medicine.',
        skills: ['Bioinformatics', 'R', 'TensorFlow', 'Genomics'],
        applied: 3, accepted: 3, joinDate: 'Feb 2025', phone: '+216 555 0404',
        linkedin: 'linkedin.com/in/linahadj', github: 'github.com/linahadj',
        applications: [
            { eventTitle: 'BioTech Innovation Lab', eventId: '5', date: 'Jan 12, 2026', status: 'Accepted', score: 9.6 },
            { eventTitle: 'AI Workshop Series', eventId: '2', date: 'Mar 11, 2026', status: 'Accepted', score: 9.0 },
            { eventTitle: 'Quantum Hackathon 2026', eventId: '1', date: 'Feb 27, 2026', status: 'Accepted', score: 8.8 },
        ],
    },
    {
        id: 'u5', name: 'Karim Bouzid', email: 'karim.b@mail.com', role: 'Product Manager',
        startup: 'AgriDrones Carthage', startupId: 's5', avatar: 'KB', status: 'Pending',
        bio: 'Building autonomous drone fleets for agricultural monitoring.',
        skills: ['Drone Tech', 'Product Strategy', 'Agile', 'Sensors'],
        applied: 2, accepted: 1, joinDate: 'Aug 2025', phone: '+216 555 0505',
        linkedin: 'linkedin.com/in/karimbouzid', github: 'github.com/karimbouzid',
        applications: [
            { eventTitle: 'Robotics Innovation Showcase', eventId: '3', date: 'Apr 18, 2026', status: 'Accepted', score: 8.4 },
            { eventTitle: 'AI Workshop Series', eventId: '2', date: 'Mar 14, 2026', status: 'Under Review' },
        ],
    },
    {
        id: 'u6', name: 'Nadia Ferhat', email: 'nadia.f@mail.com', role: 'ML Engineer',
        startup: 'Fusha AI', startupId: 's6', avatar: 'NF', status: 'Active',
        bio: 'NLP specialist building multilingual AI models for Arabic dialects.',
        skills: ['NLP', 'Transformers', 'Arabic NLP', 'HuggingFace'],
        applied: 3, accepted: 2, joinDate: 'Apr 2025', phone: '+216 555 0606',
        linkedin: 'linkedin.com/in/nadiaferhat', github: 'github.com/nadiaferhat',
        applications: [
            { eventTitle: 'AI Workshop Series', eventId: '2', date: 'Mar 9, 2026', status: 'Accepted', score: 9.3 },
            { eventTitle: 'Quantum Hackathon 2026', eventId: '1', date: 'Feb 26, 2026', status: 'Accepted', score: 7.8 },
            { eventTitle: 'Cybersecurity CTF Challenge', eventId: '6', date: 'Jun 19, 2026', status: 'Pending' },
        ],
    },
    {
        id: 'u7', name: 'Omar Tazi', email: 'omar.tazi@mail.com', role: 'Hardware Engineer',
        startup: 'Tunis Sensors', startupId: 's7', avatar: 'OT', status: 'Active',
        bio: 'Nanotechnology researcher designing next-gen biosensors for environmental monitoring.',
        skills: ['Nanotechnology', 'MEMS', 'Embedded C', 'Sensors'],
        applied: 2, accepted: 1, joinDate: 'May 2025', phone: '+216 555 0707',
        linkedin: 'linkedin.com/in/omartazi', github: 'github.com/omartazi',
        applications: [
            { eventTitle: 'BioTech Innovation Lab', eventId: '5', date: 'Jan 14, 2026', status: 'Accepted', score: 8.6 },
            { eventTitle: 'Robotics Innovation Showcase', eventId: '3', date: 'Apr 16, 2026', status: 'Pending' },
        ],
    },
    {
        id: 'u8', name: 'Amira Slimani', email: 'amira.s@mail.com', role: 'Data Scientist',
        startup: 'CyberShield TN', startupId: 's8', avatar: 'AS', status: 'Suspended',
        bio: 'Cybersecurity data scientist developing AI-powered threat detection systems.',
        skills: ['Cybersecurity', 'Data Science', 'Network Security', 'Python'],
        applied: 1, accepted: 0, joinDate: 'Sep 2025', phone: '+216 555 0808',
        linkedin: 'linkedin.com/in/amiraslimani', github: 'github.com/amiraslimani',
        applications: [
            { eventTitle: 'Cybersecurity CTF Challenge', eventId: '6', date: 'Jun 21, 2026', status: 'Rejected' },
        ],
    },
];

export const startups: Startup[] = [
    {
        id: 's1', name: 'NeuroQuant Solutions', founderId: 'u1', founderName: 'Amine Ben Ali',
        logo: 'NQ', industry: 'HealthTech / Quantum', stage: 'Seed', status: 'Active',
        description: 'Building hybrid quantum-neural network architectures for accelerated drug discovery.',
        foundedDate: 'Jan 2025', teamSize: 4, funding: '$120K', progress: 72,
        milestones: [
            { id: 'm1', title: 'MVP Development', status: 'completed', date: 'Mar 2025', description: 'Completed quantum simulation core engine' },
            { id: 'm2', title: 'Beta Launch', status: 'completed', date: 'Aug 2025', description: 'Launched beta with 3 pharmaceutical partners' },
            { id: 'm3', title: 'Seed Round', status: 'completed', date: 'Nov 2025', description: 'Secured $120K seed funding' },
            { id: 'm4', title: 'Clinical Trials Partnership', status: 'in-progress', date: 'Feb 2026', description: 'Partnering with medical research institute' },
            { id: 'm5', title: 'Series A Preparation', status: 'upcoming', date: 'Jun 2026', description: 'Preparing for Series A round' },
        ],
        metrics: [
            { label: 'Revenue', value: '$8.5K/mo' }, { label: 'Users', value: '12' },
            { label: 'Growth', value: '+45%' }, { label: 'Burn Rate', value: '$6K/mo' },
        ],
        members: [
            { name: 'Amine Ben Ali', role: 'CEO', avatar: 'AB' }, { name: 'Yasmine K.', role: 'CTO', avatar: 'YK' },
            { name: 'Farid M.', role: 'Quantum Engineer', avatar: 'FM' }, { name: 'Dalila B.', role: 'Data Scientist', avatar: 'DB' },
        ],
    },
    {
        id: 's2', name: 'Carthage Vision', founderId: 'u2', founderName: 'Sara Meziane',
        logo: 'VA', industry: 'Computer Vision / Safety', stage: 'Pre-Seed', status: 'Active',
        description: 'Real-time object detection system for industrial safety.',
        foundedDate: 'Mar 2025', teamSize: 3, funding: '$45K', progress: 48,
        milestones: [
            { id: 'm1', title: 'Prototype Complete', status: 'completed', date: 'Jun 2025', description: 'Built first working prototype with 92% accuracy' },
            { id: 'm2', title: 'Pilot Program', status: 'in-progress', date: 'Jan 2026', description: 'Running pilot with 2 manufacturing plants' },
            { id: 'm3', title: 'Accuracy Target', status: 'upcoming', date: 'Apr 2026', description: 'Achieve 99% detection accuracy' },
            { id: 'm4', title: 'Pre-Seed Close', status: 'upcoming', date: 'Jul 2026', description: 'Close pre-seed round at $200K' },
        ],
        metrics: [
            { label: 'Revenue', value: '$2.1K/mo' }, { label: 'Pilots', value: '2' },
            { label: 'Accuracy', value: '94.3%' }, { label: 'Burn Rate', value: '$3.5K/mo' },
        ],
        members: [
            { name: 'Sara Meziane', role: 'CTO', avatar: 'SM' }, { name: 'Hichem A.', role: 'ML Engineer', avatar: 'HA' },
            { name: 'Rania T.', role: 'Product Designer', avatar: 'RT' },
        ],
    },
    {
        id: 's3', name: 'ChainSecure', founderId: 'u3', founderName: 'Youcef Krim',
        logo: 'CS', industry: 'Blockchain / Security', stage: 'Seed', status: 'Active',
        description: 'Smart contract auditing platform using AI to detect vulnerabilities in DeFi protocols.',
        foundedDate: 'Jun 2025', teamSize: 5, funding: '$200K', progress: 65,
        milestones: [
            { id: 'm1', title: 'Platform Launch', status: 'completed', date: 'Sep 2025', description: 'Launched auditing platform v1.0' },
            { id: 'm2', title: 'First 10 Clients', status: 'completed', date: 'Dec 2025', description: 'Onboarded 10 DeFi protocol clients' },
            { id: 'm3', title: 'AI Audit Engine', status: 'in-progress', date: 'Mar 2026', description: 'Developing AI-powered automated audit reports' },
            { id: 'm4', title: 'Enterprise Tier', status: 'upcoming', date: 'Jul 2026', description: 'Launch enterprise audit subscription' },
        ],
        metrics: [
            { label: 'Revenue', value: '$15K/mo' }, { label: 'Clients', value: '18' },
            { label: 'Audits Done', value: '47' }, { label: 'Growth', value: '+62%' },
        ],
        members: [
            { name: 'Youcef Krim', role: 'Lead Engineer', avatar: 'YK' }, { name: 'Anis D.', role: 'Security Researcher', avatar: 'AD' },
            { name: 'Meriem S.', role: 'Frontend Dev', avatar: 'MS' }, { name: 'Bilal H.', role: 'Smart Contract Dev', avatar: 'BH' },
            { name: 'Ines R.', role: 'Business Dev', avatar: 'IR' },
        ],
    },
    {
        id: 's4', name: 'BioData TN', founderId: 'u4', founderName: 'Lina Hadj',
        logo: 'GA', industry: 'BioTech / Genomics', stage: 'Pre-Seed', status: 'Active',
        description: 'AI-powered genomic analysis platform enabling real-time variant calling.',
        foundedDate: 'Feb 2025', teamSize: 3, funding: '$60K', progress: 55,
        milestones: [
            { id: 'm1', title: 'Research Publication', status: 'completed', date: 'May 2025', description: 'Published 2 papers in Nature Biotech' },
            { id: 'm2', title: 'Pipeline v1', status: 'completed', date: 'Oct 2025', description: 'Completed genomic analysis pipeline' },
            { id: 'm3', title: 'Hospital Partnership', status: 'in-progress', date: 'Feb 2026', description: 'Pilot with regional hospital network' },
            { id: 'm4', title: 'Regulatory Approval', status: 'upcoming', date: 'Aug 2026', description: 'Submit for medical device certification' },
        ],
        metrics: [
            { label: 'Revenue', value: '$1.2K/mo' }, { label: 'Samples', value: '340' },
            { label: 'Accuracy', value: '97.8%' }, { label: 'Publications', value: '12' },
        ],
        members: [
            { name: 'Lina Hadj', role: 'Research Lead', avatar: 'LH' }, { name: 'Samir N.', role: 'Bioinformatician', avatar: 'SN' },
            { name: 'Amina C.', role: 'Lab Technician', avatar: 'AC' },
        ],
    },
    {
        id: 's5', name: 'AgriDrones Carthage', founderId: 'u5', founderName: 'Karim Bouzid',
        logo: 'RF', industry: 'AgriTech / Drones', stage: 'Idea', status: 'Active',
        description: 'Autonomous drone fleets for precision agriculture.',
        foundedDate: 'Aug 2025', teamSize: 2, funding: '$10K', progress: 25,
        milestones: [
            { id: 'm1', title: 'Concept Validation', status: 'completed', date: 'Oct 2025', description: 'Validated concept with 3 farms' },
            { id: 'm2', title: 'Drone Prototype', status: 'in-progress', date: 'Feb 2026', description: 'Building first autonomous drone prototype' },
            { id: 'm3', title: 'Field Testing', status: 'upcoming', date: 'May 2026', description: 'Test with 10 farms in Mitidja region' },
        ],
        metrics: [
            { label: 'Revenue', value: '$0' }, { label: 'Farm Trials', value: '3' },
            { label: 'Coverage', value: '50 ha' }, { label: 'Burn Rate', value: '$1.5K/mo' },
        ],
        members: [
            { name: 'Karim Bouzid', role: 'Product Manager', avatar: 'KB' }, { name: 'Nassim Y.', role: 'Drone Engineer', avatar: 'NY' },
        ],
    },
    {
        id: 's6', name: 'Fusha AI', founderId: 'u6', founderName: 'Nadia Ferhat',
        logo: 'LB', industry: 'EdTech / NLP', stage: 'Pre-Seed', status: 'Active',
        description: 'Multilingual AI models for Arabic dialects, building language tools that bridge education gaps.',
        foundedDate: 'Apr 2025', teamSize: 4, funding: '$80K', progress: 60,
        milestones: [
            { id: 'm1', title: 'Model Training', status: 'completed', date: 'Jul 2025', description: 'Trained base model on 5 Arabic dialects' },
            { id: 'm2', title: 'Chrome Extension', status: 'completed', date: 'Nov 2025', description: 'Launched browser extension with 2K users' },
            { id: 'm3', title: 'Mobile App', status: 'in-progress', date: 'Mar 2026', description: 'Developing mobile app for students' },
            { id: 'm4', title: 'Ministry Partnership', status: 'upcoming', date: 'Jun 2026', description: 'Partner with Education Ministry' },
        ],
        metrics: [
            { label: 'Users', value: '2,340' }, { label: 'Translations', value: '89K' },
            { label: 'Accuracy', value: '91.2%' }, { label: 'Growth', value: '+38%' },
        ],
        members: [
            { name: 'Nadia Ferhat', role: 'ML Engineer', avatar: 'NF' }, { name: 'Rachid M.', role: 'NLP Researcher', avatar: 'RM' },
            { name: 'Fatima Z.', role: 'Mobile Dev', avatar: 'FZ' }, { name: 'Ali K.', role: 'Linguist', avatar: 'AK' },
        ],
    },
    {
        id: 's7', name: 'Tunis Sensors', founderId: 'u7', founderName: 'Omar Tazi',
        logo: 'NS', industry: 'CleanTech / Sensors', stage: 'Idea', status: 'On Hold',
        description: 'Next-gen biosensors for environmental monitoring.',
        foundedDate: 'May 2025', teamSize: 2, funding: '$5K', progress: 15,
        milestones: [
            { id: 'm1', title: 'Lab Prototype', status: 'completed', date: 'Aug 2025', description: 'Developed first biosensor prototype in lab' },
            { id: 'm2', title: 'Sensor Calibration', status: 'in-progress', date: 'Jan 2026', description: 'Calibrating sensors for field conditions' },
            { id: 'm3', title: 'Pilot Deployment', status: 'upcoming', date: 'Jun 2026', description: 'Deploy sensors in 3 water treatment plants' },
        ],
        metrics: [
            { label: 'Revenue', value: '$0' }, { label: 'Sensors Built', value: '8' },
            { label: 'Accuracy', value: '88%' }, { label: 'Patents Filed', value: '1' },
        ],
        members: [
            { name: 'Omar Tazi', role: 'Hardware Engineer', avatar: 'OT' }, { name: 'Leila S.', role: 'Chemistry Researcher', avatar: 'LS' },
        ],
    },
    {
        id: 's8', name: 'CyberShield TN', founderId: 'u8', founderName: 'Amira Slimani',
        logo: 'CD', industry: 'Cybersecurity', stage: 'Idea', status: 'On Hold',
        description: 'AI-powered threat detection system designed for North African enterprises.',
        foundedDate: 'Sep 2025', teamSize: 1, funding: '$0', progress: 10,
        milestones: [
            { id: 'm1', title: 'Research Phase', status: 'in-progress', date: 'Dec 2025', description: 'Researching threat detection algorithms' },
            { id: 'm2', title: 'MVP', status: 'upcoming', date: 'Apr 2026', description: 'Build minimum viable product' },
        ],
        metrics: [
            { label: 'Revenue', value: '$0' }, { label: 'Algorithms', value: '3' },
            { label: 'Test Cases', value: '156' }, { label: 'Datasets', value: '5' },
        ],
        members: [
            { name: 'Amira Slimani', role: 'Data Scientist', avatar: 'AS' },
        ],
    },
    {
        id: 's9', name: 'Quantum Leap Labs', founderId: 'u9', founderName: 'Sami Khelil',
        logo: 'QL', industry: 'Quantum Computing', stage: 'Seed', status: 'Pending',
        description: 'Developing error-correction algorithms for near-term quantum devices.',
        foundedDate: 'Jan 2026', teamSize: 5, funding: '$0', progress: 5,
        milestones: [],
        metrics: [
            { label: 'Waitlist', value: '45' }, { label: 'Prototypes', value: '2' },
        ],
        members: [
            { name: 'Sami Khelil', role: 'Founder', avatar: 'SK' },
            { name: 'Ines B.', role: 'Quantum Physicist', avatar: 'IB' },
        ],
    },
    {
        id: 's10', name: 'EcoTrack Tunisia', founderId: 'u10', founderName: 'Fatma Baccar',
        logo: 'ET', industry: 'GreenTech', stage: 'Idea', status: 'Pending',
        description: 'IoT-based real-time pollution monitoring for industrial zones.',
        foundedDate: 'Dec 2025', teamSize: 3, funding: '$0', progress: 12,
        milestones: [],
        metrics: [
            { label: 'Sensors', value: '10' }, { label: 'Partners', value: '1' },
        ],
        members: [
            { name: 'Fatma Baccar', role: 'Founder', avatar: 'FB' },
            { name: 'Mehdi Z.', role: 'IoT Engineer', avatar: 'MZ' },
        ],
    },
];

export const applicantsByEvent: Record<string, Applicant[]> = {
    '1': [
        {
            id: 'a1', userId: 'u1', name: 'Amine Ben Ali', email: 'amine.benali@mail.com',
            startup: 'NeuroQuant Solutions', avatar: 'AB', status: 'Accepted', submittedAt: 'Feb 28, 2026',
            answers: [
                { question: 'Describe your innovation and how it uses quantum computing.', answer: 'We are building a hybrid quantum-neural network architecture that leverages quantum entanglement for molecular simulation. Our approach reduces drug discovery computation time by 100x.', type: 'text' },
                { question: 'Upload your pitch deck.', answer: 'pitch_v2.pdf', type: 'file' },
                { question: 'Link to your GitHub repository.', answer: 'https://github.com/neuroquant/quantum-nn', type: 'url' },
            ],
        },
        {
            id: 'a4', userId: 'u4', name: 'Lina Hadj', email: 'lina.hadj@mail.com',
            startup: 'BioData TN', avatar: 'LH', status: 'Accepted', submittedAt: 'Feb 27, 2026',
            answers: [
                { question: 'Describe your innovation and how it uses quantum computing.', answer: 'BioData TN applies quantum machine learning to genomic sequence analysis.', type: 'text' },
                { question: 'Upload your pitch deck.', answer: 'genomicai_pitch.pdf', type: 'file' },
                { question: 'Link to your GitHub repository.', answer: 'https://github.com/genomicai/quantum-genomics', type: 'url' },
            ],
        },
        {
            id: 'a6', userId: 'u6', name: 'Nadia Ferhat', email: 'nadia.f@mail.com',
            startup: 'Fusha AI', avatar: 'NF', status: 'Accepted', submittedAt: 'Feb 26, 2026',
            answers: [
                { question: 'Describe your innovation and how it uses quantum computing.', answer: 'Fusha AI explores quantum natural language processing for Arabic dialects.', type: 'text' },
                { question: 'Upload your pitch deck.', answer: 'langbridge_deck.pdf', type: 'file' },
            ],
        },
    ],
    '2': [
        {
            id: 'a2', userId: 'u2', name: 'Sara Meziane', email: 'sara.mez@mail.com',
            startup: 'Carthage Vision', avatar: 'SM', status: 'Accepted', submittedAt: 'Mar 12, 2026',
            answers: [
                { question: 'What is your experience with machine learning?', answer: '5 years of experience in computer vision and deep learning.', type: 'text' },
                { question: 'Upload your CV or resume.', answer: 'sara_cv.pdf', type: 'file' },
            ],
        },
        {
            id: 'a4b', userId: 'u4', name: 'Lina Hadj', email: 'lina.hadj@mail.com',
            startup: 'BioData TN', avatar: 'LH', status: 'Accepted', submittedAt: 'Mar 11, 2026',
            answers: [
                { question: 'What is your experience with machine learning?', answer: 'PhD-level expertise in bioinformatics and AI.', type: 'text' },
                { question: 'Upload your CV or resume.', answer: 'lina_cv.pdf', type: 'file' },
            ],
        },
        {
            id: 'a6b', userId: 'u6', name: 'Nadia Ferhat', email: 'nadia.f@mail.com',
            startup: 'Fusha AI', avatar: 'NF', status: 'Accepted', submittedAt: 'Mar 9, 2026',
            answers: [
                { question: 'What is your experience with machine learning?', answer: 'NLP specialist with 4 years experience.', type: 'text' },
                { question: 'Upload your CV or resume.', answer: 'nadia_cv.pdf', type: 'file' },
            ],
        },
        {
            id: 'a5b', userId: 'u5', name: 'Karim Bouzid', email: 'karim.b@mail.com',
            startup: 'AgriDrones Carthage', avatar: 'KB', status: 'Under Review', submittedAt: 'Mar 14, 2026',
            answers: [
                { question: 'What is your experience with machine learning?', answer: 'Applied ML for drone path optimization.', type: 'text' },
                { question: 'Upload your CV or resume.', answer: 'karim_cv.pdf', type: 'file' },
            ],
        },
    ],
    '3': [
        {
            id: 'a2c', userId: 'u2', name: 'Sara Meziane', email: 'sara.mez@mail.com',
            startup: 'Carthage Vision', avatar: 'SM', status: 'Accepted', submittedAt: 'Apr 15, 2026',
            answers: [
                { question: 'Describe your robotics project.', answer: 'Real-time object detection system for industrial safety environments.', type: 'text' },
                { question: 'Upload a video demo or presentation.', answer: 'visionai_demo.mp4', type: 'file' },
            ],
        },
        {
            id: 'a5c', userId: 'u5', name: 'Karim Bouzid', email: 'karim.b@mail.com',
            startup: 'AgriDrones Carthage', avatar: 'KB', status: 'Accepted', submittedAt: 'Apr 18, 2026',
            answers: [
                { question: 'Describe your robotics project.', answer: 'Autonomous drone fleet for precision agriculture.', type: 'text' },
                { question: 'Upload a video demo or presentation.', answer: 'robofleet_demo.mp4', type: 'file' },
            ],
        },
    ],
    '4': [
        {
            id: 'a3d', userId: 'u3', name: 'Youcef Krim', email: 'youcef.k@mail.com',
            startup: 'ChainSecure', avatar: 'YK', status: 'Accepted', submittedAt: 'May 25, 2026',
            answers: [
                { question: 'Describe your experience with blockchain technologies.', answer: 'Blockchain security expert with 3+ years in smart contract auditing.', type: 'text' },
                { question: 'Upload your pitch deck.', answer: 'chainsecure_pitch.pdf', type: 'file' },
            ],
        },
    ],
    '5': [
        {
            id: 'a1e', userId: 'u1', name: 'Amine Ben Ali', email: 'amine.benali@mail.com',
            startup: 'NeuroQuant Solutions', avatar: 'AB', status: 'Accepted', submittedAt: 'Jan 15, 2026',
            answers: [
                { question: 'What is your background in biotech or life sciences?', answer: 'Building hybrid quantum-neural networks for drug discovery.', type: 'text' },
                { question: 'Upload your research proposal.', answer: 'neuroquant_proposal.pdf', type: 'file' },
            ],
        },
        {
            id: 'a4e', userId: 'u4', name: 'Lina Hadj', email: 'lina.hadj@mail.com',
            startup: 'BioData TN', avatar: 'LH', status: 'Accepted', submittedAt: 'Jan 12, 2026',
            answers: [
                { question: 'What is your background in biotech or life sciences?', answer: 'PhD-level bioinformatics researcher with 12 publications.', type: 'text' },
                { question: 'Upload your research proposal.', answer: 'genomicai_proposal.pdf', type: 'file' },
            ],
        },
        {
            id: 'a7e', userId: 'u7', name: 'Omar Tazi', email: 'omar.tazi@mail.com',
            startup: 'Tunis Sensors', avatar: 'OT', status: 'Accepted', submittedAt: 'Jan 14, 2026',
            answers: [
                { question: 'What is your background in biotech or life sciences?', answer: 'Nanotechnology researcher designing biosensors.', type: 'text' },
                { question: 'Upload your research proposal.', answer: 'nanosense_proposal.pdf', type: 'file' },
            ],
        },
    ],
    '6': [
        {
            id: 'a3f', userId: 'u3', name: 'Youcef Krim', email: 'youcef.k@mail.com',
            startup: 'ChainSecure', avatar: 'YK', status: 'Accepted', submittedAt: 'Jun 18, 2026',
            answers: [
                { question: 'Describe your cybersecurity skills and certifications.', answer: 'Expert in smart contract security and DeFi protocol design.', type: 'text' },
                { question: 'Link to your CTF profile or writeups.', answer: 'https://ctftime.org/youcefkrim', type: 'url' },
            ],
        },
        {
            id: 'a8f', userId: 'u8', name: 'Amira Slimani', email: 'amira.s@mail.com',
            startup: 'CyberShield TN', avatar: 'AS', status: 'Rejected', submittedAt: 'Jun 21, 2026',
            answers: [
                { question: 'Describe your cybersecurity skills and certifications.', answer: 'Data scientist with focus on AI-powered threat detection.', type: 'text' },
            ],
        },
    ],
};
