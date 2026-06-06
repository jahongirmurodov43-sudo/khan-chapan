export default {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek',   type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: R => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek',   type: 'text', rows: 2 },
        { name: 'ru', title: 'Russian', type: 'text', rows: 2 },
        { name: 'en', title: 'English', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Starters',  value: 'starters'  },
          { title: 'Mains',     value: 'mains'      },
          { title: 'Soups',     value: 'soups'      },
          { title: 'Grills',    value: 'grills'     },
          { title: 'Drinks',    value: 'drinks'     },
          { title: 'Desserts',  value: 'desserts'   },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      name: 'price',
      title: 'Price (UZS)',
      type: 'number',
      validation: R => R.required().min(0),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this item from the menu without deleting it.',
    },
    {
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within the category.',
    },
  ],
  preview: {
    select: { title: 'name.ru', subtitle: 'category', media: 'image' },
  },
};
