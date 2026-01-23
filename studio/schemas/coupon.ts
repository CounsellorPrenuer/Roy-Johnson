export default {
    name: 'coupon',
    title: 'Coupon',
    type: 'document',
    fields: [
        {
            name: 'code',
            title: 'Coupon Code',
            type: 'string',
            validation: (Rule: any) => Rule.required().uppercase().min(3).max(20)
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2
        },
        {
            name: 'discount_type',
            title: 'Discount Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Percentage (%)', value: 'percentage' },
                    { title: 'Flat Amount (₹)', value: 'flat' }
                ],
                layout: 'radio'
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'discount_value',
            title: 'Discount Value',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0)
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true
        },
        {
            name: 'expires_at',
            title: 'Expires At',
            type: 'datetime'
        },
        {
            name: 'max_redemptions',
            title: 'Max Redemptions',
            type: 'number',
            description: 'Leave empty for unlimited'
        }
    ],
    preview: {
        select: {
            title: 'code',
            subtitle: 'description',
            active: 'active'
        },
        prepare({ title, subtitle, active }: any) {
            return {
                title: title,
                subtitle: `${active ? 'Active' : 'Inactive'} - ${subtitle || ''}`
            }
        }
    }
}
