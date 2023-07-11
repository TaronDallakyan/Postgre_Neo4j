import { Request, Response } from 'express';
import PostgreService from '../services/postgre.service';
import Neo4jService from '../services/neo4j.service';

const postgreService = new PostgreService();
const neo4jService = new Neo4jService();

export default class NodeController {
  public async getNodesFromPostgre(req: Request, res: Response) {
    try {
      const nodesFromPostgre = await postgreService.getNodesFromPostgre();

      if (!nodesFromPostgre) {
        return res.status(400).send({
          code: 400,
          success: false,
          message: 'Nodes from postgre not found',
        });
      }

      return res.status(200).send({
        code: 200,
        success: true,
        message: 'Got all nodes from postgre!',
        data: nodesFromPostgre,
      });
    } catch (err) {
      return res.status(500).send({
        code: 500,
        message: 'Unexpected error',
      });
    }
  }

  public async updateNodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedNodeInPostgre = await postgreService.updateNodeById(
        Number(id),
        req.body,
      );

      const updatedNodeInNeo4j = await neo4jService.updateNodeById(
        Number(id),
        req.body.properties,
      );

      return res.status(200).send({
        code: 200,
        success: true,
        message: 'Updated the node!',
        data: {
          postgreData: updatedNodeInPostgre[1][0],
          neo4jData: updatedNodeInNeo4j,
        },
      });
    } catch (err) {
      return res.status(500).send({
        code: 500,
        message: 'Unexpected error',
      });
    }
  }

  public async createNode(req: Request, res: Response) {
    try {
      const { name, properties } = req.body;

      const createdNodeInPostgre = await postgreService.createNode(req.body);

      const createdNodeInNeo4j = await neo4jService.createNode(
        name,
        properties,
        createdNodeInPostgre?.get('id'),
      );

      return res.status(200).send({
        code: 200,
        success: true,
        message: 'Created a node!',
        data: {
          postgreData: createdNodeInPostgre,
          neo4jData: createdNodeInNeo4j,
        },
      });
    } catch (err) {
      return res.status(500).send({
        code: 500,
        message: 'Unexpected error',
      });
    }
  }

  public async deleteNodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedNodeInPostgre = await postgreService.deleteNodeById(
        Number(id),
      );
      const deletedNodeInNeo4j = await neo4jService.deleteNodeById(Number(id));

      return res.status(200).send({
        code: 200,
        success: true,
        message: 'Deleted the node!',
        data: {
          deletedNodeInPostgre,
          deletedNodeInNeo4j,
        },
      });
    } catch (err) {
      return res.status(500).send({
        code: 500,
        message: 'Unexpected error',
      });
    }
  }

  public async getNodesFromNeo4j(req: Request, res: Response) {
    try {
      const nodesFromNeo4j = await neo4jService.getNodesFromNeo4j();

      if (!nodesFromNeo4j) {
        return res.status(400).send({
          code: 400,
          success: false,
          message: 'Nodes from neo4j not found',
        });
      }

      return res.status(200).send({
        code: 200,
        success: true,
        message: 'Got all nodes from neo4j!',
        data: {
          nodesFromNeo4j,
        },
      });
    } catch (err) {
      return res.status(500).send({
        code: 500,
        message: 'Unexpected error',
      });
    }
  }
}
