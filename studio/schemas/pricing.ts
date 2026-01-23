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
            description: 'Display price (e.g., 5,500)',
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
            title: 'Category',
            type: 'string',
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
