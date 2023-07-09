// TODO Consider container harvesting

import { harvestFromSource, transferToContainer, transferToStructures } from './shared.logic';

export const runHarvesterRole = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    harvestFromSource(creep);
  } else {
    if (Memory.mode === 'container') {
      transferToContainer(creep);
    } else {
      transferToStructures(creep);
    }
  }
};
