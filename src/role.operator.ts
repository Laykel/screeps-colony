import {
  findClosestStructure,
  findStructureInRoom,
  transferToSpawn,
  withdrawEnergy,
} from './shared.logic';

export const runOperatorRole = (creep: Creep) => {
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
    withdrawEnergy(creep);
  } else {
    // Fill spawn and extensions if not already done
    if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
      transferToSpawn(creep);
    } else {
      // If the rest is done, take care of the towers
      const container = findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer;

      if (container.store.energy > 800) {
        const tower = findClosestStructure(creep.pos, STRUCTURE_TOWER) as StructureTower;

        if (tower && creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(tower);
        }
      }
    }
  }
};
