import { firstRoomMemory } from './shared.logic';

// Remove any dead creep from memory
const cleanupMemory = () => {
  for (const name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      // TODO Here push to spawn queue if applicable
      delete Memory.creeps[name];
    }
  }
};

const checkAndUpdateState = (firstRoom: Room) => {
  // Once we arrive at 550 energy capacity, activate static mining mode
  if (Memory.mode === 'game_start' && firstRoom.energyCapacityAvailable >= 550) {
    Memory.mode = 'static_mining';
  }

  // When the first container is built, set its id in memory
  if (!firstRoomMemory().mainStorage) {
    const containers = firstRoom.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER,
    }) as StructureContainer[];

    if (containers.length > 0) firstRoomMemory().mainStorage = containers[0].id;
  }
};

const checkForTowers = (firstRoom: Room) => {
  const towers = firstRoom.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER,
  }) as StructureTower[];

  // Add any new tower to memory
  for (const tower of towers) {
    const towerIds = firstRoomMemory().towers;

    if (!towerIds.includes(tower.id)) {
      towerIds.push(tower.id);
    }
  }
};

export const runScheduledTasks = () => {
  if (Game.time % 7 === 0) {
    cleanupMemory();
  }

  if (Game.time % 19 === 0) {
    const firstRoom = Game.rooms[Memory.firstRoomName];

    checkForTowers(firstRoom);

    console.log(`Used CPU this tick: ${Game.cpu.getUsed()}`);
  }

  if (Game.time % 31 === 0) {
    const firstRoom = Game.rooms[Memory.firstRoomName];

    checkAndUpdateState(firstRoom);
  }
};
