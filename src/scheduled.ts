// Remove any dead creep from memory
const cleanupMemory = () => {
  for (const name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      // TODO Here push to spawn queue if applicable
      delete Memory.creeps[name];
    }
  }
};

export const runScheduledTasks = () => {
  if (Game.time % 7 === 0) {
    cleanupMemory();
  }

  if (Game.time % 19 === 0) {
    const firstRoom = Game.rooms[Memory.firstRoomName];

    // Add any new tower to Memory.towerIds
    const towers = firstRoom.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_TOWER,
    }) as StructureTower[];

    for (const tower of towers) {
      if (!Memory.towerIds.includes(tower.id)) {
        Memory.towerIds.push(tower.id);
      }
    }

    console.log(`Used CPU this tick: ${Game.cpu.getUsed()}`);
  }

  if (Game.time % 31 === 0) {
    const firstRoom = Game.rooms[Memory.firstRoomName];

    // Once we arrive at 550 energyCapacityAvailable, activate static mining mode
    if (Memory.mode === 'game_start' && firstRoom.energyAvailable >= 550) {
      Memory.mode = 'static_mining';
    }

    // When the first container is made, set its id in memory
    if (!Memory.mainStorageId) {
      const containers = firstRoom.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER,
      }) as StructureContainer[];

      if (containers.length > 0) Memory.mainStorageId = containers[0].id;
    }

    // TODO When a container is built at one distance from a source, set a memory for the miner to adapt to container mining
  }
};
