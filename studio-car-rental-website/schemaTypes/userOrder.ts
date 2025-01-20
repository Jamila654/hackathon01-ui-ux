export default {
    name: 'userOrder',
    type: 'document',
    title: 'User and Order',
    fields: [
      {
        name: 'userName',
        type: 'string',
        title: 'User Name',
      },
      {
        name: 'userEmail',
        type: 'string',
        title: 'User Email',
      },
      {
        name: 'phoneNumber',
        type: 'string',
        title: 'Phone Number',
      },
      {
        name: 'orders',
        type: 'array',
        title: 'Orders',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'car',
                type: 'reference',
                to: [{ type: 'car' }],
                title: 'Car',
              },
              {
                name: 'startDate',
                type: 'datetime',
                title: 'Start Date',
              },
              {
                name: 'endDate',
                type: 'datetime',
                title: 'End Date',
              },
              {
                name: 'trackingId',
                type: 'string',
                title: 'Tracking ID',
              },
              {
                name: 'status',
                type: 'string',
                title: 'Status',
                options: {
                  list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Completed', value: 'completed' },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };
  