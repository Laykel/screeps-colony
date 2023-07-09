// TODO A lot: consider container harvesting

import { findStructureInRoom, harvestFromSource, transferToContainer } from './shared.logic';

export const runHarvesterRole = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    harvestFromSource(creep);
  } else {
    // transferToStructures(creep);

    console.log(findStructureInRoom(creep.room, STRUCTURE_CONTAINER));
    // TODO
    // if (Memory.mode === 'container')
    transferToContainer(creep);
  }
};
