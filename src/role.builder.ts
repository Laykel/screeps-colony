import { findClosest, findStructureInRoom, withdrawEnergy } from './shared.logic';

export const runBuilderRole = (creep: Creep) => {
  if (!creep.memory.recharging && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.recharging = true;
    creep.say('🔄recharge');
  }
  if (creep.memory.recharging && creep.store.getFreeCapacity() === 0) {
    creep.memory.recharging = false;
    creep.say('🚧build');
  }

  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer;

    if (container.store.energy > 1200) {
      const target = findClosest(
        creep.pos,
        FIND_MY_CONSTRUCTION_SITES,
        creep.name,
      ) as ConstructionSite;

      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  }
};
