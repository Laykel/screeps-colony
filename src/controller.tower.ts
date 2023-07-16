export const runTowerController = (tower: StructureTower) => {
  const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  if (closestHostile) {
    // Attack hostiles
    tower.attack(closestHostile);
  } else {
    // Repair structures
    // TODO Repair towers?
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType in [STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE] &&
        structure.hits < structure.hitsMax,
    });

    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
  }
};
