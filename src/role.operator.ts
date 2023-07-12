import {
  findClosestStructure,
  findStructureInRoom,
  handleRecharging,
  transferToSpawn,
  withdrawEnergy,
} from './shared.logic';

// TODO Merge Porter, Repairers and builder into Operator who is reallocated based on energy levels and priorities
export const runOperatorRole = (creep: Creep) => {
  if (Memory.mode !== 'static_mining') return;

  handleRecharging(creep, 'operate');

  // Get energy if needed
  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    // Fill spawn and extensions if not already done
    if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
      transferToSpawn(creep);
    } else {
      const container = findStructureInRoom(
        creep.room,
        STRUCTURE_CONTAINER,
      ) as StructureContainer | null;

      if (container && container.store.energy > 600) {
        const tower = findClosestStructure(creep.pos, STRUCTURE_TOWER) as StructureTower | null;

        // TODO Repair tower if damaged
        if (tower && tower.store.energy !== 1000) {
          if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tower);
          }
        } else {
          const structures = creep.room.find(FIND_STRUCTURES, {
            filter: structure =>
              (structure.structureType === STRUCTURE_WALL ||
                structure.structureType === STRUCTURE_RAMPART) &&
              structure.hits < 80000,
          });

          const target = structures?.[0];

          if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
      }
    }
  }
};
