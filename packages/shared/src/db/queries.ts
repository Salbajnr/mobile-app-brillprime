
import { db } from './index';
import { users, adminUsers, orders, transactions, supportTickets, escrowTransactions, disputes } from './schema';
import { eq, desc, and, or, count, sql } from 'drizzle-orm';
import type { SelectUser, SelectSupportTicket, SelectEscrowTransaction } from './schema';

// User queries
export async function getUserById(id: number): Promise<SelectUser | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<SelectUser | null> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function createUser(userData: typeof users.$inferInsert) {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
}

export async function updateUser(id: number, userData: Partial<typeof users.$inferInsert>) {
  const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
  return result[0];
}

// Admin authentication
export async function getAdminByEmail(email: string) {
  const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  return result[0] || null;
}

// Dashboard analytics
export async function getDashboardStats() {
  const [userStats, orderStats, transactionStats, supportStats] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(orders),
    db.select({ 
      totalAmount: sql<number>`sum(${transactions.amount})::numeric`,
      count: count() 
    }).from(transactions),
    db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, 'OPEN'))
  ]);

  return {
    totalUsers: userStats[0].count,
    totalOrders: orderStats[0].count,
    totalRevenue: transactionStats[0].totalAmount || 0,
    transactionCount: transactionStats[0].count,
    openTickets: supportStats[0].count
  };
}

// Recent activities
export async function getRecentTransactions(limit: number = 10) {
  return await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      paymentStatus: transactions.paymentStatus,
      createdAt: transactions.createdAt,
      user: {
        id: users.id,
        fullName: users.fullName,
        email: users.email
      }
    })
    .from(transactions)
    .leftJoin(users, eq(transactions.userId, users.id))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

// Support ticket queries
export async function getSupportTickets(limit: number = 50) {
  return await db
    .select({
      id: supportTickets.id,
      ticketNumber: supportTickets.ticketNumber,
      subject: supportTickets.subject,
      status: supportTickets.status,
      priority: supportTickets.priority,
      createdAt: supportTickets.createdAt,
      user: {
        id: users.id,
        fullName: users.fullName,
        email: users.email
      }
    })
    .from(supportTickets)
    .leftJoin(users, eq(supportTickets.userId, users.id))
    .orderBy(desc(supportTickets.createdAt))
    .limit(limit);
}

// Escrow queries
export async function getEscrowTransactions(limit: number = 50) {
  return await db
    .select({
      id: escrowTransactions.id,
      amount: escrowTransactions.amount,
      status: escrowTransactions.status,
      createdAt: escrowTransactions.createdAt,
      customer: {
        id: users.id,
        fullName: users.fullName,
        email: users.email
      }
    })
    .from(escrowTransactions)
    .leftJoin(users, eq(escrowTransactions.customerId, users.id))
    .orderBy(desc(escrowTransactions.createdAt))
    .limit(limit);
}

// User management queries
export async function getAllUsers(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  
  const [usersData, totalCount] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: count() }).from(users)
  ]);

  return {
    users: usersData,
    totalCount: totalCount[0].count,
    totalPages: Math.ceil(totalCount[0].count / pageSize)
  };
}
