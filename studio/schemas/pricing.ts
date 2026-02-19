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
            description: 'Used to map to the correct Razorpay button (e.g., discover, discovery_plus, achieve, achieve_plus, ascend, ascend_plus)',
            options: {
                list: [
                    { title: 'Discover', value: 'discover' },
                    { title: 'Discovery Plus', value: 'discovery_plus' },
                    { title: 'Achieve', value: 'achieve' },
                    { title: 'Achieve Plus', value: 'achieve_plus' },
                    { title: 'Ascend', value: 'ascend' },
                    { title: 'Ascend Plus', value: 'ascend_plus' },
                ],
            },
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
                    { title: 'Freshers', value: 'freshers' },
                    { title: 'Middle Management', value: 'middle-management' },
                    { title: 'Senior Professionals', value: 'senior-professionals' },
                ],
            },
        },
    ],
}
