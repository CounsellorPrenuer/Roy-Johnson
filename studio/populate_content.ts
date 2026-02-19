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

const blogs = [
    {
        title: "Navigating Career Transitions in 2025",
        slug: { current: "navigating-career-transitions-2025" },
        publishedAt: new Date().toISOString(),
        excerpt: "The job market is evolving rapidly. Here are the key strategies to successfully pivot your career path this year.",
        body: [
            {
                _type: 'block',
                children: [{ _type: 'span', text: "In today's dynamic professional landscape, clinging to a single career path is becoming less common. Professionals are increasingly looking to pivot, upskill, and redefine their trajectories. But how do you navigate this change effectively?" }],
                style: 'normal'
            },
            {
                _type: 'block',
                children: [{ _type: 'span', text: "1. Identify Transferable Skills" }],
                style: 'h3'
            },
            {
                _type: 'block',
                children: [{ _type: 'span', text: "Your past experience is never wasted. Leadership, communication, and project management are valuable across almost all industries." }],
                style: 'normal'
            }
        ]
    },
    {
        title: "The Power of Personal Branding",
        slug: { current: "power-of-personal-branding" },
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        excerpt: "Your personal brand is your most valuable asset. Learn how to cultivate a presence that attracts opportunities.",
        body: [
            {
                _type: 'block',
                children: [{ _type: 'span', text: "Jeff Bezos famously said, 'Your brand is what other people say about you when you're not in the room.' In the digital age, this extends to your online presence, your network, and your portfolio." }],
                style: 'normal'
            }
        ]
    },
    {
        title: "Overcoming Imposter Syndrome",
        slug: { current: "overcoming-imposter-syndrome" },
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        excerpt: "Feeling like a fraud? You're not alone. Discover practical techniques to build confidence and own your achievements.",
        body: [
            {
                _type: 'block',
                children: [{ _type: 'span', text: "Imposter syndrome affects high achievers more than anyone else. It's that nagging voice that says you got here by luck, not merit. But constructing a factual record of your wins can help silence that voice." }],
                style: 'normal'
            }
        ]
    }
];

const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "Senior Product Manager",
        company: "Tech Innovators Inc.",
        content: "Roy's guidance was transformative. Within 6 months of our sessions, I secured a leadership role with a 40% salary increase. His strategic approach to career planning is unmatched.",
        rating: 5
    },
    {
        name: "James Patterson",
        role: "Marketing Director",
        company: "Global Brands Ltd.",
        content: "After feeling stuck in my career for years, Roy helped me identify my strengths and pivot to a role that truly aligns with my passions. The personalized roadmap he created was a game-changer.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "Software Engineer",
        company: "CloudTech Solutions",
        content: "As a fresher, I was overwhelmed by career choices. Roy's structured approach and industry insights helped me land my dream job at a top tech company. Highly recommend!",
        rating: 5
    }
];

async function populate() {
    console.log('Starting Content Population...');

    // 1. Populate Blogs
    for (const blog of blogs) {
        // Check if exists
        const existing = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: blog.slug.current })
        if (!existing) {
            await client.create({
                _type: 'post',
                ...blog
            })
            console.log(`Created Blog: ${blog.title}`)
        } else {
            console.log(`Blog exists: ${blog.title}`)
        }
    }

    // 2. Populate Testimonials
    // We'll just create them if we don't find duplicates by name
    for (const t of testimonials) {
        const existing = await client.fetch(`*[_type == "testimonial" && name == $name][0]`, { name: t.name })
        if (!existing) {
            await client.create({
                _type: 'testimonial',
                ...t
            })
            console.log(`Created Testimonial: ${t.name}`)
        } else {
            console.log(`Testimonial exists: ${t.name}`)
        }
    }

    console.log('Content Population Complete!');
}

populate().catch(console.error);
