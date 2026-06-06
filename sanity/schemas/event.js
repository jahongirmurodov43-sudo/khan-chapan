export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
        { name: 'uz', title: 'Uzbek',   type: 'text', rows: 3 },
        { name: 'ru', title: 'Russian', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: R => R.required(),
    },
    { name: 'startTime', title: 'Start Time (e.g. 19:00)', type: 'string' },
    { name: 'endTime',   title: 'End Time (e.g. 23:00)',   type: 'string' },
    {
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Regular', value: 'regular' },
          { title: 'Private', value: 'private' },
          { title: 'Special', value: 'special' },
        ],
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming',  value: 'upcoming'  },
          { title: 'Past',      value: 'past'      },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: R => R.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'photos',
      title: 'Gallery Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Add after the event for the gallery.',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to top of events page.',
    },
    {
      name: 'bookingLink',
      title: 'Booking Link (optional)',
      type: 'url',
    },
  ],
  preview: {
    select: { title: 'title.ru', subtitle: 'status', media: 'coverImage' },
  },
};
