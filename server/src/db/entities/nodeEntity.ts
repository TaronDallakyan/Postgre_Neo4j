import { sequelize } from '../connect-db';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { INode } from '../../core/models/nodeModel';

class Node
  extends Model<InferAttributes<Node>, InferCreationAttributes<Node>>
  implements INode
{
  id: number;
  name: string;
  properties: Record<string, any>;
}

Node.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    properties: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    modelName: 'Nodes',
    freezeTableName: true,
  },
);

export default Node;
