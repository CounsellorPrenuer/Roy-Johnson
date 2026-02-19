export default {
    name: 'pricing',
    title: 'Pricing Package',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Package Title',
            type: 'string',
        },
        {
            name: 'section',
            title: 'Section',
            type: 'string',
            description: 'Where should this package appear?',
            options: {
                list: [
                    { title: 'Standard Mentoria Packages', value: 'standard' },
                    { title: 'Customize Your Mentorship Plan', value: 'custom' },
                ],
                layout: 'radio'
            },
            initialValue: 'standard'
        },
        {
            name: 'packageType',
            title: 'Package Type ID',
            type: 'string',
            description: 'Unique ID for the package (e.g., discover, career-report). Used for payments.',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'string',
            description: 'Display price (e.g., 5,500). Leave empty for "Contact us".',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'isPopular',
            title: 'Is Popular?',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'category',
            title: 'Category (Standard Packages Only)',
            type: 'string',
            description: 'Only relevant if Section is "Standard"',
            options: {
                list: [
                    { title: 'Class 8th-9th', value: 'class-8-9' },
                    { title: 'Class 10th-12th', value: 'class-10-12' },
                    { title: 'Graduates', value: 'graduates' },
                    { title: 'Working Professionals', value: 'working-professionals' },
                ],
            },
        },
        {
            name: 'image',
            title: 'Package Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }
    ],
}
