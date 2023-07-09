import { harvestFromSource, withdrawFromContainer } from './shared.logic';

export const runUpgraderRole = (creep: Creep) => {
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.upgrading = false;
    creep.say('🔄 harvest');
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.upgrading = true;
    creep.say('⚡ upgrade');
  }

  if (creep.memory.upgrading) {
    if (
      creep.room.controller &&
      creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  } else {
    if (Memory.mode === 'container') {
      withdrawFromContainer(creep);
    } else {
      harvestFromSource(creep);
    }
  }
};
