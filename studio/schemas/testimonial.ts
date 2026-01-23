export default {
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Client Name',
            type: 'string',
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
        },
        {
            name: 'company',
            title: 'Company',
            type: 'string',
        },
        {
            name: 'content',
            title: 'Testimonial Content',
            type: 'text',
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            initialValue: 5,
            validation: (Rule: any) => Rule.min(1).max(5),
        },
        {
            name: 'image',
            title: 'Client Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
}
