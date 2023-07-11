// TODO Consider container harvesting

import { harvestFromSource, transferToContainer, transferToSpawn } from './shared.logic';

export const runHarvesterRole = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    harvestFromSource(creep);
  } else {
    if (Memory.mode === 'container') {
      transferToContainer(creep);
    } else {
      transferToSpawn(creep);
    }
  }
};
