import { harvestFromSource, withdrawFromContainer } from './shared.logic';

export const runBuilderRole = (creep: Creep) => {
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.building = false;
    creep.say('🔄 harvest');
  }
  if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    creep.memory.building = true;
    creep.say('🚧 build');
  }

  if (creep.memory.building) {
    const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (targets.length) {
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
  } else {
    if (Memory.mode === 'container') {
      withdrawFromContainer(creep);
    } else {
      harvestFromSource(creep);
    }
  }
};
