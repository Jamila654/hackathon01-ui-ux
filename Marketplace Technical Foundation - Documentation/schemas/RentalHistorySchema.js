export default {
    name: 'rentalHistory',
    type: 'document',
    title: 'Rental History',
    fields: [
      {
        name: 'booking',
        type: 'reference',
        to: [{ type: 'booking' }],
        title: 'Booking',
      },
      {
        name: 'returnDate',
        type: 'datetime',
        title: 'Return Date',
      },
      {
        name: 'feedback',
        type: 'text',
        title: 'Customer Feedback',
      },
    ],
  };