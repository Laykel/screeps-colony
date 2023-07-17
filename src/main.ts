import { runSpawnController } from './controller.spawn';
import { runCreepController } from './controller.creep';
import { runTowerController } from './controller.tower';
import { runScheduledTasks } from './scheduled';
import { firstRoomMemory } from './shared.logic';

const initMemory = () => {
  // Set basic info
  Memory.startingTick = Game.time;
  Memory.mode = 'game_start';
  Memory.firstSpawnName = 'Spawn1';

  const firstSpawn = Game.spawns[Memory.firstSpawnName];
  Memory.firstRoomName = firstSpawn.room.name;

  // Room memory
  const roomMemory = firstRoomMemory();

  roomMemory.sources = firstSpawn.room.find(FIND_SOURCES).map(source => source.id);
  roomMemory.towers = [];
  roomMemory.links = [];

  roomMemory.fortificationsMaxHits = 1000;
};

export const loop = () => {
  if (!Memory.startingTick) {
    initMemory();
  }

  // Execute tasks that don't run every tick
  runScheduledTasks();

  // Spawn creeps if applicable
  for (const name in Game.spawns) {
    const spawn = Game.spawns[name];
    runSpawnController(spawn, Game.time);
  }

  // Execute creep logic
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    runCreepController(creep);
  }

  // Execute tower logic
  for (const towerId of firstRoomMemory().towers) {
    const tower = Game.getObjectById(towerId);
    if (tower) {
      runTowerController(tower);
    }
  }
};
