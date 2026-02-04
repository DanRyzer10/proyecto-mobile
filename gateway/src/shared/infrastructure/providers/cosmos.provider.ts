import { Container, CosmosClient, Database, FeedResponse, ItemDefinition, ItemResponse, SqlQuerySpec } from '@azure/cosmos';
import { Logger } from '../logger';
import { COSMOS_CONNECTION_STRING, COSMOS_DATABASE_NAME, COSMOS_CONTAINER_NAME } from '../../../constants';

export class CosmosProvider {
    private client: CosmosClient | null = null;
    private database: Database | null = null;
    private container: Container | null = null;
    private logger: Logger;

    constructor(logger?: Logger) {
        this.logger = logger || new Logger();
    }

    async connect(): Promise<void> {
        try {
            if (!COSMOS_CONNECTION_STRING) {
                throw new Error('COSMOS_CONNECTION_STRING is not defined');
            }

            this.client = new CosmosClient(COSMOS_CONNECTION_STRING);
            this.database = this.client.database(COSMOS_DATABASE_NAME);
            this.container = this.database.container(COSMOS_CONTAINER_NAME);

            this.logger.info(`Connected to Cosmos DB: ${COSMOS_DATABASE_NAME}/${COSMOS_CONTAINER_NAME}`);
        } catch (error) {
            this.logger.error('Failed to connect to Cosmos DB', error);
            throw error;
        }
    }

    async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
        const startTime = Date.now();

        try {
            if (!this.client) {
                await this.connect();
            }

            const { resource: databaseInfo } = await this.database!.read();
            const latencyMs = Date.now() - startTime;

            return {
                success: true,
                message: `Connected to database: ${databaseInfo?.id}`,
                latencyMs
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Connection failed: ${error.message}`
            };
        }
    }

    getClient(): CosmosClient {
        if (!this.client) {
            throw new Error('Cosmos client not initialized. Call connect() first.');
        }
        return this.client;
    }

    getDatabase(): Database {
        if (!this.database) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.database;
    }

    getContainer(): Container {
        if (!this.container) {
            throw new Error('Container not initialized. Call connect() first.');
        }
        return this.container;
    }

    async upsertItem<T extends ItemDefinition>(item: T): Promise<ItemResponse<ItemDefinition>> {
        try {
            const response = await this.getContainer().items.upsert(item);
            this.logger.info(`Upserted item: ${item.id}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to upsert item: ${item.id}`, error);
            throw error;
        }
    }

    async readItem<T extends ItemDefinition>(id: string, partitionKey: string): Promise<T | undefined> {
        try {
            const response = await this.getContainer().item(id, partitionKey).read<T>();
            return response.resource;
        } catch (error) {
            this.logger.error(`Failed to read item: ${id}`, error);
            throw error;
        }
    }

    async queryItems<T extends ItemDefinition>(query: string, parameters?: { name: string; value: any }[]): Promise<T[]> {
        try {
            const querySpec: SqlQuerySpec = { query, parameters };
            const response: FeedResponse<T> = await this.getContainer().items.query<T>(querySpec).fetchAll();
            return response.resources;
        } catch (error) {
            this.logger.error('Failed to execute query', error);
            throw error;
        }
    }

    async deleteItem(id: string, partitionKey: string): Promise<void> {
        try {
            await this.getContainer().item(id, partitionKey).delete();
            this.logger.info(`Deleted item: ${id}`);
        } catch (error) {
            this.logger.error(`Failed to delete item: ${id}`, error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.client = null;
        this.database = null;
        this.container = null;
        this.logger.info('Disconnected from Cosmos DB');
    }
}

// Singleton instance
let cosmosProviderInstance: CosmosProvider | null = null;

export function getCosmosProvider(): CosmosProvider {
    if (!cosmosProviderInstance) {
        cosmosProviderInstance = new CosmosProvider();
    }
    return cosmosProviderInstance;
}
