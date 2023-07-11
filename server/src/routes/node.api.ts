import { Router } from 'express';
import NodeController from '../controllers/node.controller';

const nodeController = new NodeController();
const router = Router();

router.get('/nodesOfNeo4j', nodeController.getNodesFromNeo4j);
router.get('/', nodeController.getNodesFromPostgre);
router.post('/', nodeController.createNode);
router.put('/:id', nodeController.updateNodeById);
router.delete('/:id', nodeController.deleteNodeById);

export default router;
