import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Message from '../models/Message.js';
import Feedback from '../models/Feedback.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany();
    await Complaint.deleteMany();
    await Message.deleteMany();
    await Feedback.deleteMany();

    console.log('[Seed] Creating demo users (Admin, Agent, User)...');

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@complaint.com',
      password: 'admin123',
      role: 'ADMIN',
      department: 'Executive Administration',
      phone: '+1 800-555-0100',
    });

    const agent = await User.create({
      name: 'Sarah Connor (Tech Agent)',
      email: 'agent@complaint.com',
      password: 'agent123',
      role: 'AGENT',
      department: 'Technical Issue',
      phone: '+1 800-555-0199',
    });

    const agent2 = await User.create({
      name: 'Michael Scott (Billing Agent)',
      email: 'billing.agent@complaint.com',
      password: 'agent123',
      role: 'AGENT',
      department: 'Billing & Payment',
      phone: '+1 800-555-0188',
    });

    const user = await User.create({
      name: 'Alex Johnson',
      email: 'user@complaint.com',
      password: 'user123',
      role: 'USER',
      department: 'Customer Account',
      phone: '+1 555-014-7890',
    });

    console.log('[Seed] Creating demo complaints...');

    const complaint1 = await Complaint.create({
      ticketId: 'TKT-108492',
      title: 'Double Charge on Monthly Subscription Billing',
      description: 'I noticed my account was charged twice for the July premium subscription ($49.99 x 2). Requesting immediate refund of the duplicate transaction.',
      category: 'Billing & Payment',
      priority: 'High',
      status: 'In Progress',
      userId: user._id,
      agentId: agent2._id,
      history: [
        { updatedBy: user._id, action: 'Ticket Created', note: 'Created via mobile app' },
        { updatedBy: admin._id, action: 'Assigned to Agent: Michael Scott', note: 'Assigned to Billing team' },
        { updatedBy: agent2._id, action: 'Status changed to In Progress', note: 'Contacted finance team for verification' },
      ],
    });

    const complaint2 = await Complaint.create({
      ticketId: 'TKT-920415',
      title: 'Unable to access dashboard analytics reporting',
      description: 'Whenever I click on the monthly reporting tab, a 500 error screen appears. Tried clearing cache and cookies.',
      category: 'Technical Issue',
      priority: 'Urgent',
      status: 'Resolved',
      userId: user._id,
      agentId: agent._id,
      resolutionNotes: 'Deployed hotfix patch v2.4.1 to reset user view permissions. Issue verified fixed.',
      history: [
        { updatedBy: user._id, action: 'Ticket Created', note: 'Created via user portal' },
        { updatedBy: admin._id, action: 'Assigned to Agent: Sarah Connor', note: 'High priority tech bug' },
        { updatedBy: agent._id, action: 'Status changed to In Progress', note: 'Debugging API permissions' },
        { updatedBy: agent._id, action: 'Status changed to Resolved', note: 'Hotfix applied' },
      ],
    });

    const complaint3 = await Complaint.create({
      ticketId: 'TKT-441830',
      title: 'Request for custom SSL certificate configuration',
      description: 'We need support attaching our custom domain wildcard SSL certificate to the dedicated workspace endpoint.',
      category: 'Account Access',
      priority: 'Low',
      status: 'Pending',
      userId: user._id,
      agentId: null,
      history: [{ updatedBy: user._id, action: 'Ticket Created', note: 'Awaiting admin triage' }],
    });

    console.log('[Seed] Creating demo chat messages...');

    await Message.create([
      {
        complaintId: complaint1._id,
        senderId: user._id,
        message: 'Hi Michael, I attached the bank receipt showing both deductions.',
      },
      {
        complaintId: complaint1._id,
        senderId: agent2._id,
        message: 'Thanks Alex! I see the receipt. Reaching out to accounting right now to issue your $49.99 credit.',
      },
      {
        complaintId: complaint2._id,
        senderId: agent._id,
        message: 'Hi Alex, the server log issue has been patched. Could you test logging into your reporting tab again?',
      },
      {
        complaintId: complaint2._id,
        senderId: user._id,
        message: 'Awesome! Just tested and the analytics dashboard loaded instantly. Thank you Sarah!',
      },
    ]);

    console.log('[Seed] Creating demo feedback...');

    await Feedback.create({
      complaintId: complaint2._id,
      userId: user._id,
      rating: 5,
      comment: 'Super fast response! Sarah resolved the technical glitch within 2 hours.',
      resolutionSatisfaction: 'Completely Satisfied',
      responseTimeRating: 5,
    });

    console.log('----------------------------------------------------');
    console.log('[Seed] SUCCESS: Database seeded successfully!');
    console.log('Demo Logins:');
    console.log(' - Admin: admin@complaint.com / admin123');
    console.log(' - Tech Agent: agent@complaint.com / agent123');
    console.log(' - Billing Agent: billing.agent@complaint.com / agent123');
    console.log(' - User: user@complaint.com / user123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
