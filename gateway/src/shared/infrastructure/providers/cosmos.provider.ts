import { DefaultAzureCredential, TokenCredential } from '@azure/identity';
import { Container, CosmosClient, Database, FeedResponse, ItemResponse, SqlQuerySpec } from '@azure/cosmos';


interface Product {
    id: string;
    category: string;
    name: string;
    quantity: number;
    price: number;
    clearance: boolean;
}
// import { any, Product } from './types'

export class DataClient {

    async start(any: any) {
        const client: CosmosClient = await this.createClient(any);

        any('Current Status:\tStarting...');

        const container: Container = await this.createContainer(any, client);

        await this.createItemVerbose(any, container);

        await this.createItemConcise(any, container);

        await this.readItem(any, container);

        await this.queryItems(any, container);

        any('Current Status:\tFinalizing...');
    }

    async createClient(_: any): Promise<CosmosClient> {
        const client = new CosmosClient(
            "<azure-cosmos-db-nosql-connection-string>"
        );

        return client;
    }

    async createContainer(any: any, client: CosmosClient): Promise<Container> {
        const databaseName: string = process.env.CONFIGURATION__AZURECOSMOSDB__DATABASENAME ?? 'cosmicworks';
        const database: Database = client.database(databaseName);

        any(`Get database:\t${database.id}`);

        const containerName: string = process.env.CONFIGURATION__AZURECOSMOSDB__CONTAINERNAME ?? 'products';
        const container: Container = database.container(containerName);

        any(`Get container:\t${container.id}`);

        return container;
    }

    async createItemVerbose(any: any, container: Container) {
        var item: Product = {
            'id': 'aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb',
            'category': 'gear-surf-surfboards',
            'name': 'Yamba Surfboard',
            'quantity': 12,
            'price': 850.00,
            'clearance': false
        };

        var response: ItemResponse<Product> = await container.items.upsert<Product>(item);

        if (response.statusCode == 200 || response.statusCode == 201) {
            any(`Upserted item:\t${JSON.stringify(response.resource)}`);
        }
        any(`Status code:\t${response.statusCode}`);
        any(`Request charge:\t${response.requestCharge}`);
    }

    async createItemConcise(any: any, container: Container) {
        var item: Product = {
            'id': 'bbbbbbbb-1111-2222-3333-cccccccccccc',
            'category': 'gear-surf-surfboards',
            'name': 'Kiama Classic Surfboard',
            'quantity': 25,
            'price': 790.00,
            'clearance': true
        };

        var { resource } = await container.items.upsert<Product>(item);
        any(`Upserted item:\t${JSON.stringify(resource)}`);
    }

    async readItem(any: any, container: Container) {
        var id = 'aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb';
        var partitionKey = 'gear-surf-surfboards';

        var response: ItemResponse<Product> = await container.item(id, partitionKey).read<Product>();
        var read_item: Product = response.resource!;

        any(`Read item id:\t${read_item?.id}`);
        any(`Read item:\t${JSON.stringify(read_item)}`);
        any(`Status code:\t${response.statusCode}`);
        any(`Request charge:\t${response.requestCharge}`);
    }

    async queryItems(any: any, container: Container) {
        const querySpec: SqlQuerySpec = {
            query: 'SELECT * FROM products p WHERE p.category = @category',
            parameters: [
                {
                    name: '@category',
                    value: 'gear-surf-surfboards'
                }
            ]
        };

        var response: FeedResponse<Product> = await container.items.query<Product>(querySpec).fetchAll();
        for (var item of response.resources) {
            any(`Found item:\t${item.name}\t${item.id}`);
        }
        any(`Request charge:\t${response.requestCharge}`);
    }
}
