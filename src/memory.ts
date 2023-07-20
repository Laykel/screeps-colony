export const initMemory = () => {
  Memory.startingTick = Game.time;
  Memory.firstSpawnName = 'Spawn1';

  const firstSpawn = Game.spawns[Memory.firstSpawnName];
  Memory.firstRoomName = firstSpawn.room.name;
};

export const initRoomMemory = (room: Room) => {
  room.memory.mode = 'game_start';
  room.memory.sources = room.find(FIND_SOURCES).map(source => source.id);

  room.memory.mainStorage = null;
  room.memory.towers = [];
  room.memory.links = [];

  room.memory.fortificationsMaxHits = 1000;
};
