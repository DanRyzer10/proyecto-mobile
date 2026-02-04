import { CosmosProvider, getCosmosProvider } from './cosmos.provider';

// Mock the Logger to avoid file system operations during tests
jest.mock('../logger', () => ({
    Logger: jest.fn().mockImplementation(() => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    }))
}));

// Mock the constants
jest.mock('../../../constants', () => ({
    COSMOS_CONNECTION_STRING: process.env.COSMOS_CONNECTION_STRING || '',
    COSMOS_DATABASE_NAME: process.env.COSMOS_DATABASE_NAME || 'test-db',
    COSMOS_CONTAINER_NAME: process.env.COSMOS_CONTAINER_NAME || 'test-container'
}));

describe('CosmosProvider', () => {
    let provider: CosmosProvider;

    beforeEach(() => {
        provider = new CosmosProvider();
    });

    afterEach(async () => {
        await provider.disconnect();
    });

    describe('Unit Tests', () => {
        describe('constructor', () => {
            it('should create an instance with default logger', () => {
                expect(provider).toBeInstanceOf(CosmosProvider);
            });
        });

        describe('getClient', () => {
            it('should throw error when client is not initialized', () => {
                expect(() => provider.getClient()).toThrow('Cosmos client not initialized. Call connect() first.');
            });
        });

        describe('getDatabase', () => {
            it('should throw error when database is not initialized', () => {
                expect(() => provider.getDatabase()).toThrow('Database not initialized. Call connect() first.');
            });
        });

        describe('getContainer', () => {
            it('should throw error when container is not initialized', () => {
                expect(() => provider.getContainer()).toThrow('Container not initialized. Call connect() first.');
            });
        });

        describe('connect', () => {
            it('should throw error when connection string is not defined', async () => {
                // Reset the mock to return empty string
                jest.resetModules();
                jest.doMock('../../../constants', () => ({
                    COSMOS_CONNECTION_STRING: '',
                    COSMOS_DATABASE_NAME: 'test-db',
                    COSMOS_CONTAINER_NAME: 'test-container'
                }));

                const { CosmosProvider: FreshProvider } = await import('./cosmos.provider');
                const freshProvider = new FreshProvider();

                await expect(freshProvider.connect()).rejects.toThrow('COSMOS_CONNECTION_STRING is not defined');
            });
        });

        describe('disconnect', () => {
            it('should reset client, database, and container to null', async () => {
                await provider.disconnect();

                expect(() => provider.getClient()).toThrow();
                expect(() => provider.getDatabase()).toThrow();
                expect(() => provider.getContainer()).toThrow();
            });
        });
    });

    describe('Singleton', () => {
        it('should return the same instance', () => {
            const instance1 = getCosmosProvider();
            const instance2 = getCosmosProvider();

            expect(instance1).toBe(instance2);
        });
    });
});

/**
 * Integration tests - These require actual Azure Cosmos DB connection
 * Run these tests with valid COSMOS_CONNECTION_STRING environment variable
 *
 * To run: COSMOS_CONNECTION_STRING="your-connection-string" npm test -- --testPathPattern=cosmos.provider.spec.ts
 */
describe('CosmosProvider Integration Tests', () => {
    const hasConnectionString = !!process.env.COSMOS_CONNECTION_STRING;

    // Skip integration tests if no connection string is provided
    const itIntegration = hasConnectionString ? it : it.skip;

    let provider: CosmosProvider;

    beforeEach(() => {
        if (hasConnectionString) {
            // Reset modules to use real constants
            jest.resetModules();
            jest.unmock('../../../constants');
            provider = new CosmosProvider();
        }
    });

    afterEach(async () => {
        if (provider) {
            await provider.disconnect();
        }
    });

    itIntegration('should connect to Cosmos DB successfully', async () => {
        await provider.connect();

        expect(provider.getClient()).toBeDefined();
        expect(provider.getDatabase()).toBeDefined();
        expect(provider.getContainer()).toBeDefined();
    });

    itIntegration('should test connection and return success', async () => {
        const result = await provider.testConnection();

        expect(result.success).toBe(true);
        expect(result.message).toContain('Connected to database');
        expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    itIntegration('should perform CRUD operations', async () => {
        await provider.connect();

        const testItem = {
            id: `test-${Date.now()}`,
            category: 'test-category',
            name: 'Test Item',
            value: 123
        };

        // Create/Upsert
        const upsertResponse = await provider.upsertItem(testItem);
        expect(upsertResponse.statusCode).toBeGreaterThanOrEqual(200);
        expect(upsertResponse.statusCode).toBeLessThan(300);

        // Read
        const readResult = await provider.readItem<typeof testItem>(testItem.id, testItem.category);
        expect(readResult).toBeDefined();
        expect(readResult?.id).toBe(testItem.id);
        expect(readResult?.name).toBe(testItem.name);

        // Query
        const queryResults = await provider.queryItems<typeof testItem>(
            'SELECT * FROM c WHERE c.id = @id',
            [{ name: '@id', value: testItem.id }]
        );
        expect(queryResults.length).toBeGreaterThan(0);
        expect(queryResults[0].id).toBe(testItem.id);

        // Delete (cleanup)
        await provider.deleteItem(testItem.id, testItem.category);

        // Verify deletion
        try {
            const deletedItem = await provider.readItem(testItem.id, testItem.category);
            expect(deletedItem).toBeUndefined();
        } catch {
            // Item not found is expected after deletion
        }
    });

    itIntegration('should return failure on invalid connection', async () => {
        // Use a fresh provider with invalid connection string for this test
        jest.resetModules();
        jest.doMock('../../../constants', () => ({
            COSMOS_CONNECTION_STRING: 'AccountEndpoint=https://invalid.documents.azure.com:443/;AccountKey=invalidkey==;',
            COSMOS_DATABASE_NAME: 'invalid-db',
            COSMOS_CONTAINER_NAME: 'invalid-container'
        }));

        const { CosmosProvider: FreshProvider } = await import('./cosmos.provider');
        const invalidProvider = new FreshProvider();

        const result = await invalidProvider.testConnection();

        expect(result.success).toBe(false);
        expect(result.message).toContain('Connection failed');
    });
});
