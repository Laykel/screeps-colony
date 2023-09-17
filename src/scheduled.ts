// Remove any dead creep from memory
const cleanupMemory = () => {
  for (const name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      // TODO Here push to spawn queue if applicable
      delete Memory.creeps[name];
    }
  }
};

const checkAndUpdateState = (room: Room) => {
  // Once we arrive at 550 energy capacity, activate static mining mode
  if (room.memory.mode === 'game_start' && room.energyCapacityAvailable >= 550) {
    room.memory.mode = 'static_mining';
  }

  // When the first container is built, set its id in memory
  if (!room.memory.mainStorage) {
    const containers = room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER,
    }) as StructureContainer[];

    if (containers.length > 0) room.memory.mainStorage = containers[0].id;
  }

  // When a storage is built, switch to it as main storage
  if (room.storage && room.memory.mainStorage !== room.storage.id) {
    room.memory.mainStorage = room.storage.id;
  }
};

const checkForTowers = (room: Room) => {
  const towers = room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER,
  }) as StructureTower[];

  // Add any new tower to memory
  for (const tower of towers) {
    const towerIds = room.memory.towers.map(t => t.id);

    if (!towerIds.includes(tower.id)) {
      room.memory.towers.push({ id: tower.id });
    }
  }
};

export const runScheduledTasks = () => {
  if (Game.time % 7 === 0) {
    cleanupMemory();
  }
};

export const runRoomScheduledTasks = (room: Room) => {
  if (Game.time % 19 === 0) {
    checkForTowers(room);
  }

  if (Game.time % 31 === 0) {
    checkAndUpdateState(room);
  }
};
