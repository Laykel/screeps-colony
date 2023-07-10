import { findStructureInRoom, transferToStructures, withdrawFromContainer } from './shared.logic';

export const runTransporterRole = (creep: Creep) => {
  if (Memory.mode !== 'container') return;

  if (!creep.memory.recharging && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.recharging = true;
    creep.say('🔄recharge');
  }
  if (creep.memory.recharging && creep.store.getFreeCapacity() === 0) {
    creep.memory.recharging = false;
  }

  // Get energy if needed
  if (creep.memory.recharging) {
    withdrawFromContainer(creep);
  }

  // Fill spawn and extensions if not already done
  const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer;

  if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
    transferToStructures(creep);
  }

  // If the rest is done, take care of the walls
  if (container.store.energy > 800) {
    let target;
    const walls = creep.room.find(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART,
    });

    for (const wall of walls) {
      if (wall.hits < 10000) {
        target = wall;
      }
    }

    if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};
