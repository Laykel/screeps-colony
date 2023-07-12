import { harvestFromSource, transferToSpawn } from './shared.logic';

export const runHarvesterRole = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    harvestFromSource(creep);
  } else {
    transferToSpawn(creep);
    // TODO If spawn is completely full AND there is a mainStorageId, go there
  }
};
