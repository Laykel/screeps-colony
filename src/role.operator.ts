import {
  findClosestStructure,
  handleRecharging,
  transferToSpawn,
  withdrawEnergy,
} from './shared.logic';

// TODO Operators can have any mission. When a new mission is needed, we check who is closest and whether it has higher priority than their current mission.
// TODO A creep will accept the mission after its energy runs out (memory: {mission, nextMission})
// TODO Some missions will be "EMERGENCY", like repairing critical structures
// TODO Refilling the spawn/extensions and towers is next in priority
// TODO There should always be one upgrading
// TODO One creep per mission, unless a great volume exists
type MissionType = 'refill_spawn' | 'refill_tower' | 'repair' | 'upgrade' | 'fortify' | 'awaiting';

type MissionStatement =
  | {
      type: 'awaiting';
    }
  | { type: 'upgrade'; source: Id<StructureContainer> | Id<Source> }
  | { type: 'refill'; target: Id<StructureTower> };

const test = () => {
  const statement: MissionStatement = {
    type: 'upgrade',
    source: '' as Id<Source>,
  };

  console.log(statement);
};

export const runOperatorRole = (creep: Creep) => {
  if (Memory.mode !== 'static_mining' || !Memory.mainStorageId) return;

  handleRecharging(creep, 'operate');

  // Get energy if needed
  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    // Fill spawn and extensions if not already done
    if (creep.room.energyAvailable !== creep.room.energyCapacityAvailable) {
      transferToSpawn(creep);
    } else {
      const storage = Game.getObjectById(Memory.mainStorageId);

      if (storage && storage.store.energy > 600) {
        const tower = findClosestStructure(creep.pos, STRUCTURE_TOWER) as StructureTower | null;

        // TODO Repair tower if damaged
        if (tower && tower.store.energy !== 1000) {
          if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tower);
          }
        } else {
          const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure =>
              (structure.structureType === STRUCTURE_WALL ||
                structure.structureType === STRUCTURE_RAMPART) &&
              structure.hits < 250000, // TODO Gradually increase hits for defenses
          });

          if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
      }
    }
  }
};
