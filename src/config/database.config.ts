import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
// If you generate Prisma client to a custom path, import from there:
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL ?? ''}`;
const adapter = new PrismaPg({ connectionString });

// Ensure we reuse the PrismaClient across hot-reloads in dev to avoid exhausting connections
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
	return new PrismaClient({
		adapter,
		log: ['error', 'warn'],
	});
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

async function disconnectPrisma() {
	try {
		await prisma.$disconnect();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Error disconnecting Prisma:', err);
	}
}

process.on('SIGINT', async () => {
	await disconnectPrisma();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await disconnectPrisma();
	process.exit(0);
});

process.on('beforeExit', async () => {
	await disconnectPrisma();
});

export async function pingDatabase(): Promise<boolean> {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return true;
	} catch {
		return false;
	}
}

// Explicitly establish a database connection at application startup
export async function connectDatabase(): Promise<void> {
	try {
		await prisma.$connect();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Error connecting to database:', err);
		throw err;
	}
}

export default prisma;
