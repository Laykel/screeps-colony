import {
  handleRecharging,
  isStructureOneOf,
  transferToSpawn,
  withdrawEnergy,
} from './shared.logic';

// TODO Operators can have any mission. When a new mission is needed, we check who is closest and whether it has higher priority than their current mission.
// TODO A creep will accept the mission after its energy runs out (memory: {mission, nextMission})
// TODO Some missions will be "EMERGENCY", like repairing critical structures
// TODO Refilling the spawn/extensions and towers is next in priority
// TODO There should always be one upgrading
// TODO One creep per mission, unless a great volume exists
// type MissionType = 'refill_spawn' | 'refill_tower' | 'repair' | 'fortify' | 'awaiting';

// type MissionStatement =
//   | {
//       type: 'awaiting';
//     }
//   | { type: 'refill_spawn'; target: Id<StructureContainer> }
//   | { type: 'refill_tower'; target: Id<StructureTower> };

// const test = () => {
//   const statement: MissionStatement = {
//     type: 'refill_spawn',
//     target: '' as Id<StructureContainer>,
//   };

//   console.log(statement);
// };

export const runOperatorRole = (creep: Creep) => {
  const mainStorageId = creep.room.memory.mainStorage;
  if (creep.room.memory.mode !== 'static_mining' || !mainStorageId) return;

  handleRecharging(creep, 'operate');

  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    // Refill spawn and extensions
    if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
      transferToSpawn(creep);
    } else {
      const storage = Game.getObjectById(mainStorageId);

      if (storage && storage.store.energy > 600) {
        // Refill tower
        const tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: structure =>
            structure.structureType === STRUCTURE_TOWER && structure.store.energy < 800,
        }) as StructureTower | null;

        if (tower) {
          if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tower);
          }
        } else {
          // Strengthen the fortifications
          const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure =>
              isStructureOneOf(structure.structureType, [STRUCTURE_WALL, STRUCTURE_RAMPART]),
          });

          if (target && creep.room.memory.fortificationsMaxHits <= 2_000_000) {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
            }

            // Steadily increase hit points for the fortifications
            creep.room.memory.fortificationsMaxHits += 1000;
          }
        }
      }
    }
  }
};
