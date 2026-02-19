import { createClient } from '@sanity/client'

const token = 'skcT46hrhfwua0a9RcGAMP7ksH5K9LKD0ffz9hTnrW7paADurHQ7ClnNUyIfSzPqyMI42UYzYknaUavk3Jvf8NDTohR12o3pvyqWzmf2hzw08FRtd4iztucyyeZwM2xyWWJy1CO4FQ2iIUtDO82tRwcXFxcVT963Wdtnw68jJhM0KX0iJN7t'
const projectId = 'e5j0xnxe'
const dataset = 'production'

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2023-05-03',
    useCdn: false,
})

const standardPackages = [
    // Class 8-9
    {
        title: 'Discover',
        category: 'class-8-9',
        packageType: 'pkg-1',
        price: '5500',
        features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Live webinar invites'],
        section: 'standard',
        isPopular: false
    },
    {
        title: 'Discover Plus+',
        category: 'class-8-9',
        packageType: 'pkg-2',
        price: '15000',
        features: ['Psychometric assessments', '8 career counselling sessions (1/year)', 'Custom reports & study abroad guidance', 'CV building'],
        section: 'standard',
        isPopular: true
    },
    // Class 10-12
    {
        title: 'Achieve Online',
        category: 'class-10-12',
        packageType: 'pkg-3',
        price: '5999',
        features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
        section: 'standard',
        isPopular: false
    },
    {
        title: 'Achieve Plus+',
        category: 'class-10-12',
        packageType: 'pkg-4',
        price: '10599',
        features: ['Psychometric assessment', '4 career counselling sessions', 'Custom reports & study abroad guidance', 'CV reviews'],
        section: 'standard',
        isPopular: true
    },
    // Graduates
    {
        title: 'Ascend Online',
        category: 'graduates',
        packageType: 'pkg-5',
        price: '6499',
        features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
        section: 'standard',
        isPopular: false
    },
    {
        title: 'Ascend Plus+',
        category: 'graduates',
        packageType: 'pkg-6',
        price: '10599',
        features: ['Psychometric assessment', '3 career counselling sessions', 'Certificate/online course info', 'CV reviews for jobs'],
        section: 'standard',
        isPopular: true
    },
    // Working Professionals
    {
        title: 'Ascend Online',
        category: 'working-professionals',
        packageType: 'mp-3',
        price: '6499',
        features: ['Psychometric assessment', '1 career counselling session', 'Lifetime Knowledge Gateway access', 'Pre-recorded webinars'],
        section: 'standard',
        isPopular: false
    },
    {
        title: 'Ascend Plus+',
        category: 'working-professionals',
        packageType: 'mp-2',
        price: '10599',
        features: ['Psychometric assessment', '3 career counselling sessions', 'Certificate/online course info', 'CV reviews for jobs'],
        section: 'standard',
        isPopular: true
    }
];

const customPackages = [
    {
        title: 'Career Report',
        packageType: 'career-report',
        price: '1500',
        description: 'Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider.',
        features: [],
        section: 'custom'
    },
    {
        title: 'Career Report + Career Counselling',
        packageType: 'career-report-counselling',
        price: '3000',
        description: "Connect with India's top career coaches to analyse your psychometric report and shortlist the top three career paths you're most likely to enjoy and excel at.",
        features: [],
        section: 'custom'
    },
    {
        title: 'Knowledge Gateway + Career Helpline Access',
        packageType: 'knowledge-gateway',
        price: '100',
        description: "Unlock holistic information on your career paths and get direct access to Mentoria's experts, who will resolve your career-related queries through our dedicated Career Helpline. Validate your career decisions from now until you land a job you love.",
        features: [],
        section: 'custom'
    },
    {
        title: 'One-to-One Session with a Career Expert',
        packageType: 'one-to-one-session',
        price: '3500',
        description: 'Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field.',
        features: [],
        section: 'custom'
    },
    {
        title: 'College Admission Planning',
        packageType: 'college-admission-planning',
        price: '3000',
        description: 'Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner.',
        features: [],
        section: 'custom'
    },
    {
        title: 'Exam Stress Management',
        packageType: 'exam-stress-management',
        price: '1000',
        description: "Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India's top educators. Increase your chances of acing exams with a calm and clear mind.",
        features: [],
        section: 'custom'
    },
    {
        title: 'College Admissions Planner - 100 (CAP-100)',
        packageType: 'cap-100',
        price: '199',
        description: '₹199 for a ranked list of the top 100 colleges in your course. Get an expert-curated list of colleges based on verified cut-offs. CAP-100 ranks the top 100 colleges into four tiers to help you plan smarter: Indian Ivy League, Target, Smart Backup, and Safe Bet colleges. You can then shortlist colleges based on where you stand!',
        features: [],
        section: 'custom'
    }
];

async function migrate() {
    console.log('Starting V2 migration...')

    // 1. Delete ALL existing pricing to avoid duplicates/confusion
    try {
        await client.delete({ query: '*[_type == "pricing"]' })
        console.log('Deleted existing pricing packages.')
    } catch (e) {
        console.log('Error deleting (might be empty):', e)
    }

    // 2. Insert Standard Packages
    for (const pkg of standardPackages) {
        await client.create({
            _type: 'pricing',
            ...pkg
        })
        console.log(`Created Standard: ${pkg.title} (${pkg.category})`)
    }

    // 3. Insert Custom Packages
    for (const pkg of customPackages) {
        await client.create({
            _type: 'pricing',
            ...pkg
        })
        console.log(`Created Custom: ${pkg.title}`)
    }

    console.log('V2 Migration complete!')
}

migrate().catch(console.error)
