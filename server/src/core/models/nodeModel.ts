export interface INode {
  id: number;
  name: string;
  properties: Record<string, any>;
}

export class NodeModel implements INode {
  constructor(
    public id: number,
    public name: string,
    public properties: Record<string, any>,
  ) {}
}
