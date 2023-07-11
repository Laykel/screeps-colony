import { findStructureInRoom, transferToSpawn, withdrawEnergy } from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (Memory.mode !== 'container') return;

  if (!creep.memory.recharging && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.recharging = true;
    creep.say('🔄recharge');
  }
  if (creep.memory.recharging && creep.store.getFreeCapacity() === 0) {
    creep.memory.recharging = false;
    creep.say('transport');
  }

  // Get energy if needed
  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    // Fill spawn and extensions if not already done
    if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
      transferToSpawn(creep);
    } else {
      // If the rest is done, take care of the walls
      const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer;

      if (container.store.energy > 200) {
        let target;
        const structures = creep.room.find(FIND_STRUCTURES, {
          filter: structure =>
            structure.structureType === STRUCTURE_WALL ||
            structure.structureType === STRUCTURE_RAMPART ||
            structure.structureType === STRUCTURE_CONTAINER,
        });

        for (const structure of structures) {
          if (structure.hits < 60000) {
            target = structure;
          }
        }

        if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  }
};
