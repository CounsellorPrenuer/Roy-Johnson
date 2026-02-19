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

async function migrate() {
    console.log('Starting migration...')

    // 1. Update all existing pricing documents to be 'standard' if section is not set
    const existingWrapper = await client.fetch(`*[_type == "pricing" && !defined(section)]`)

    console.log(`Found ${existingWrapper.length} pricing documents to update to 'standard'...`)

    const transaction = client.transaction()
    existingWrapper.forEach((doc: any) => {
        transaction.patch(doc._id, p => p.set({ section: 'standard' }))
    })

    if (existingWrapper.length > 0) {
        await transaction.commit()
        console.log('Updated existing docs.')
    }

    // 2. Check if 'custom' packages exist, if not create them
    const customDocs = await client.fetch(`*[_type == "pricing" && section == "custom"]`)

    if (customDocs.length === 0) {
        console.log('Creating placeholder custom packages...')

        const customPackages = [
            {
                _type: 'pricing',
                title: '1-on-1 Hourly Session',
                section: 'custom',
                packageType: 'custom_hourly',
                description: 'Focused guidance on a specific topic of your choice.',
                features: ['1 Hour Video Call', 'Resume Review', 'Recorded Session'],
                price: '2500',
                isPopular: false
            },
            {
                _type: 'pricing',
                title: 'Project Consultation',
                section: 'custom',
                packageType: 'custom_project',
                description: 'End-to-end support for your specific project needs.',
                features: ['Project Strategy', 'Weekly Check-ins', 'Direct Support'],
                price: '15000',
                isPopular: true
            }
        ]

        for (const pkg of customPackages) {
            await client.create(pkg)
            console.log(`Created ${pkg.title}`)
        }
    } else {
        console.log('Custom packages already exist, skipping creation.')
    }

    console.log('Migration complete!')
}

migrate().catch(console.error)
