// TODO Improve this...
export const runTowerController = () => {
  const tower = Game.getObjectById('64ac94f4026d2d2eca2ac937' as Id<StructureTower>);

  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax,
    });
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }
};
