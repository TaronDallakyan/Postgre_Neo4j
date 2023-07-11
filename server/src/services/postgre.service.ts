import Node from '../db/entities/nodeEntity';
import { INode, NodeModel } from '../core/models/nodeModel';

export default class NodeService {
  public async createNode(data: NodeModel): Promise<any> {
    return await Node.create(data);
  }

  public async getNodesFromPostgre(): Promise<INode[] | void> {
    return await Node.findAll();
  }

  public async updateNodeById(id: number, data: INode): Promise<INode | any> {
    return await Node.update(data, { where: { id }, returning: true });
  }

  public async deleteNodeById(id: number): Promise<number | void> {
    return await Node.destroy({ where: { id } });
  }
}
