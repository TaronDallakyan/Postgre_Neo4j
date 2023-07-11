import neo4j from 'neo4j-driver';
// import Node from '../db/entities/nodeEntity';
// import { INode, NodeModel } from '../core/models/nodeModel';

const driver = neo4j.driver(
  process.env.NEO4J_DB_URI,
  neo4j.auth.basic(
    process.env.NEO4J_DB_USERNAME,
    process.env.NEO4J_DB_PASSWORD,
  ),
);

export default class Neo4jService {
  public async createNode(
    name: string,
    properties: Record<string, any>,
    id: number,
  ): Promise<any> {
    const session = driver.session();

    try {
      const result = await session.run(
        `CREATE (n:${name} $props) SET n.syncId = $syncId RETURN n`,
        {
          props: properties,
          syncId: Number(id),
        },
      );

      const createdNode = result.records[0].get('n');

      return createdNode;
    } finally {
      session.close();
    }
  }

  public async getNodesFromNeo4j(): Promise<any[]> {
    const session = driver.session();

    try {
      const result = await session.run('MATCH (n) RETURN n');

      const nodes = result.records.map((record) => {
        const node = record.get('n');
        return {
          name: node.labels[0],
          properties: node.properties,
        };
      });

      return nodes;
    } finally {
      session.close();
    }
  }

  public async updateNodeById(
    id: number,
    properties: Record<string, any>,
  ): Promise<any> {
    const session = driver.session();

    try {
      const result = await session.run(
        'MATCH (n {syncId: $id})  SET n = $props RETURN n',
        { id: Number(id), props: { ...properties, syncId: Number(id) } },
      );

      const updatedNode = result.records[0].get('n');

      return updatedNode;
    } finally {
      session.close();
    }
  }

  public async deleteNodeById(id: number): Promise<any> {
    const session = driver.session();

    try {
      await session.run('MATCH (n {syncId: $id}) DELETE n', {
        id: Number(id),
      });
    } finally {
      session.close();
    }
  }
}
