import { createClient } from '@sanity/client'

const config = {
    projectId: 'e5j0xnxe',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: false,
    token: 'skcT46hrhfwua0a9RcGAMP7ksH5K9LKD0ffz9hTnrW7paADurHQ7ClnNUyIfSzPqyMI42UYzYknaUavk3Jvf8NDTohR12o3pvyqWzmf2hzw08FRtd4iztucyyeZwM2xyWWJy1CO4FQ2iIUtDO82tRwcXFxcVT963Wdtnw68jJhM0KX0iJN7t'
}

const client = createClient(config)

async function verify() {
    console.log(`Checking project: ${config.projectId}, dataset: ${config.dataset}`)
    try {
        const pricing = await client.fetch('*[_type == "pricing"]')
        console.log(`Found ${pricing.length} pricing documents.`)
        pricing.forEach((p: any) => {
            console.log(` - ${p.title} (${p.packageType}) [${p.section || 'standard'}]`)
        })
    } catch (e) {
        console.error("Error fetching data:", e)
    }
}

verify()
