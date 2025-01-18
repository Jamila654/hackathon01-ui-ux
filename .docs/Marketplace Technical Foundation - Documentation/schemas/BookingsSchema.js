export default {
    name: 'booking',
    type: 'document',
    title: 'Booking',
    fields: [
      {
        name: 'vehicle',
        type: 'reference',
        to: [{ type: 'vehicle' }],
        title: 'Vehicle',
      },
      {
        name: 'customer',
        type: 'reference',
        to: [{ type: 'customer' }],
        title: 'Customer',
      },
      {
        name: 'rentalDuration',
        type: 'number',
        title: 'Rental Duration (in days)',
      },
      {
        name: 'totalPrice',
        type: 'number',
        title: 'Total Price',
      },
      {
        name: 'status',
        type: 'string',
        title: 'Booking Status',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Confirmed', value: 'confirmed' },
            { title: 'Cancelled', value: 'cancelled' },
          ],
        },
      },
    ],
  };
  