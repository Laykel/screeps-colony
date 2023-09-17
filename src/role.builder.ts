import { findClosest, handleRecharging, withdrawEnergy } from './shared.logic';

export const runBuilderRole = (creep: Creep) => {
  handleRecharging(creep, 'build');

  if (creep.memory.recharging) {
    const mainStorageId = creep.room.memory.mainStorage;

    const storage = mainStorageId && Game.getObjectById(mainStorageId);

    if (!storage || storage.store.energy > 1200) {
      withdrawEnergy(creep);
    }
  } else {
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
};
