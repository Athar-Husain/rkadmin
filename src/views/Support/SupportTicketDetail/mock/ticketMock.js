const ticketMock = {
  id: 'TICKET123',
  subject: 'Internet not working',
  status: 'Open', // or 'Resolved'
  priority: 'High',
  lastUpdate: '2025-08-20 14:35',
  description: 'Customer is unable to connect to the internet since morning.',
  resolution: 'Restarted the router and reset the connection.',
  chatHistory: [
    {
      id: 'msg1',
      sender: 'Customer',
      message: 'My internet is not working.',
      timestamp: '2025-08-20 09:00'
    },
    {
      id: 'msg2',
      sender: 'Agent',
      message: 'We are checking the issue.',
      timestamp: '2025-08-20 09:15'
    }
  ],
  notes: [
    {
      id: 'note1',
      author: 'Admin',
      timestamp: '2025-08-20 10:00',
      text: 'Issue seems related to local ISP.'
    }
  ]
};

export default ticketMock;
