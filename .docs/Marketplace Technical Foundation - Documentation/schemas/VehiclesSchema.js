export default {
    name: 'vehicle',
    type: 'document',
    title: 'Vehicle',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Vehicle Name',
      },
      {
        name: 'type',
        type: 'string',
        title: 'Vehicle Type',
      },
      {
        name: 'rentalPrice',
        type: 'number',
        title: 'Rental Price per Day',
      },
      {
        name: 'availability',
        type: 'boolean',
        title: 'Is Available?',
      },
      {
        name: 'image',
        type: 'image',
        title: 'Vehicle Image',
      },
    ],
  };