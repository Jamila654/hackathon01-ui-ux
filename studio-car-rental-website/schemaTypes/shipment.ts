export default {
    name: 'shipment',
    type: 'document',
    title: 'Shipment',
    fields: [
      {
        name: 'order',
        type: 'reference',
        to: [{ type: 'userOrder' }],
        title: 'Order',
      },
      {
        name: 'shipmentStatus',
        type: 'string',
        title: 'Shipment Status',
        options: {
          list: [
            { title: 'Shipped', value: 'shipped' },
            { title: 'In Transit', value: 'in_transit' },
            { title: 'Delivered', value: 'delivered' },
          ],
        },
      },
      {
        name: 'shipmentDate',
        type: 'datetime',
        title: 'Shipment Date',
      },
      {
        name: 'trackingNumber',
        type: 'string',
        title: 'Tracking Number',
      },
    ],
  };
  