import { findClosest, findStructureInRoom, handleRecharging, withdrawEnergy } from './shared.logic';

export const runBuilderRole = (creep: Creep) => {
  handleRecharging(creep, 'build');

  if (creep.memory.recharging) {
    withdrawEnergy(creep);
  } else {
    const container =
      Memory.mainStorageId &&
      (findStructureInRoom(creep.room, STRUCTURE_CONTAINER) as StructureContainer);

    if (!container || container.store.energy > 1200) {
      const target = findClosest(
        creep.pos,
        FIND_MY_CONSTRUCTION_SITES,
        creep.name,
      ) as ConstructionSite;

      if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  }
};
